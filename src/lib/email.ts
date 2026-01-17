import nodemailer from 'nodemailer'

interface EmailConfig {
  to: string
  downloadUrl: string
  expiresAt: Date
}

/**
 * Create email transporter from environment variables
 */
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPassword = process.env.SMTP_PASSWORD
  const smtpFrom = process.env.SMTP_FROM

  // Validate required environment variables
  if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !smtpFrom) {
    throw new Error(
      'Missing email configuration. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM environment variables.'
    )
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort, 10),
    secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  })
}

/**
 * Send resume download email
 */
export async function sendResumeEmail(config: EmailConfig): Promise<void> {
  const { to, downloadUrl, expiresAt } = config

  const transporter = createTransporter()
  const from = process.env.SMTP_FROM || 'noreply@mauhhik.dev'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Mauhhik'

  // Format expiry time
  const expiryTime = expiresAt.toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'UTC',
  })

  const mailOptions = {
    from: `"${siteName}" <${from}>`,
    to,
    subject: 'Your Resume Download Link',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; border: 1px solid #e5e7eb;">
            <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
              Your Resume Download Link
            </h1>
            
            <p style="color: #4b5563; font-size: 16px; margin: 0 0 24px 0;">
              Thank you for your interest. Click the button below to download my resume.
            </p>
            
            <div style="margin: 32px 0;">
              <a 
                href="${downloadUrl}" 
                style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 16px;"
              >
                Download Resume
              </a>
            </div>
            
            <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #4b5563; font-size: 14px; margin: 0 0 8px 0; font-weight: 500;">
                Important:
              </p>
              <ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 4px;">This link expires on ${expiryTime} UTC</li>
                <li style="margin-bottom: 4px;">You can download the resume up to 3 times</li>
                <li>Please do not share this link with others</li>
              </ul>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; margin: 24px 0 0 0; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              If you did not request this resume, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
Your Resume Download Link

Thank you for your interest. Use the link below to download my resume:

${downloadUrl}

Important:
- This link expires on ${expiryTime} UTC
- You can download the resume up to 3 times
- Please do not share this link with others

If you did not request this resume, please ignore this email.
    `.trim(),
  }

  await transporter.sendMail(mailOptions)
}
