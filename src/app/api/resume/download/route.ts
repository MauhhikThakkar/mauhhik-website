import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/resume/download?token=...
 * 
 * SERVERLESS-SAFE: Redirects to static file in /public/resume/
 * 
 * This endpoint logs download attempts and redirects to the static PDF file.
 * The PDF is served directly by Next.js from /public/resume/ folder.
 * 
 * NOTE: Token validation is disabled in serverless mode.
 * For production, implement JWT tokens with embedded expiry or database lookup.
 */
export async function GET(request: NextRequest) {
  try {
    // Extract token from query params (for logging only)
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    // Log download attempt (serverless-safe)
    if (token) {
      console.log(`[RESUME_DOWNLOAD] Download requested for token: ${token.substring(0, 8)}...`)
    } else {
      console.log('[RESUME_DOWNLOAD] Download requested without token')
    }

    // Redirect to static file in /public/resume/
    // Next.js automatically serves files from /public/ folder
    // This is fully serverless-safe - no filesystem operations needed
    const resumeUrl = '/resume/Mauhik_Thakkar_Product_Manager_Resume.pdf'
    
    return NextResponse.redirect(new URL(resumeUrl, request.url), {
      status: 302, // Temporary redirect
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
