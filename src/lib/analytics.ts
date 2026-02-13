/**
 * Google Analytics 4 utility functions
 * Handles gtag.js tracking calls
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

/**
 * Initialize Google Analytics dataLayer
 */
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }

  // Set initial timestamp
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  })
}

/**
 * Track pageview
 */
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) return

  window.gtag('config', measurementId, {
    page_path: url,
  })
}

/**
 * Track custom event
 */
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
