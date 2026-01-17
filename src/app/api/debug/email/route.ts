import { NextResponse } from 'next/server'
import { sendResumeEmail } from '@/lib/email'

// Ensure Node.js runtime (not Edge) for email sending
export const runtime = 'nodejs'

/**
 * GET /api/debug/email
 * 
 * Provider isolation endpoint for incident resolution
 * Tests email infrastructure independently of resume flow
 * 
 * Returns success ONLY if Resend returns an emailId
 * If this fails → email infra is broken
 * If this succeeds → resume flow logic is broken
 */
export async function GET() {
  try {
    // Validate environment variables first
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'RESEND_API_KEY is not set',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    if (!from) {
      return NextResponse.json(
        {
          success: false,
          error: 'RESEND_FROM is not set',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    // Test email configuration with hardcoded test email
    const testEmail = 'test@example.com'
    const testDownloadUrl = 'https://example.com/resume/download?token=test-token'
    const testExpiry = new Date()
    testExpiry.setHours(testExpiry.getHours() + 6)

    console.log('[DEBUG_EMAIL] Testing email infrastructure:', {
      timestamp: new Date().toISOString(),
      from,
      to: testEmail,
      hasApiKey: !!apiKey,
    })

    const emailResult = await sendResumeEmail({
      to: testEmail,
      downloadUrl: testDownloadUrl,
      expiresAt: testExpiry,
    })

    // Success ONLY if we got an emailId
    if (!emailResult || !emailResult.emailId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email sent but no emailId returned',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      emailId: emailResult.emailId,
      provider: emailResult.provider,
      message: 'Email infrastructure test successful',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    }

    console.error('[DEBUG_EMAIL] Email infrastructure test failed:', errorDetails)

    return NextResponse.json(
      {
        success: false,
        error: errorDetails.message,
        stack: process.env.NODE_ENV === 'development' ? errorDetails.stack : undefined,
        timestamp: errorDetails.timestamp,
      },
      { status: 500 }
    )
  }
}
