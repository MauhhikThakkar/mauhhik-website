import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { incrementDownloadCount } from '@/lib/resumeStorage'

/**
 * GET /api/resume/download?token=...
 * 
 * Secure resume download endpoint
 * Validates token and serves PDF if valid
 */
export async function GET(request: NextRequest) {
  try {
    // Extract token from query params
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    // Validate token exists
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid download link. Please request a new one.' },
        { status: 400 }
      )
    }

    // Validate and increment download count atomically
    // This single operation handles all validation (exists, expired, limit)
    const incrementResult = await incrementDownloadCount(token.trim())

    if (!incrementResult.success) {
      // Provide specific error messages based on failure reason
      switch (incrementResult.reason) {
        case 'not_found':
          return NextResponse.json(
            { error: 'This download link is invalid. Please request a new one.' },
            { status: 404 }
          )
        case 'expired':
          return NextResponse.json(
            { error: 'This download link has expired. Please request a new one.' },
            { status: 410 } // 410 Gone is more appropriate for expired resources
          )
        case 'limit_reached':
          return NextResponse.json(
            { error: 'Download limit reached. You can request a new link if needed.' },
            { status: 403 }
          )
        default:
          return NextResponse.json(
            { error: 'Unable to process download. Please try again.' },
            { status: 500 }
          )
      }
    }

    // Get resume file path
    // Try multiple possible locations
    const possiblePaths = [
      join(process.cwd(), 'public', 'resume.pdf'),
      join(process.cwd(), 'resume.pdf'),
      join(process.cwd(), 'data', 'resume.pdf'),
    ]

    let resumePath: string | null = null
    let resumeBuffer: Buffer | null = null

    // Try to find and read the resume file
    for (const path of possiblePaths) {
      try {
        resumeBuffer = await readFile(path)
        resumePath = path
        break
      } catch {
        // File doesn't exist at this path, try next
        continue
      }
    }

    // If resume file not found, return error
    if (!resumeBuffer || !resumePath) {
      console.error('Resume PDF file not found. Expected locations:', possiblePaths)
      return NextResponse.json(
        { error: 'Resume file not available. Please contact support.' },
        { status: 500 }
      )
    }

    // Return PDF file with appropriate headers
    // Convert Buffer to Uint8Array for NextResponse compatibility
    const pdfData = new Uint8Array(resumeBuffer)
    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Mauhhik-Resume.pdf"`,
        'Content-Length': resumeBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Resume download error:', error)
    
    // Don't expose internal errors
    return NextResponse.json(
      { error: 'An error occurred while processing your download request.' },
      { status: 500 }
    )
  }
}
