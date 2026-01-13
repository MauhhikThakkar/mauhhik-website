'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void
  }
}

interface AnalyticsProps {
  domain?: string
  enabled?: boolean
}

export default function Analytics({ domain, enabled = true }: AnalyticsProps) {
  const pathname = usePathname()

  // Load Plausible script
  useEffect(() => {
    if (!enabled || !domain) {
      return
    }

    // Check if script already exists
    if (document.querySelector(`script[data-domain="${domain}"]`)) {
      return
    }

    // Load Plausible script
    const script = document.createElement('script')
    script.defer = true
    script.setAttribute('data-domain', domain)
    script.src = 'https://plausible.io/js/script.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup on unmount (though unlikely in app layout)
      const existingScript = document.querySelector(`script[data-domain="${domain}"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [domain, enabled])

  // Track outbound link clicks
  useEffect(() => {
    if (!enabled || !domain) {
      return
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (!link) return

      const href = link.getAttribute('href')
      if (!href) return

      // Check if it's an outbound link
      const isOutbound =
        href.startsWith('http') &&
        !href.includes(window.location.hostname) &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:')

      if (isOutbound && window.plausible) {
        // Track outbound link click
        window.plausible('Outbound Link: Click', {
          props: {
            url: href,
            path: pathname,
          },
        })
      }
    }

    // Use capture phase to catch all clicks
    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [pathname, domain, enabled])

  // Plausible automatically tracks pageviews via SPA mode
  // We just need to ensure the script is loaded
  return null
}
