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
 * Get database connection
 * 
 * Uses DATABASE_URL for all database queries.
 * 
 * Supports:
 * 1. DATABASE_URL environment variable (primary method)
 * 2. Vercel Postgres (@vercel/postgres) - uses DATABASE_URL internally
 * 
 * Installation:
 * - For Vercel: npm install @vercel/postgres (sets DATABASE_URL automatically)
 * - For other PostgreSQL: npm install pg @types/pg
 * 
 * DATABASE_URL format: postgresql://user:password@host:port/database
 */
function getDatabase(): DatabaseConnection {
  // DATABASE_URL is the source of truth for all database connections
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is required.\n' +
      'Please set DATABASE_URL with your database connection string.\n' +
      'For Vercel Postgres, DATABASE_URL is set automatically when you install @vercel/postgres.'
    )
  }

  // Try Vercel Postgres first (uses DATABASE_URL internally)
  // Vercel Postgres SDK is optimized for serverless environments
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const vercelPostgres = require('@vercel/postgres')
    if (vercelPostgres && vercelPostgres.sql) {
      return {
        query: async (queryText: string, params?: unknown[]) => {
          const result = await vercelPostgres.sql.query(queryText, params || [])
          return {
            rows: result.rows || [],
            rowCount: result.rowCount || 0,
          }
        },
      }
    }
  } catch {
    // Vercel Postgres not available, use generic PostgreSQL client with DATABASE_URL
  }

  // Use generic PostgreSQL client with DATABASE_URL
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Client } = require('pg')
    const client = new Client({ connectionString })
    
    // Note: Connection pooling should be handled at application level
    // For production, use a connection pool manager
    return {
      query: async (queryText: string, params?: unknown[]) => {
        await client.connect()
        try {
          const result = await client.query(queryText, params || [])
          return {
            rows: result.rows || [],
            rowCount: result.rowCount || 0,
          }
        } finally {
          await client.end()
        }
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(
      `Failed to create database connection using DATABASE_URL.\n` +
      `Error: ${errorMessage}\n` +
      `Please ensure DATABASE_URL is set correctly and pg library is installed.`
    )
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
