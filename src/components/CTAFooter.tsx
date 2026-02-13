'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUtmTracker } from '@/hooks/useUtmTracker'
import { trackResumeButtonClick } from '@/lib/analytics'

/**
 * Internal CTAFooter component that uses UTM tracker
 * Must be wrapped in Suspense because useUtmTracker uses useSearchParams()
 */
function CTAFooterInner() {
  const pathname = usePathname()
  const { utmParams } = useUtmTracker()

  const handleResumeClick = () => {
    trackResumeButtonClick({
      button_location: 'footer',
      page_path: pathname,
      ...(utmParams || {}),
    })
  }

  const handleLinkedInClick = () => {
    // Track LinkedIn click if needed
    if (typeof window !== 'undefined' && window.gtag) {
      const measurementId = process.env.NEXT_PUBLIC_GA_ID
      if (measurementId) {
        window.gtag('event', 'linkedin_click', {
          page_path: pathname,
          link_location: 'footer',
          ...(utmParams || {}),
        })
      }
    }
  }

  const handleEmailClick = () => {
    // Track email click if needed
    if (typeof window !== 'undefined' && window.gtag) {
      const measurementId = process.env.NEXT_PUBLIC_GA_ID
      if (measurementId) {
        window.gtag('event', 'email_click', {
          page_path: pathname,
          link_location: 'footer',
          ...(utmParams || {}),
        })
      }
    }
  }

  return (
    <section className="border-t border-zinc-900 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Primary CTA */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Interested in discussing product strategy?
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg mb-8 leading-relaxed">
              Let&apos;s connect and explore how we can work together.
            </p>
            <Link
              href="/resume"
              onClick={handleResumeClick}
              className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-charcoal text-base sm:text-lg"
            >
              Request Resume
            </Link>
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8 border-t border-zinc-900">
            <span className="text-sm text-zinc-500">Or connect via:</span>
            <div className="flex items-center gap-4">
              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/mauhhikthakkar/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkedInClick}
                className="inline-flex items-center gap-2 text-sm sm:text-base text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal rounded px-3 py-2"
                aria-label="Connect on LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>LinkedIn</span>
              </a>

              {/* Email Link */}
              <a
                href="mailto:hello@mauhhik.com"
                onClick={handleEmailClick}
                className="inline-flex items-center gap-2 text-sm sm:text-base text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal rounded px-3 py-2"
                aria-label="Send email"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * CTAFooter Component
 * 
 * Reusable conversion-focused footer with primary and secondary CTAs.
 * Designed to increase resume interaction rate by at least 20%.
 * 
 * Features:
 * - Primary CTA: "Request Resume" button
 * - Secondary CTAs: LinkedIn and Email links
 * - GA4 event tracking for all interactions
 * - Premium design with clear visual hierarchy
 * - Fully responsive
 * - No layout shift
 * 
 * Architecture:
 * - Client component (uses hooks)
 * - Wrapped in Suspense (required for useSearchParams in Next.js 15)
 * - Placed in root layout above Footer
 */
export default function CTAFooter() {
  return (
    <Suspense fallback={
      <section className="border-t border-zinc-900 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Interested in discussing product strategy?
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg mb-8 leading-relaxed">
                Let&apos;s connect and explore how we can work together.
              </p>
              <Link
                href="/resume"
                className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-charcoal text-base sm:text-lg"
              >
                Request Resume
              </Link>
            </div>
          </div>
        </div>
      </section>
    }>
      <CTAFooterInner />
    </Suspense>
  )
}
