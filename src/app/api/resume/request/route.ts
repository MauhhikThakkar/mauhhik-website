import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { sendResumeEmail } from '@/lib/email'
import { storeResumeRequest } from '@/lib/resumeStorage'

// Ensure Node.js runtime (not Edge) for crypto and file system access
export const runtime = 'nodejs'

interface ResumeRequest {
  email: string
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

    // Send email with static resume PDF link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mauhhik.com'
    const resumeUrl = `${siteUrl}/resume/Mauhik_Thakkar_Product_Manager_Resume.pdf`

    // Attempt to send email - HARD FAIL if it doesn't work
    let emailResult: { emailId: string; provider: 'resend' }
    try {
      emailResult = await sendResumeEmail({
        to: email.trim(),
        downloadUrl: resumeUrl,
        expiresAt: expiry,
      })
      console.log(`[RESUME_INCIDENT] Email accepted by Resend`)
      console.log(`[RESUME_INCIDENT] Email ID: ${emailResult.emailId}`)
      console.log(`[RESUME_INCIDENT] Provider: ${emailResult.provider}`)
    } catch (emailError) {
      // Log full error details with incident tag
      const error = emailError instanceof Error ? emailError : new Error(String(emailError))
      
      console.error('[RESUME_INCIDENT] Email sending failed')
      console.error(`[RESUME_INCIDENT] Error message: ${error.message}`)
      console.error(`[RESUME_INCIDENT] Error stack: ${error.stack}`)
      console.error(`[RESUME_INCIDENT] Error name: ${error.name}`)
      console.error(`[RESUME_INCIDENT] Recipient: ${email.trim()}`)
      console.error(`[RESUME_INCIDENT] Has RESEND_API_KEY: ${!!process.env.RESEND_API_KEY}`)
      console.error(`[RESUME_INCIDENT] Has RESEND_FROM: ${!!process.env.RESEND_FROM}`)
      console.error(`[RESUME_INCIDENT] Resume URL: ${resumeUrl.substring(0, 50)}...`)
      console.error(`[RESUME_INCIDENT] Expires: ${expiry.toISOString()}`)
      
      // ALWAYS throw - no silent failures, no false success
      throw error
    }

    // Validate email result
    if (!emailResult || !emailResult.emailId) {
      const error = new Error('Email was sent but no email ID was returned')
      console.error('[RESUME_INCIDENT] No email ID in result object')
      console.error(`[RESUME_INCIDENT] Result: ${JSON.stringify(emailResult, null, 2)}`)
      throw error
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
    // SINGLE TOP-LEVEL CATCH: Log everything with incident tag
    const errorDetails = {
      timestamp: new Date().toISOString(),
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      nodeEnv: process.env.NODE_ENV,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasResendFrom: !!process.env.RESEND_FROM,
      runtime: 'nodejs', // Explicitly logged
    }
    
    console.error('[RESUME_INCIDENT] Request failed')
    console.error('[RESUME_INCIDENT] Full error object:', JSON.stringify(errorDetails, null, 2))
    console.error('[RESUME_INCIDENT] Error stack:', errorDetails.stack)
    
    // Return 500 for ANY error - no fallback success
    return NextResponse.json(
      { error: 'Failed to process resume request. Please try again later.' },
      { status: 500 }
    )
  }
}
