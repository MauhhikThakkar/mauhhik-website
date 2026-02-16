/**
 * JWT Token utilities for secure resume delivery
 * 
 * Uses jose library for signing and verification
 * Server-only implementation (no client-side access)
 */

import { SignJWT, jwtVerify } from 'jose'

/**
 * JWT Token Payload
 * 
 * Simplified payload - database is source of truth for download limits.
 * JWT only contains:
 * - token_id: Unique identifier for this token
 * - email: User email
 * - exp: Expiration timestamp (standard JWT claim)
 */
export interface ResumeTokenPayload {
  token_id: string // Unique token identifier (UUID)
  email: string
  exp: number // Expiration timestamp (Unix seconds) - standard JWT claim
}

/**
 * Get the secret key for JWT signing/verification
 * 
 * @throws Error if RESUME_JWT_SECRET is not set
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.RESUME_JWT_SECRET
  if (!secret) {
    throw new Error('RESUME_JWT_SECRET not configured')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Sign a resume token with embedded payload
 * 
 * @param payload - Token payload containing token_id, email, and expiration
 * @returns Signed JWT token string
 * @throws Error if secret is missing or signing fails
 */
export async function signResumeToken(payload: ResumeTokenPayload): Promise<string> {
  const secretKey = getSecretKey()

  const jwt = await new SignJWT({
    token_id: payload.token_id,
    email: payload.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(payload.exp)
    .setSubject(payload.email)
    .sign(secretKey)

  return jwt
}

/**
 * Verify and decode a resume token
 * 
 * @param token - JWT token string to verify
 * @returns Decoded token payload if valid
 * @throws Error if token is invalid, expired, or secret is missing
 */
export async function verifyResumeToken(token: string): Promise<ResumeTokenPayload> {
  // Validate token format before attempting verification
  if (!token || typeof token !== 'string') {
    throw new Error('Token is required and must be a string')
  }

  // JWT format validation: should have 3 parts separated by dots
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error(`Invalid JWT format: expected 3 parts, got ${parts.length}`)
  }

  // Trim token to remove any whitespace
  const trimmedToken = token.trim()

  const secretKey = getSecretKey()

  try {
    const { payload } = await jwtVerify(trimmedToken, secretKey, {
      algorithms: ['HS256'],
    })

    // Validate payload structure
    if (
      typeof payload.token_id !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.exp !== 'number'
    ) {
      throw new Error('Invalid token payload structure')
    }

    // Return typed payload
    return {
      token_id: payload.token_id as string,
      email: payload.email as string,
      exp: payload.exp as number,
    }
  } catch (error) {
    if (error instanceof Error) {
      // Provide more specific error messages
      if (error.message.includes('signature') || error.message.includes('invalid')) {
        throw new Error(`Token verification failed: Invalid signature or token format - ${error.message}`)
      }
      if (error.message.includes('expired')) {
        throw new Error(`Token verification failed: Token expired - ${error.message}`)
      }
      // Re-throw with more context
      throw new Error(`Token verification failed: ${error.message}`)
    }
    throw new Error('Token verification failed: Unknown error')
  }
}

