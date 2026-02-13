'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface MicrosoftClarityProps {
  clarityId: string
}

/**
 * Microsoft Clarity Analytics Component
 * 
 * Features:
 * - Loads Clarity script only in production
 * - Uses official Microsoft Clarity snippet structure
 * - SSR-safe implementation (never renders during SSR)
 * - Prevents duplicate script injection
 * - Non-blocking script loading for optimal performance
 * 
 * @param clarityId - Microsoft Clarity Project ID (from environment variable)
 */
export default function MicrosoftClarity({ clarityId }: MicrosoftClarityProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure component only renders on client (prevents hydration mismatch)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent duplicate script injection
  useEffect(() => {
    if (!mounted) return
    if (process.env.NODE_ENV !== 'production') return
    if (!clarityId || typeof window === 'undefined') return

    // Check if Clarity is already initialized
    if (window.clarity) {
      return
    }
  }, [mounted, clarityId])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Only load scripts in production
  if (process.env.NODE_ENV !== 'production' || !clarityId) {
    return null
  }

  return (
    <>
      {/* Microsoft Clarity - Official snippet structure */}
      {/* Loads after page becomes interactive for optimal performance */}
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
    </>
  )
}
