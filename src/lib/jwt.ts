/**
 * JWT Token utilities for secure resume delivery
 * 
 * Uses jose library for signing and verification
 * Server-only implementation (no client-side access)
 */

import { SignJWT, jwtVerify } from 'jose'

/**
 * JWT Token Payload
 * Contains all data embedded in the signed token
 */
export interface ResumeTokenPayload {
  email: string
  issuedAt: number // Unix timestamp (seconds)
  expiresAt: number // Unix timestamp (seconds)
  downloadCount: number // Current download count (0-3)
}

/**
 * Get the secret key for JWT signing/verification
 * 
 * @throws Error if RESUME_TOKEN_SECRET is not set
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.RESUME_TOKEN_SECRET

  if (!secret || secret.trim().length === 0) {
    throw new Error(
      'RESUME_TOKEN_SECRET environment variable is MISSING or EMPTY. ' +
      'Please set RESUME_TOKEN_SECRET in your environment variables.'
    )
  }

  // Convert secret string to Uint8Array for jose
  // jose expects the secret as a Uint8Array or a KeyObject
  return new TextEncoder().encode(secret)
}

/**
 * Sign a resume token with embedded payload
 * 
 * @param payload - Token payload containing email, expiry, and download count
 * @returns Signed JWT token string
 * @throws Error if secret is missing or signing fails
 */
export async function signResumeToken(payload: ResumeTokenPayload): Promise<string> {
  const secretKey = getSecretKey()

  const jwt = await new SignJWT({
    email: payload.email,
    issuedAt: payload.issuedAt,
    expiresAt: payload.expiresAt,
    downloadCount: payload.downloadCount,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(payload.issuedAt)
    .setExpirationTime(payload.expiresAt)
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
  const secretKey = getSecretKey()

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    })

    // Validate payload structure
    if (
      typeof payload.email !== 'string' ||
      typeof payload.issuedAt !== 'number' ||
      typeof payload.expiresAt !== 'number' ||
      typeof payload.downloadCount !== 'number'
    ) {
      throw new Error('Invalid token payload structure')
    }

    // Return typed payload
    return {
      email: payload.email as string,
      issuedAt: payload.issuedAt as number,
      expiresAt: payload.expiresAt as number,
      downloadCount: payload.downloadCount as number,
    }
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more context
      throw new Error(`Token verification failed: ${error.message}`)
    }
    throw new Error('Token verification failed: Unknown error')
  }
}

/**
 * Create a new token with incremented download count
 * Used when a download is successful and we need to allow more downloads
 * 
 * @param currentPayload - Current token payload
 * @returns New signed token with incremented downloadCount
 */
export async function incrementDownloadCount(
  currentPayload: ResumeTokenPayload
): Promise<string> {
  const newPayload: ResumeTokenPayload = {
    email: currentPayload.email,
    issuedAt: currentPayload.issuedAt,
    expiresAt: currentPayload.expiresAt,
    downloadCount: currentPayload.downloadCount + 1,
  }

  return signResumeToken(newPayload)
}
