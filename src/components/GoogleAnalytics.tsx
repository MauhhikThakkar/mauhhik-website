'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { trackPageView } from '@/lib/analytics'

interface GoogleAnalyticsProps {
  gaId: string
}

/**
 * Google Analytics 4 component
 * - Loads gtag.js script only in production
 * - Tracks pageviews on route changes
 * - SSR-safe implementation (never renders during SSR)
 */
export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Track pageviews on route change
  useEffect(() => {
    // Only track after mount and in production
    if (!mounted) return
    if (process.env.NODE_ENV !== 'production') return
    if (!gaId || typeof window === 'undefined') return

    // Include search params if they exist
    const url = pathname + (window.location.search || '')
    trackPageView(url)
  }, [pathname, gaId, mounted])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Only load scripts in production
  if (process.env.NODE_ENV !== 'production' || !gaId) {
    return null
  }

  return (
    <>
      {/* Google Analytics - gtag.js */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
