import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { sendResumeEmail } from '@/lib/email'
import { storeResumeRequest } from '@/lib/resumeStorage'

interface ResumeRequest {
  email: string
}

/**
 * POST /api/resume/request
 * 
 * Creates a resume request with secure token and sends email
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ResumeRequest = await request.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Generate secure random token (32 bytes = 64 hex characters)
    const token = randomBytes(32).toString('hex')

    // Calculate expiry (6 hours from now)
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 6)

    // Store request data
    const requestData = {
      token,
      email: email.toLowerCase().trim(),
      expiry: expiry.toISOString(),
      downloadCount: 0,
      maxDownloads: 3,
      createdAt: new Date().toISOString(),
    }

    await storeResumeRequest(requestData)

    // Send email with secure download link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mauhhik.dev'
    const downloadUrl = `${siteUrl}/resume/download?token=${token}`

    const isDevelopment = process.env.NODE_ENV === 'development'

    // Attempt to send email
    try {
      await sendResumeEmail({
        to: email.trim(),
        downloadUrl,
        expiresAt: expiry,
      })
    } catch (emailError) {
      // In development: log the link and continue (allow testing without email setup)
      if (isDevelopment) {
        console.log('\n' + '='.repeat(80))
        console.log('📧 EMAIL SENDING SKIPPED (Development Mode)')
        console.log('='.repeat(80))
        console.log(`To: ${email.trim()}`)
        console.log(`Download URL: ${downloadUrl}`)
        console.log(`Expires: ${expiry.toISOString()}`)
        console.log(`Token: ${token}`)
        console.log('='.repeat(80) + '\n')
        // Continue to return success response
      } else {
        // In production: email delivery is required
        console.error('Resume request email error:', {
          error: emailError instanceof Error ? emailError.message : String(emailError),
          email: email.trim(),
          token: token.substring(0, 8) + '...', // Log partial token for debugging
        })
        throw emailError // Re-throw to be caught by outer catch block
      }
    }

    // Return success response (don't expose token)
    return NextResponse.json(
      {
        success: true,
        message: 'Resume request processed. Please check your email for the download link.',
      },
      { status: 200 }
    )
  } catch (error) {
    // Enhanced error logging (server-side only)
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }
    console.error('Resume request error:', errorDetails)
    
    // Don't expose internal errors in production
    return NextResponse.json(
      { error: 'Failed to process resume request. Please try again later.' },
      { status: 500 }
    )
  }
}
