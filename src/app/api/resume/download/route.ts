import { NextRequest, NextResponse } from 'next/server'
import { createReadStream, statSync } from 'fs'
import { join } from 'path'
import { verifyResumeToken, type ResumeTokenPayload } from '@/lib/jwt'
import { hashToken, incrementDownloadCount } from '@/lib/db/resumeRequests'

// Ensure Node.js runtime (not Edge) for filesystem operations
export const runtime = 'nodejs'

/**
 * Maximum allowed downloads per token
 */
const MAX_DOWNLOADS = 3

/**
 * Server-only path to resume PDF file
 * Located outside /public to prevent direct URL access
 */
const RESUME_FILE_PATH = join(process.cwd(), 'data', 'private', 'resume.pdf')

/**
 * GET /api/resume/download?token=...
 * 
 * SECURE DOWNLOAD ENDPOINT: Database-enforced 6-hour expiration and 3-download limit
 * 
 * CRITICAL ENFORCEMENT FLOW:
 * 1. Extract token from query params
 * 2. Verify JWT signature (validates token_id, email, exp)
 * 3. Hash token for database lookup
 * 4. ATOMIC DB UPDATE (THE GATE):
 *    - UPDATE resume_requests
 *    - SET download_count = download_count + 1
 *    - WHERE token_hash = ? AND expires_at > NOW() AND download_count < 3
 * 5. If affectedRows === 0:
 *    - Check if expired → return 410
 *    - Else return 403 (limit reached or invalid)
 * 6. If update succeeded → stream file
 * 
 * Security:
 * - Database is single source of truth (no JWT payload, no in-memory state)
 * - Atomic update prevents race conditions
 * - Resume file stored in server-only directory
 * - Token not regenerated (single token remains valid until limit reached)
 */
export async function GET(request: NextRequest) {
  // Fail fast if JWT secret is not configured
  if (!process.env.RESUME_JWT_SECRET) {
    throw new Error('Server misconfiguration: RESUME_JWT_SECRET missing')
  }

  const downloadAttemptTimestamp = new Date().toISOString()
  let token: string | null = null
  let tokenPayload: ResumeTokenPayload | null = null
  let tokenHash: string | null = null
  let email: string | null = null

  try {
    // Step 1: Extract token from query params
    const searchParams = request.nextUrl.searchParams
    token = searchParams.get('token')

    if (!token) {
      console.log('[RESUME_DOWNLOAD] Download requested without token')
      console.log(`[RESUME_DOWNLOAD] Timestamp: ${downloadAttemptTimestamp}`)
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Log download attempt
    console.log(`[RESUME_DOWNLOAD] Download attempt`)
    console.log(`[RESUME_DOWNLOAD] Token: ${token.substring(0, 20)}...`)
    console.log(`[RESUME_DOWNLOAD] Timestamp: ${downloadAttemptTimestamp}`)

    // Step 2: Verify JWT signature and decode payload
    try {
      tokenPayload = await verifyResumeToken(token)
      console.log(`[RESUME_DOWNLOAD] Token verified successfully`)
      console.log(`[RESUME_DOWNLOAD] Token ID: ${tokenPayload.token_id}`)
      console.log(`[RESUME_DOWNLOAD] Email: ${tokenPayload.email.substring(0, 3)}...`)
      console.log(`[RESUME_DOWNLOAD] Expires at: ${new Date(tokenPayload.exp * 1000).toISOString()}`)
    } catch (verifyError) {
      const errorMessage = verifyError instanceof Error ? verifyError.message : 'Unknown error'
      console.error(`[RESUME_DOWNLOAD] Token verification failed`)
      console.error(`[RESUME_DOWNLOAD] Token: ${token.substring(0, 20)}...`)
      console.error(`[RESUME_DOWNLOAD] Error: ${errorMessage}`)
      console.error(`[RESUME_DOWNLOAD] Timestamp: ${downloadAttemptTimestamp}`)
      
      // Return invalid token response
      return NextResponse.json(
        { 
          error: 'Invalid download link',
          reason: 'invalid_token'
        },
        { status: 401 }
      )
    }

    // Ensure tokenPayload is not null (TypeScript guard)
    if (!tokenPayload) {
      throw new Error('Token payload is null after verification')
    }

    // Step 3: Hash token for database lookup
    tokenHash = hashToken(token)
    console.log(`[RESUME_DOWNLOAD] Token hashed: ${tokenHash.substring(0, 20)}...`)

    // Step 4: ATOMIC DATABASE UPDATE (THE GATE)
    // This is the CRITICAL enforcement point - database is the gate
    // NO LOGIC BEFORE THIS - database decides if download is allowed
    const newDownloadCount = await incrementDownloadCount(tokenHash)

    // Step 5: Check if update succeeded
    if (newDownloadCount === null) {
      // Update failed - no SELECT queries, use JWT payload for logging
      console.warn(`[RESUME_DOWNLOAD] Atomic update failed (token expired, limit reached, or invalid)`)
      console.warn(`[RESUME_DOWNLOAD] Token hash: ${tokenHash.substring(0, 20)}...`)
      console.warn(`[RESUME_DOWNLOAD] Email: ${tokenPayload.email.substring(0, 3)}...`)
      console.warn(`[RESUME_DOWNLOAD] Token expires at: ${new Date(tokenPayload.exp * 1000).toISOString()}`)
      console.warn(`[RESUME_DOWNLOAD] Current time: ${new Date().toISOString()}`)
      console.warn(`[RESUME_DOWNLOAD] Timestamp: ${downloadAttemptTimestamp}`)

      // Determine error type without SELECT queries
      // Use JWT expiration time to determine if expired
      const now = Math.floor(Date.now() / 1000)
      const isExpired = tokenPayload.exp < now
      
      if (isExpired) {
        console.warn(`[RESUME_DOWNLOAD] Download blocked: Token expired`)
        
        // Return 410 (Gone) for expired tokens
        return NextResponse.json(
          { 
            error: 'Download link expired',
            reason: 'expired'
          },
          { status: 410 }
        )
      } else {
        console.warn(`[RESUME_DOWNLOAD] Download blocked: Limit reached or invalid token`)
        
        // Return 403 (Forbidden) for limit reached or invalid
        return NextResponse.json(
          { 
            error: 'Download limit reached. Maximum 3 downloads per link.',
            reason: 'download_limit_reached'
          },
          { status: 403 }
        )
      }
    }

    // Step 6: Update succeeded - proceed with file streaming
    // Use JWT payload email for logging (no SELECT query)
    email = tokenPayload.email

    console.log(`[RESUME_DOWNLOAD] Atomic update succeeded`)
    console.log(`[RESUME_DOWNLOAD] Email: ${email.substring(0, 3)}...`)
    console.log(`[RESUME_DOWNLOAD] New download count: ${newDownloadCount}/${MAX_DOWNLOADS}`)
    console.log(`[RESUME_DOWNLOAD] Token hash: ${tokenHash.substring(0, 20)}...`)
    console.log(`[RESUME_DOWNLOAD] Timestamp: ${downloadAttemptTimestamp}`)

    // Verify file exists and get file stats
    let fileStats: ReturnType<typeof statSync>
    try {
      fileStats = statSync(RESUME_FILE_PATH)
      console.log(`[RESUME_DOWNLOAD] Resume file found: ${fileStats.size} bytes`)
    } catch (fileStatError) {
      const errorMessage = fileStatError instanceof Error ? fileStatError.message : String(fileStatError)
      console.error(`[RESUME_DOWNLOAD] Failed to access resume file`)
      console.error(`[RESUME_DOWNLOAD] Path: ${RESUME_FILE_PATH}`)
      console.error(`[RESUME_DOWNLOAD] Error: ${errorMessage}`)
      console.error(`[RESUME_DOWNLOAD] Email: ${email.substring(0, 3)}...`)
      console.error(`[RESUME_DOWNLOAD] Download count: ${newDownloadCount}/${MAX_DOWNLOADS}`)
      console.error(`[RESUME_DOWNLOAD] Timestamp: ${downloadAttemptTimestamp}`)
      
      return NextResponse.json(
        { error: 'Failed to retrieve resume file' },
        { status: 500 }
      )
    }

    // Create read stream and return PDF
    const fileStream = createReadStream(RESUME_FILE_PATH)
    
    console.log(`[RESUME_DOWNLOAD] Download successful`)
    console.log(`[RESUME_DOWNLOAD] Email: ${email.substring(0, 3)}...`)
    console.log(`[RESUME_DOWNLOAD] Download count: ${newDownloadCount}/${MAX_DOWNLOADS}`)
    console.log(`[RESUME_DOWNLOAD] File size: ${fileStats.size} bytes`)
    console.log(`[RESUME_DOWNLOAD] Timestamp: ${downloadAttemptTimestamp}`)

    // Return PDF stream (no token regeneration - single token remains valid)
    return new NextResponse(fileStream as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Mauhik_Thakkar_Product_Manager_Resume.pdf"',
        'Content-Length': fileStats.size.toString(),
        'X-Download-Count': newDownloadCount.toString(),
        'X-Max-Downloads': MAX_DOWNLOADS.toString(),
      },
    })
  } catch (error) {
    // Comprehensive error logging
    const errorDetails = {
      timestamp: downloadAttemptTimestamp,
      token: token ? `${token.substring(0, 20)}...` : 'missing',
      tokenHash: tokenHash ? `${tokenHash.substring(0, 20)}...` : 'missing',
      email: email ? `${email.substring(0, 3)}...` : 'unknown',
      tokenPayload: tokenPayload ? {
        token_id: tokenPayload.token_id,
        email: `${tokenPayload.email.substring(0, 3)}...`,
        exp: new Date(tokenPayload.exp * 1000).toISOString(),
      } : null,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : String(error),
    }
    
    console.error('[RESUME_DOWNLOAD] Unexpected error occurred')
    console.error(`[RESUME_DOWNLOAD] Error details: ${JSON.stringify(errorDetails, null, 2)}`)
    
    // Return generic error response (don't expose internal details)
    return NextResponse.json(
      { error: 'An error occurred while processing your download request.' },
      { status: 500 }
    )
  }
}
