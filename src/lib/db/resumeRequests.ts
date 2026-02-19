/**
 * Resume Requests Database Operations
 * 
 * Server-only database operations for resume download enforcement.
 * Uses database as the single source of truth for download limits.
 * 
 * Database Schema:
 * CREATE TABLE resume_requests (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email VARCHAR(255) NOT NULL,
 *   token_hash VARCHAR(255) NOT NULL UNIQUE,
 *   download_count INTEGER NOT NULL DEFAULT 0,
 *   expires_at TIMESTAMP NOT NULL,
 *   created_at TIMESTAMP NOT NULL DEFAULT NOW()
 * );
 * 
 * Indexes:
 * CREATE INDEX idx_token_hash ON resume_requests(token_hash);
 * CREATE INDEX idx_expires_at ON resume_requests(expires_at);
 */

import { createHash } from 'crypto'
import { Pool } from 'pg'

/**
 * Database connection interface
 * Works with any SQL database (Postgres, MySQL, etc.)
 */
export interface DatabaseConnection {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }>
}

/**
 * Resume Request Record
 */
export interface ResumeRequestRecord {
  id: string
  email: string
  token_hash: string
  download_count: number
  expires_at: Date
  created_at: Date
}

/**
 * Hash a token for storage
 * Uses SHA-256 for consistent hashing
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Shared PostgreSQL connection pool (canonical configuration)
 *
 * All database access in this project MUST go through this pool.
 *
 * Environment:
 * - Uses ONLY `process.env.DATABASE_URL` as the canonical connection string.
 * - Fails fast if `DATABASE_URL` is missing.
 *
 * Security / connectivity:
 * - SSL enabled with `rejectUnauthorized: false` to support managed providers
 *   like Neon, Supabase, or Vercel Postgres-compatible services.
 */
let pool: Pool | null = null

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    // Canonical, explicit failure when database URL is not configured
    throw new Error('DATABASE_URL is not configured.')
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  }

  return pool
}

/**
 * Get database connection
 *
 * Returns a light wrapper around the shared Pool instance that matches the
 * `DatabaseConnection` interface used throughout this file.
 */
function getDatabase(): DatabaseConnection {
  const poolInstance = getPool()

  return {
    query: async <T = unknown>(sql: string, params?: unknown[]) => {
      const result = await poolInstance.query(sql, params)

      return {
        rows: (result.rows || []) as T[],
        rowCount: result.rowCount ?? result.rows?.length ?? 0,
      }
    },
  }
}

/**
 * Create a new resume request record
 * 
 * @param email - User email
 * @param tokenHash - Hashed token
 * @param expiresAt - Expiration timestamp
 * @returns Created record ID
 */
export async function createResumeRequest(
  email: string,
  tokenHash: string,
  expiresAt: Date
): Promise<string> {
  const db = getDatabase()
  
  const query = `
    INSERT INTO resume_requests (email, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id
  `
  
  const result = await db.query<{ id: string }>(query, [
    email.toLowerCase().trim(),
    tokenHash,
    expiresAt,
  ])
  
  if (result.rows.length === 0) {
    throw new Error('Failed to create resume request record')
  }
  
  return result.rows[0].id
}

/**
 * Atomically increment download count
 * 
 * This is the CRITICAL enforcement function.
 * It uses an atomic UPDATE that only succeeds if:
 * - Token hash matches
 * - Token is not expired
 * - Download count is less than 3
 * 
 * @param tokenHash - Hashed token
 * @returns Updated download count, or null if update failed
 */
export async function incrementDownloadCount(tokenHash: string): Promise<number | null> {
  let db: DatabaseConnection
  try {
    db = getDatabase()
  } catch (dbError) {
    const errorMessage = dbError instanceof Error ? dbError.message : String(dbError)
    console.error('[DB_UPDATE] Failed to get database connection')
    console.error(`[DB_UPDATE] Error: ${errorMessage}`)
    throw new Error(`Database connection failed: ${errorMessage}`)
  }
  
  // Atomic update: only succeeds if all conditions are met
  const query = `
    UPDATE resume_requests
    SET download_count = download_count + 1
    WHERE token_hash = $1
      AND expires_at > NOW()
      AND download_count < 3
    RETURNING download_count, expires_at
  `
  
  try {
    const result = await db.query<{ download_count: number; expires_at: Date }>(query, [tokenHash])
    
    // Diagnostic: Log update result (safe, no secrets)
    console.log('[DB_UPDATE] UPDATE RESULT rowCount:', result.rowCount)
    console.log('[DB_UPDATE] UPDATE RESULT rows length:', result.rows.length)
    
    if (result.rows.length === 0) {
      console.log('[DB_UPDATE] No rows updated - token expired, limit reached, or invalid')
      return null // Update failed - token expired, limit reached, or invalid
    }
    
    const updatedCount = result.rows[0].download_count
    console.log('[DB_UPDATE] Update successful, new count:', updatedCount)
    return updatedCount
  } catch (queryError) {
    const errorMessage = queryError instanceof Error ? queryError.message : String(queryError)
    const errorName = queryError instanceof Error ? queryError.name : 'UnknownError'
    console.error('[DB_UPDATE] Database query failed')
    console.error(`[DB_UPDATE] Error name: ${errorName}`)
    console.error(`[DB_UPDATE] Error message: ${errorMessage}`)
    console.error(`[DB_UPDATE] Token hash: ${tokenHash.substring(0, 20)}...`)
    console.error(`[DB_UPDATE] Full error:`, queryError instanceof Error ? queryError.stack : String(queryError))
    throw new Error(`Database query failed: ${errorMessage}`)
  }
}

/**
 * Check if token is expired
 * 
 * @param tokenHash - Hashed token
 * @returns true if expired, false if not expired or not found
 */
export async function isTokenExpired(tokenHash: string): Promise<boolean> {
  const db = getDatabase()
  
  const query = `
    SELECT expires_at
    FROM resume_requests
    WHERE token_hash = $1
  `
  
  const result = await db.query<{ expires_at: Date }>(query, [tokenHash])
  
  if (result.rows.length === 0) {
    return true // Not found = treat as expired
  }
  
  const expiresAt = new Date(result.rows[0].expires_at)
  return expiresAt < new Date()
}

/**
 * Get current download count for a token
 * 
 * @param tokenHash - Hashed token
 * @returns Download count, or null if not found
 */
export async function getDownloadCount(tokenHash: string): Promise<number | null> {
  const db = getDatabase()
  
  const query = `
    SELECT download_count
    FROM resume_requests
    WHERE token_hash = $1
  `
  
  const result = await db.query<{ download_count: number }>(query, [tokenHash])
  
  if (result.rows.length === 0) {
    return null
  }
  
  return result.rows[0].download_count
}

/**
 * Get email for a token hash
 * 
 * @param tokenHash - Hashed token
 * @returns Email, or null if not found
 */
export async function getEmailForToken(tokenHash: string): Promise<string | null> {
  const db = getDatabase()
  
  const query = `
    SELECT email
    FROM resume_requests
    WHERE token_hash = $1
  `
  
  const result = await db.query<{ email: string }>(query, [tokenHash])
  
  if (result.rows.length === 0) {
    return null
  }
  
  return result.rows[0].email
}
