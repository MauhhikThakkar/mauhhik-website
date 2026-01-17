import { NextResponse } from 'next/server'

// Ensure Node.js runtime
export const runtime = 'nodejs'

/**
 * GET /api/debug/env
 * 
 * Environment validation endpoint for incident resolution
 * Returns deployment truth about email configuration
 */
export async function GET() {
  const hasResendKey = !!process.env.RESEND_API_KEY
  const hasResendFrom = !!process.env.RESEND_FROM
  
  // Mask the actual value for security
  const resendFromValue = process.env.RESEND_FROM
    ? `${process.env.RESEND_FROM.substring(0, 3)}***@${process.env.RESEND_FROM.split('@')[1] || '***'}`
    : null

  return NextResponse.json({
    hasResendKey,
    hasResendFrom,
    resendFromValue,
    runtime: 'nodejs',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}
