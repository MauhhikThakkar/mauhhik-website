/**
 * Microsoft Clarity utility functions
 * Provides helper functions for custom event tracking and user identification
 */

declare global {
  interface Window {
    clarity?: (
      action: string,
      ...args: unknown[]
    ) => void
  }
}

/**
 * Track custom events in Microsoft Clarity
 * 
 * @param eventName - Name of the custom event
 * @param data - Optional event metadata (key-value pairs)
 * 
 * @example
 * ```ts
 * trackClarityEvent('button_click', { button_name: 'cta', page: '/home' })
 * ```
 */
export const trackClarityEvent = (
  eventName: string,
  data?: Record<string, string | number | boolean>
) => {
  if (typeof window === 'undefined' || !window.clarity) {
    return
  }

  try {
    // Clarity event tracking format
    window.clarity('event', eventName, data)
  } catch (error) {
    // Silently fail in case of errors (e.g., ad blockers)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Clarity event tracking failed:', error)
    }
  }
}

/**
 * Identify users in Clarity (for authenticated users)
 * 
 * @param userId - Unique user identifier
 * @param properties - Optional user properties (email, name, etc.)
 * 
 * @example
 * ```ts
 * identifyClarityUser('user123', { email: 'user@example.com', name: 'John Doe' })
 * ```
 */
export const identifyClarityUser = (
  userId: string,
  properties?: Record<string, string | number | boolean>
) => {
  if (typeof window === 'undefined' || !window.clarity) {
    return
  }

  try {
    // Identify user
    window.clarity('identify', userId)
    
    // Set user properties if provided
    if (properties && Object.keys(properties).length > 0) {
      window.clarity('set', properties)
    }
  } catch (error) {
    // Silently fail in case of errors
    if (process.env.NODE_ENV === 'development') {
      console.warn('Clarity user identification failed:', error)
    }
  }
}

/**
 * Check if Clarity is loaded and ready
 * 
 * @returns true if Clarity is available, false otherwise
 */
export const isClarityReady = (): boolean => {
  return typeof window !== 'undefined' && typeof window.clarity === 'function'
}
