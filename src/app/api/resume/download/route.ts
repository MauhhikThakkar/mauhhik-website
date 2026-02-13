import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { verifyResumeToken, incrementDownloadCount, type ResumeTokenPayload } from '@/lib/jwt'

// Ensure Node.js runtime (not Edge) for filesystem operations
export const runtime = 'nodejs'

/**
 * Maximum allowed downloads per token
 */
const MAX_DOWNLOADS = 3

/**
 * GET /api/resume/download?token=...
 * 
 * SERVERLESS-SAFE: Verifies JWT token and streams PDF from /public/resume/
 * 
 * This endpoint:
 * 1. Verifies the JWT token signature
 * 2. Validates token expiry
 * 3. Checks download count limit
 * 4. Streams the PDF file
 * 5. Returns new token with incremented download count (if under limit)
 */
export async function GET(request: NextRequest) {
  try {
    // Extract token from query params
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      console.log('[RESUME_DOWNLOAD] Download requested without token')
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Verify and decode token
    let tokenPayload: ResumeTokenPayload
    try {
      tokenPayload = await verifyResumeToken(token)
      console.log(`[RESUME_DOWNLOAD] Token verified for email: ${tokenPayload.email.substring(0, 3)}...`)
    } catch (verifyError) {
      const errorMessage = verifyError instanceof Error ? verifyError.message : 'Unknown error'
      console.error(`[RESUME_DOWNLOAD] Token verification failed: ${errorMessage}`)
      
      // Return expired/invalid response
      return NextResponse.json(
        { 
          error: 'Invalid or expired download link',
          reason: errorMessage.includes('expired') ? 'expired' : 'invalid_token'
        },
        { status: 401 }
      )
    }

    // Validate token expiry
    const now = Math.floor(Date.now() / 1000)
    if (tokenPayload.expiresAt < now) {
      console.log(`[RESUME_DOWNLOAD] Token expired for email: ${tokenPayload.email.substring(0, 3)}...`)
      return NextResponse.json(
        { 
          error: 'Download link has expired',
          reason: 'expired'
        },
        { status: 401 }
      )
    }

    // Validate download count
    if (tokenPayload.downloadCount >= MAX_DOWNLOADS) {
      console.log(`[RESUME_DOWNLOAD] Download limit reached for email: ${tokenPayload.email.substring(0, 3)}... (count: ${tokenPayload.downloadCount})`)
      return NextResponse.json(
        { 
          error: 'Download limit reached. Maximum 3 downloads per link.',
          reason: 'download_limit_reached'
        },
        { status: 403 }
      )
    }

    // Read PDF file from /public/resume/
    // In Next.js, public files are accessible via process.cwd() + /public
    const pdfPath = join(process.cwd(), 'public', 'resume', 'Mauhik_Thakkar_Product_Manager_Resume.pdf')
    
    let pdfBuffer: Buffer
    try {
      pdfBuffer = await readFile(pdfPath)
      console.log(`[RESUME_DOWNLOAD] PDF file read successfully (${pdfBuffer.length} bytes)`)
    } catch (fileError) {
      console.error(`[RESUME_DOWNLOAD] Failed to read PDF file: ${fileError instanceof Error ? fileError.message : String(fileError)}`)
      return NextResponse.json(
        { error: 'Failed to retrieve resume file' },
        { status: 500 }
      )
    }

    // Generate new token with incremented download count
    // This allows the user to download again (up to 3 times)
    const newToken = await incrementDownloadCount(tokenPayload)
    
    console.log(`[RESUME_DOWNLOAD] Download successful for email: ${tokenPayload.email.substring(0, 3)}... (count: ${tokenPayload.downloadCount + 1}/${MAX_DOWNLOADS})`)

    // Return PDF with new token in response header
    // Client can use this token for subsequent downloads
    // NextResponse accepts Buffer directly
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Mauhik_Thakkar_Product_Manager_Resume.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
        'X-Resume-Token': newToken, // New token for subsequent downloads
        'X-Download-Count': (tokenPayload.downloadCount + 1).toString(),
        'X-Max-Downloads': MAX_DOWNLOADS.toString(),
      },
    })
  } catch (error) {
    console.error('[RESUME_DOWNLOAD] Error:', error)
    
    // Return error response
    return NextResponse.json(
      { error: 'An error occurred while processing your download request.' },
      { status: 500 }
    )
  }
}
