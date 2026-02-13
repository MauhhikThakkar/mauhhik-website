'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * UTM Parameter types
 */
export interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Storage key for localStorage
 */
const UTM_STORAGE_KEY = 'utm_params'

/**
 * Maximum age for UTM params in milliseconds (30 days)
 */
const UTM_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

/**
 * Stored UTM data structure with timestamp
 */
interface StoredUtmData {
  params: UtmParams
  timestamp: number
}

/**
 * Safely get localStorage value (SSR-safe)
 */
function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    // localStorage may be disabled or unavailable
    return null
  }
}

/**
 * Safely set localStorage value (SSR-safe)
 */
function setLocalStorageItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    // localStorage may be disabled or unavailable
    return false
  }
}

/**
 * Parse UTM parameters from URL search params
 */
function parseUtmFromSearchParams(searchParams: URLSearchParams): UtmParams {
  const utmParams: UtmParams = {}

  const utmSource = searchParams.get('utm_source')
  const utmMedium = searchParams.get('utm_medium')
  const utmCampaign = searchParams.get('utm_campaign')
  const utmTerm = searchParams.get('utm_term')
  const utmContent = searchParams.get('utm_content')

  if (utmSource) {
    utmParams.utm_source = utmSource
  }
  if (utmMedium) {
    utmParams.utm_medium = utmMedium
  }
  if (utmCampaign) {
    utmParams.utm_campaign = utmCampaign
  }
  if (utmTerm) {
    utmParams.utm_term = utmTerm
  }
  if (utmContent) {
    utmParams.utm_content = utmContent
  }

  return utmParams
}

/**
 * Load UTM params from localStorage
 */
function loadStoredUtmParams(): UtmParams | null {
  const stored = getLocalStorageItem(UTM_STORAGE_KEY)
  if (!stored) {
    return null
  }

  try {
    const data: StoredUtmData = JSON.parse(stored)
    const now = Date.now()
    const age = now - data.timestamp

    // Check if stored params are still valid (not expired)
    if (age > UTM_MAX_AGE_MS) {
      // Expired - remove from storage
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem(UTM_STORAGE_KEY)
        } catch {
          // Ignore errors
        }
      }
      return null
    }

    return data.params
  } catch {
    // Invalid JSON or corrupted data - remove it
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(UTM_STORAGE_KEY)
      } catch {
        // Ignore errors
      }
    }
    return null
  }
}

/**
 * Save UTM params to localStorage
 */
function saveUtmParams(params: UtmParams): boolean {
  // Only save if there are actual UTM params
  const hasParams = Object.keys(params).length > 0
  if (!hasParams) {
    return false
  }

  const data: StoredUtmData = {
    params,
    timestamp: Date.now(),
  }

  return setLocalStorageItem(UTM_STORAGE_KEY, JSON.stringify(data))
}

/**
 * Get current UTM params (utility function for non-hook usage)
 * 
 * @returns Current UTM params from localStorage or null if none exist
 */
export function getUtmParams(): UtmParams | null {
  return loadStoredUtmParams()
}

/**
 * Clear stored UTM params (utility function)
 */
export function clearUtmParams(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(UTM_STORAGE_KEY)
  } catch {
    // Ignore errors
  }
}

/**
 * UTM Tracker Hook
 * 
 * Automatically captures UTM parameters from URL on first load and persists them
 * across the session using localStorage.
 * 
 * Features:
 * - Captures UTM params from URL on mount
 * - Stores in localStorage with timestamp
 * - Expires after 30 days
 * - SSR-safe (no window access on server)
 * - Strict TypeScript compliance
 * 
 * @returns Object with current UTM params and utility functions
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { utmParams, getUtmParams } = useUtmTracker()
 *   
 *   // utmParams contains current UTM values
 *   // getUtmParams() can be called to retrieve latest values
 * }
 * ```
 */
export function useUtmTracker() {
  const searchParams = useSearchParams()
  const [utmParams, setUtmParams] = useState<UtmParams | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize UTM tracking on mount
  useEffect(() => {
    // Load existing UTM params from storage
    const storedParams = loadStoredUtmParams()
    
    // Check for new UTM params in URL
    const urlParams = parseUtmFromSearchParams(searchParams)
    const hasUrlParams = Object.keys(urlParams).length > 0

    if (hasUrlParams) {
      // New UTM params in URL - save them and use them
      saveUtmParams(urlParams)
      setUtmParams(urlParams)
    } else if (storedParams) {
      // No new params, but we have stored ones - use stored
      setUtmParams(storedParams)
    } else {
      // No params at all
      setUtmParams(null)
    }

    setIsInitialized(true)
  }, [searchParams])

  // Function to get current UTM params (refreshes from storage)
  const getCurrentUtmParams = useCallback((): UtmParams | null => {
    const current = loadStoredUtmParams()
    setUtmParams(current)
    return current
  }, [])

  return {
    /**
     * Current UTM parameters (null if none exist)
     */
    utmParams,
    /**
     * Whether the hook has finished initializing
     */
    isInitialized,
    /**
     * Get current UTM params (refreshes from storage)
     */
    getUtmParams: getCurrentUtmParams,
    /**
     * Clear stored UTM params
     */
    clearUtmParams: useCallback(() => {
      clearUtmParams()
      setUtmParams(null)
    }, []),
  }
}
