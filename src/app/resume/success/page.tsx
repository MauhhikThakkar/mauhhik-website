import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import Link from 'next/link'

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
    <main className="bg-charcoal text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        {/* SECTION 1 — Confirmation State */}
        <section className="text-center mb-12 sm:mb-16">
          {/* Checkmark Icon */}
          <div className="flex justify-center mb-6" aria-hidden="true">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Resume Access Link Sent
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-zinc-400 mb-2 leading-relaxed max-w-2xl mx-auto">
            A secure download link has been sent to your email. The link is valid for 6 hours.
          </p>

          {/* Masked Email Display (if available) */}
          {maskedEmail && (
            <p className="text-sm text-zinc-500 mt-4">
              Sent to: <span className="font-mono">{maskedEmail}</span>
            </p>
          )}

          <p className="text-sm text-zinc-500 mt-2">
            If you don&apos;t see the email, please check your spam folder.
          </p>
        </section>

        {/* SECTION 2 — Trust Reinforcement */}
        <section className="mb-12 sm:mb-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 text-center">
              <p className="text-sm text-zinc-400 leading-relaxed">
                Your email is used only for resume delivery. No newsletters. No marketing.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Next Actions */}
        <section className="mb-12 sm:mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
              Explore More
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* View Case Studies */}
              <Link
                href="/portfolio"
                className="group bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-colors text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-white group-hover:text-white transition-colors">
                    View Case Studies
                  </span>
                </div>
              </Link>

              {/* Connect on LinkedIn */}
              <a
                href="https://www.linkedin.com/in/mauhhikthakkar/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-colors text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-sm font-medium text-white group-hover:text-white transition-colors">
                    Connect on LinkedIn
                  </span>
                </div>
              </a>

              {/* Read About My Approach */}
              <Link
                href="/about"
                className="group bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-colors text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <svg
                    className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-white group-hover:text-white transition-colors">
                    Read About My Approach
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Authority Strip */}
        <section className="border-t border-zinc-900 pt-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                  9+
                </div>
                <div className="text-sm text-zinc-400 leading-relaxed">
                  Years in FinTech & Capital Markets
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                  500+
                </div>
                <div className="text-sm text-zinc-400 leading-relaxed">
                  Users Impacted
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                  AI-First
                </div>
                <div className="text-sm text-zinc-400 leading-relaxed">
                  Builder
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
