import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import ResumeSuccessContent from '@/components/ResumeSuccessContent'

export const metadata = generateSEOMetadata({
  title: 'Resume Access Link Sent | Mauhhik',
  description: 'A secure download link has been sent to your email. The link is valid for 6 hours and allows up to 3 downloads.',
  url: '/resume/success',
  imageAlt: 'Mauhhik — Resume Access Confirmation',
})

/**
 * Mask email address for privacy
 * Shows first 2 characters and domain, masks the rest
 */
function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) {
    return email
  }
  
  if (localPart.length <= 2) {
    return `${localPart}@${domain}`
  }
  
  const masked = `${localPart.substring(0, 2)}${'*'.repeat(Math.min(localPart.length - 2, 6))}@${domain}`
  return masked
}

interface ResumeSuccessPageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function ResumeSuccessPage({
  searchParams,
}: ResumeSuccessPageProps) {
  const params = await searchParams
  const maskedEmail = params.email ? maskEmail(params.email) : null

  return (
    <ResumeSuccessContent maskedEmail={maskedEmail} />
  )
}
