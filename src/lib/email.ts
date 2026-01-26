import { Resend } from 'resend'

interface EmailConfig {
  to: string
  downloadUrl: string
  expiresAt: Date
  attachPdf?: boolean // Optional: attach PDF by fetching from URL
}

/**
 * Validate that sender domain is not a free email provider
 */
function validateSenderDomain(from: string): void {
  const freeEmailDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
    'yandex.com',
    'zoho.com',
  ]

  const domain = from.split('@')[1]?.toLowerCase()
  if (!domain) {
    throw new Error(`Invalid sender email format: ${from}`)
  }

  if (freeEmailDomains.includes(domain)) {
    throw new Error(
      `Sender domain "${domain}" is a free email provider. Resend requires a verified custom domain. Please use a domain verified in your Resend account.`
    )
  }
}

/**
 * Initialize Resend client with API key
 * Throws immediately if API key is missing
 */
function createResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    const error = new Error(
      'RESEND_API_KEY environment variable is MISSING. Email sending will fail. Please set RESEND_API_KEY in your environment variables.'
    )
    console.error('\n❌ [EMAIL] CRITICAL: RESEND_API_KEY is not configured!')
    console.error('   This will cause email sending to fail.')
    console.error('   Set RESEND_API_KEY in your .env.local file or environment variables.\n')
    throw error
  }

  if (apiKey.trim().length === 0) {
    const error = new Error(
      'RESEND_API_KEY environment variable is EMPTY. Please set a valid Resend API key.'
    )
    console.error('\n❌ [EMAIL] CRITICAL: RESEND_API_KEY is empty!\n')
    throw error
  }

  return new Resend(apiKey)
}

/**
 * Email send result
 */
export interface EmailSendResult {
  emailId: string
  provider: 'resend'
}

/**
 * Send resume access email using Resend
 * 
 * STRICT CONTRACT: This function either succeeds with emailId or throws.
 * No silent failures. No partial success.
 * 
 * @param config - Email configuration with recipient, download URL, and expiry
 * @returns { emailId, provider: "resend" } on success
 * @throws Error if:
 *   - RESEND_API_KEY is missing
 *   - RESEND_FROM is missing
 *   - Resend API returns error
 *   - Resend API returns no data
 *   - data.id is missing
 */
export async function sendResumeEmail(config: EmailConfig): Promise<EmailSendResult> {
  const { to, downloadUrl, expiresAt, attachPdf = false } = config

  const isDevelopment = process.env.NODE_ENV === 'development'

  console.log('[EMAIL_ATTEMPT] Starting email send process')
  console.log(`[EMAIL_ATTEMPT] Timestamp: ${new Date().toISOString()}`)
  console.log(`[EMAIL_ATTEMPT] Environment: ${isDevelopment ? 'development' : 'production'}`)

  // Validate API key - ALWAYS throw if missing (no silent failures)
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey.trim().length === 0) {
    const error = new Error(
      'RESEND_API_KEY environment variable is MISSING or EMPTY. Email sending cannot proceed.'
    )
    console.error('[EMAIL_FAILURE] RESEND_API_KEY validation failed')
    console.error(`[EMAIL_FAILURE] Error: ${error.message}`)
    throw error
  }

  // Validate RESEND_FROM - ALWAYS throw if missing (no silent failures)
  const from = process.env.RESEND_FROM
  if (!from || from.trim().length === 0) {
    const error = new Error(
      'RESEND_FROM environment variable is MISSING or EMPTY. Please set RESEND_FROM to a verified domain in your Resend account.'
    )
    console.error('[EMAIL_FAILURE] RESEND_FROM validation failed')
    console.error(`[EMAIL_FAILURE] Error: ${error.message}`)
    throw error
  }

  // Validate sender domain is not a free email provider (only in production)
  if (!isDevelopment) {
    try {
      validateSenderDomain(from)
    } catch (domainError) {
      console.error('\n❌ [EMAIL] FATAL: Sender domain validation failed!')
      console.error(`   Error: ${domainError instanceof Error ? domainError.message : String(domainError)}\n`)
      throw domainError
    }
  }

  console.log(`[EMAIL_ATTEMPT] From: ${from}`)
  console.log(`[EMAIL_ATTEMPT] To: ${to}`)

  const resend = createResendClient()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Mauhhik'

  // Note: expiryTime is no longer used in email templates since we're using a static link
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mauhhik.com'
  const portfolioUrl = `${siteUrl}/portfolio`
  const aboutUrl = `${siteUrl}/about`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e5e7eb;">
          <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">
            Resume: Mauhik Thakkar
          </h1>
          
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px 0; font-weight: 400;">
            Product Manager focused on clarity, judgment, and execution in complex, high-trust environments.
          </p>
          
          <div style="margin: 32px 0;">
            <a 
              href="${downloadUrl}" 
              style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 16px;"
            >
              View Resume (PDF)
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
            <p style="color: #4b5563; font-size: 15px; margin: 0 0 16px 0; font-weight: 500;">
              Next steps:
            </p>
            <ul style="color: #4b5563; font-size: 15px; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li style="margin-bottom: 8px;">
                <a href="${portfolioUrl}" style="color: #000000; text-decoration: underline;">View case studies</a> — Product judgment and decision-making across fintech, AI, and enterprise platforms
              </li>
              <li style="margin-bottom: 8px;">
                <a href="${aboutUrl}" style="color: #000000; text-decoration: underline;">Read about my approach</a> — How I think about product decisions, trade-offs, and ambiguity
              </li>
              <li>
                <a href="${siteUrl}" style="color: #000000; text-decoration: underline;">Visit homepage</a> — Overview of work and availability
              </li>
            </ul>
          </div>
          
          <p style="color: #9ca3af; font-size: 13px; margin: 32px 0 0 0; border-top: 1px solid #e5e7eb; padding-top: 24px;">
            If you did not request this resume, please ignore this email.
          </p>
        </div>
      </body>
    </html>
  `

  const textContent = `
Resume: Mauhik Thakkar

Product Manager focused on clarity, judgment, and execution in complex, high-trust environments.

View resume:
${downloadUrl}

Next steps:

• View case studies — ${portfolioUrl}
  Product judgment and decision-making across fintech, AI, and enterprise platforms

• Read about my approach — ${aboutUrl}
  How I think about product decisions, trade-offs, and ambiguity

• Visit homepage — ${siteUrl}
  Overview of work and availability

If you did not request this resume, please ignore this email.
  `.trim()

  console.log(`[EMAIL_ATTEMPT] Subject: Resume: Mauhik Thakkar`)
  console.log(`[EMAIL_ATTEMPT] Format: HTML + Text`)
  console.log(`[EMAIL_ATTEMPT] Attach PDF: ${attachPdf}`)

  // Optionally fetch and attach PDF from URL
  let pdfAttachment: { filename: string; content: Buffer } | undefined
  if (attachPdf) {
    try {
      console.log(`[EMAIL_ATTEMPT] Fetching PDF from URL: ${downloadUrl}`)
      const pdfResponse = await fetch(downloadUrl)
      
      if (!pdfResponse.ok) {
        console.error(`[EMAIL_WARNING] Failed to fetch PDF: ${pdfResponse.status} ${pdfResponse.statusText}`)
        console.error(`[EMAIL_WARNING] PDF attachment will be skipped, but email will still be sent with link`)
      } else {
        const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer())
        pdfAttachment = {
          filename: 'Mauhik_Thakkar_Product_Manager_Resume.pdf',
          content: pdfBuffer,
        }
        console.log(`[EMAIL_ATTEMPT] PDF fetched successfully (${pdfBuffer.length} bytes)`)
      }
    } catch (fetchError) {
      console.error(`[EMAIL_WARNING] Error fetching PDF for attachment:`, fetchError)
      console.error(`[EMAIL_WARNING] PDF attachment will be skipped, but email will still be sent with link`)
      // Don't throw - email can still be sent with just the link
    }
  }

  try {
    const emailPayload: {
      from: string
      to: string
      subject: string
      html: string
      text: string
      attachments?: Array<{ filename: string; content: Buffer }>
    } = {
      from: `"${siteName}" <${from}>`,
      to,
      subject: 'Resume: Mauhik Thakkar',
      html: htmlContent,
      text: textContent,
    }

    // Add attachment if available
    if (pdfAttachment) {
      emailPayload.attachments = [pdfAttachment]
      console.log(`[EMAIL_ATTEMPT] PDF attachment included`)
    }

    const result = await resend.emails.send(emailPayload)

    // Log full Resend response
    console.log(`[EMAIL_ATTEMPT] Resend API Response: ${JSON.stringify(result, null, 2)}`)

    // Validate response - ALWAYS throw on error
    if (result.error) {
      const error = new Error(
        `Resend API returned an error: ${result.error.message || 'Unknown error'}`
      )
      console.error('[EMAIL_REJECTED] Resend API rejected email')
      console.error(`[EMAIL_REJECTED] Error object: ${JSON.stringify(result.error, null, 2)}`)
      console.error(`[EMAIL_REJECTED] Error message: ${error.message}`)
      throw error
    }

    // Validate data exists - ALWAYS throw if missing
    if (!result.data) {
      const error = new Error(
        'Resend API returned success but data is undefined. This should not happen.'
      )
      console.error('[EMAIL_FAILURE] Resend response missing data')
      console.error(`[EMAIL_FAILURE] Full response: ${JSON.stringify(result, null, 2)}`)
      throw error
    }

    // Validate email ID exists - ALWAYS throw if missing
    if (!result.data.id) {
      const error = new Error(
        'Resend API returned data but email ID is missing. Cannot verify email was accepted.'
      )
      console.error('[EMAIL_FAILURE] Resend response missing email ID')
      console.error(`[EMAIL_FAILURE] Response data: ${JSON.stringify(result.data, null, 2)}`)
      throw error
    }

    // Success - log and return result
    const emailId = result.data.id
    console.log(`[EMAIL_ACCEPTED] Email accepted by Resend`)
    console.log(`[EMAIL_ACCEPTED] Email ID: ${emailId}`)
    console.log(`[EMAIL_ACCEPTED] From: ${from}`)
    console.log(`[EMAIL_ACCEPTED] To: ${to}`)
    console.log(`[EMAIL_ACCEPTED] Subject: Resume: Mauhik Thakkar`)
    console.log(`[EMAIL_ACCEPTED] Provider: resend`)
    
    return {
      emailId,
      provider: 'resend' as const,
    }

  } catch (error) {
    // Log full error details
    console.error(`[EMAIL_FAILURE] Email sending failed`)
    console.error(`[EMAIL_FAILURE] Timestamp: ${new Date().toISOString()}`)
    console.error(`[EMAIL_FAILURE] From: ${from}`)
    console.error(`[EMAIL_FAILURE] To: ${to}`)
    
    if (error instanceof Error) {
      console.error(`[EMAIL_FAILURE] Error name: ${error.name}`)
      console.error(`[EMAIL_FAILURE] Error message: ${error.message}`)
      console.error(`[EMAIL_FAILURE] Error stack: ${error.stack}`)
    } else {
      console.error(`[EMAIL_FAILURE] Error (unknown type): ${String(error)}`)
    }
    
    // ALWAYS re-throw - no silent failures
    throw error
  }
}
