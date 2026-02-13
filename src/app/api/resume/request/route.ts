import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { sendResumeEmail } from '@/lib/email'
import { storeResumeRequest } from '@/lib/resumeStorage'

// Ensure Node.js runtime (not Edge) for crypto and file system access
export const runtime = 'nodejs'

interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

interface ResumeRequest {
  email: string
  utmParams?: UtmParams
}

/**
 * POST /api/resume/request
 * 
 * Creates a resume request with secure token and sends email using Resend
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ResumeRequest = await request.json()
    const { email, utmParams } = body

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

    // Store request data with UTM params if available
    const requestData = {
      token,
      email: email.toLowerCase().trim(),
      expiry: expiry.toISOString(),
      downloadCount: 0,
      maxDownloads: 3,
      createdAt: new Date().toISOString(),
      ...(utmParams && Object.keys(utmParams).length > 0 && { utmParams }),
    }
    
    // Log UTM params if present
    if (utmParams && Object.keys(utmParams).length > 0) {
      console.log(`[RESUME_REQUEST] UTM params:`, JSON.stringify(utmParams, null, 2))
    }

    await storeResumeRequest(requestData)

    // Send email with static resume PDF link
    // Use explicit production URL to ensure reliability
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mauhhik.com'
    const resumeUrl = `${siteUrl}/resume/Mauhik_Thakkar_Product_Manager_Resume.pdf`

    console.log(`[RESUME_REQUEST] Processing resume request`)
    console.log(`[RESUME_REQUEST] Email: ${email.trim()}`)
    console.log(`[RESUME_REQUEST] Resume URL: ${resumeUrl}`)
    console.log(`[RESUME_REQUEST] Expires: ${expiry.toISOString()}`)

    // Attempt to send email - HARD FAIL if it doesn't work
    let emailResult: { emailId: string; provider: 'resend' }
    try {
      emailResult = await sendResumeEmail({
        to: email.trim(),
        downloadUrl: resumeUrl,
        expiresAt: expiry,
        attachPdf: true, // Attach PDF by fetching from URL
      })
      console.log(`[RESUME_REQUEST] Email sent successfully`)
      console.log(`[RESUME_REQUEST] Email ID: ${emailResult.emailId}`)
      console.log(`[RESUME_REQUEST] Provider: ${emailResult.provider}`)
    } catch (emailError) {
      // Log full error details with clear context
      const error = emailError instanceof Error ? emailError : new Error(String(emailError))
      
      console.error('[RESUME_REQUEST] Email sending failed')
      console.error(`[RESUME_REQUEST] Error type: ${error.name}`)
      console.error(`[RESUME_REQUEST] Error message: ${error.message}`)
      console.error(`[RESUME_REQUEST] Error stack: ${error.stack}`)
      console.error(`[RESUME_REQUEST] Recipient: ${email.trim()}`)
      console.error(`[RESUME_REQUEST] Resume URL: ${resumeUrl}`)
      console.error(`[RESUME_REQUEST] Environment check:`)
      console.error(`  - NODE_ENV: ${process.env.NODE_ENV}`)
      console.error(`  - Has RESEND_API_KEY: ${!!process.env.RESEND_API_KEY}`)
      console.error(`  - Has RESEND_FROM: ${!!process.env.RESEND_FROM}`)
      console.error(`  - RESEND_FROM value: ${process.env.RESEND_FROM || 'NOT SET'}`)
      
      // ALWAYS throw - no silent failures, no false success
      throw error
    }

    // Validate email result
    if (!emailResult || !emailResult.emailId) {
      const error = new Error('Email was sent but no email ID was returned from Resend API')
      console.error('[RESUME_REQUEST] Validation failed: No email ID in result')
      console.error(`[RESUME_REQUEST] Result object: ${JSON.stringify(emailResult, null, 2)}`)
      throw error
    }

    // Return success response (don't expose token)
    console.log(`[RESUME_REQUEST] Request completed successfully`)
    return NextResponse.json(
      {
        success: true,
        message: 'Resume request processed. Please check your email for the download link.',
      },
      { status: 200 }
    )
  } catch (error) {
    // SINGLE TOP-LEVEL CATCH: Log everything with clear context
    const errorDetails = {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError',
      nodeEnv: process.env.NODE_ENV,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasResendFrom: !!process.env.RESEND_FROM,
      runtime: 'nodejs',
    }
    
    console.error('[RESUME_REQUEST] Request failed with error')
    console.error(`[RESUME_REQUEST] Error name: ${errorDetails.name}`)
    console.error(`[RESUME_REQUEST] Error message: ${errorDetails.message}`)
    console.error(`[RESUME_REQUEST] Full error details:`, JSON.stringify(errorDetails, null, 2))
    if (errorDetails.stack) {
      console.error(`[RESUME_REQUEST] Error stack: ${errorDetails.stack}`)
    }
    
    // Return 500 with meaningful error message
    const errorMessage = error instanceof Error 
      ? `Failed to process resume request: ${error.message}`
      : 'Failed to process resume request. Please try again later.'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
