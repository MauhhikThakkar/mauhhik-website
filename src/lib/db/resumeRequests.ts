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
 * Supports:
 * 1. Vercel Postgres (@vercel/postgres) - recommended for Vercel deployments
 * 2. Generic PostgreSQL via DATABASE_URL (using pg library)
 * 3. Other databases via DATABASE_URL (requires custom client setup)
 * 
 * Installation:
 * - For Vercel: npm install @vercel/postgres
 * - For other PostgreSQL: npm install pg @types/pg
 */
function getDatabase(): DatabaseConnection {
  // Try Vercel Postgres first (recommended for Vercel)
  try {
    // Dynamic import to avoid build errors if package not installed
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
    // Vercel Postgres not available, try other options
  }

  // Try generic PostgreSQL via DATABASE_URL
  const connectionString = process.env.DATABASE_URL
  if (connectionString) {
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
    } catch {
      // pg library not available or connection failed
    }
  }

  // No database connection available
  throw new Error(
    'No database connection available.\n' +
    'Please install one of the following:\n' +
    '  - @vercel/postgres (for Vercel deployments)\n' +
    '  - pg (for PostgreSQL via DATABASE_URL)\n' +
    'Or set DATABASE_URL environment variable with your connection string.'
  )
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
  const db = getDatabase()
  
  // Atomic update: only succeeds if all conditions are met
  const query = `
    UPDATE resume_requests
    SET download_count = download_count + 1
    WHERE token_hash = $1
      AND expires_at > NOW()
      AND download_count < 3
    RETURNING download_count, expires_at
  `
  
  const result = await db.query<{ download_count: number; expires_at: Date }>(query, [tokenHash])
  
  if (result.rows.length === 0) {
    return null // Update failed - token expired, limit reached, or invalid
  }
  
  return result.rows[0].download_count
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
