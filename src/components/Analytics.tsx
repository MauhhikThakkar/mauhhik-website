'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { trackPageView } from '@/lib/analytics'

/**
 * Analytics Component
 * 
 * Unified component for Google Analytics 4 and Microsoft Clarity integration.
 * 
 * Features:
 * - Loads scripts only in production (NODE_ENV === 'production')
 * - Uses next/script for optimal performance (afterInteractive strategy)
 * - SSR-safe implementation (client component with mounting check)
 * - Tracks GA4 pageviews on route changes
 * - Prevents duplicate script injection
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_GA_ID: Google Analytics 4 Measurement ID (format: G-XXXXXXXXXX)
 * - NEXT_PUBLIC_CLARITY_ID: Microsoft Clarity Project ID (alphanumeric string)
 * 
 * Usage:
 * Import directly in layout.tsx (no dynamic import needed):
 * ```tsx
 * import Analytics from '@/components/Analytics'
 * 
 * // In layout:
 * <Analytics />
 * ```
 */
export default function Analytics() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Get IDs from environment variables
  const gaId = process.env.NEXT_PUBLIC_GA_ID || ''
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || ''
  const isProduction = process.env.NODE_ENV === 'production'

  // Ensure component only renders on client (prevents hydration mismatch)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Track GA4 pageviews on route change
  useEffect(() => {
    // Only track after mount and in production
    if (!mounted) return
    if (!isProduction) return
    if (!gaId || typeof window === 'undefined') return

    // Include search params if they exist
    const url = pathname + (window.location.search || '')
    trackPageView(url)
  }, [pathname, gaId, mounted, isProduction])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Only load scripts in production
  if (!isProduction) {
    return null
  }

  return (
    <>
      {/* Google Analytics 4 - gtag.js */}
      {gaId && (
        <>
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
      )}

      {/* Microsoft Clarity - Official snippet structure */}
      {clarityId && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `,
          }}
        />
      )}
    </>
  )
}
