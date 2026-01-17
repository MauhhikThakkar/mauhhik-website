import { NextResponse } from 'next/server'
import { sendResumeEmail } from '@/lib/email'

// Ensure Node.js runtime (not Edge) for email sending
export const runtime = 'nodejs'

/**
 * GET /api/debug/resend
 * 
 * Temporary debug route to test Resend email configuration
 * This route should be removed or protected in production
 */
export async function GET() {
  try {
    // Validate environment variables first
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM

    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: 'RESEND_API_KEY is not set',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    if (!from) {
      return NextResponse.json(
        {
          ok: false,
          error: 'RESEND_FROM is not set',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    // Test email configuration
    const testEmail = 'test@example.com'
    const testDownloadUrl = 'https://example.com/resume/download?token=test-token'
    const testExpiry = new Date()
    testExpiry.setHours(testExpiry.getHours() + 6)

    console.log('[DEBUG/RESEND] Testing email configuration:', {
      timestamp: new Date().toISOString(),
      from,
      to: testEmail,
      hasApiKey: !!apiKey,
    })

    const emailId = await sendResumeEmail({
      to: testEmail,
      downloadUrl: testDownloadUrl,
      expiresAt: testExpiry,
    })

    return NextResponse.json({
      success: true,
      emailId,
      message: 'Resend email test successful',
      timestamp: new Date().toISOString(),
      config: {
        from,
        hasApiKey: true,
      },
    })
  } catch (error) {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    }

    console.error('[DEBUG/RESEND] Email test failed:', errorDetails)

    return NextResponse.json(
      {
        ok: false,
        error: errorDetails.message,
        stack: process.env.NODE_ENV === 'development' ? errorDetails.stack : undefined,
        timestamp: errorDetails.timestamp,
      },
      { status: 500 }
    )
  }
}
