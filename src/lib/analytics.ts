/**
 * Google Analytics 4 utility functions
 * Handles gtag.js tracking calls with strict TypeScript typing
 */

// GA4 Event Parameter types
interface GA4EventParams {
  event_category?: string
  event_label?: string
  value?: number
  [key: string]: string | number | boolean | undefined
}

// GA4 Config Parameter types
interface GA4ConfigParams {
  page_path?: string
  page_title?: string
  page_location?: string
  [key: string]: string | number | boolean | undefined
}

// DataLayer item type - can be various gtag command structures
type DataLayerItem =
  | ['config', string, GA4ConfigParams?]
  | ['event', string, GA4EventParams?]
  | ['js', Date]
  | ['set', GA4ConfigParams]

// gtag function overloads for type safety
interface GtagFunction {
  // gtag('config', measurementId, config?)
  (command: 'config', targetId: string, config?: GA4ConfigParams): void
  // gtag('event', eventName, eventParams?)
  (command: 'event', eventName: string, eventParams?: GA4EventParams): void
  // gtag('js', date)
  (command: 'js', date: Date): void
  // gtag('set', config)
  (command: 'set', config: GA4ConfigParams): void
  // Fallback for any other calls (for future compatibility)
  (command: string, ...args: unknown[]): void
}

// Extend Window interface with proper typing
declare global {
  interface Window {
    gtag?: GtagFunction
    dataLayer?: DataLayerItem[]
  }
}

/**
 * Initialize Google Analytics dataLayer
 * 
 * @param measurementId - GA4 Measurement ID (format: G-XXXXXXXXXX)
 */
export const initGA = (measurementId: string): void => {
  if (typeof window === 'undefined') {
    return
  }

  // Initialize dataLayer with proper typing
  window.dataLayer = window.dataLayer || []

  // Create gtag function using rest parameters (ESLint compliant)
  window.gtag = function gtag(
    command: string,
    ...args: unknown[]
  ): void {
    if (window.dataLayer) {
      // Push the command and arguments as a tuple to dataLayer
      window.dataLayer.push([command, ...args] as DataLayerItem)
    }
  }

  // Set initial timestamp
  window.gtag('js', new Date())

  // Configure GA4 with measurement ID
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  })
}

/**
 * Track pageview
 * 
 * @param url - Page URL path to track
 */
export const trackPageView = (url: string): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  window.gtag('config', measurementId, {
    page_path: url,
  })
}

/**
 * Track custom event
 * 
 * @param action - Event action name
 * @param category - Optional event category
 * @param label - Optional event label
 * @param value - Optional numeric value
 */
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number
): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  // Build event parameters object
  const eventParams: GA4EventParams = {}
  
  if (category !== undefined) {
    eventParams.event_category = category
  }
  
  if (label !== undefined) {
    eventParams.event_label = label
  }
  
  if (value !== undefined) {
    eventParams.value = value
  }

  window.gtag('event', action, eventParams)
}
