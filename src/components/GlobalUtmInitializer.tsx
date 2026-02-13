'use client'

import { Suspense } from 'react'
import { useUtmTracker } from '@/hooks/useUtmTracker'

/**
 * Internal component that uses UTM tracker
 * Must be wrapped in Suspense because useUtmTracker uses useSearchParams()
 */
function GlobalUtmInitializerInner() {
  // Initialize UTM tracking - this captures params from URL and stores them
  useUtmTracker()
  
  // This component renders nothing - it only initializes tracking
  return null
}

/**
 * Global UTM Initializer Component
 * 
 * Purpose:
 * - Captures UTM parameters from URL on first visit to ANY page
 * - Stores them in localStorage for session persistence
 * - Ensures UTM tracking works even if user never visits /resume page
 * 
 * Architecture:
 * - Client component (uses hooks)
 * - Wrapped in Suspense (required for useSearchParams in Next.js 15)
 * - Renders nothing (initialization only)
 * - Placed in root layout to run on every page load
 * 
 * Why this fixes the issue:
 * - Previously, useUtmTracker() was only called in ResumeRequestForm
 * - Users landing on homepage never triggered UTM capture
 * - Now, UTM params are captured immediately on any page visit
 * - ResumeRequestForm can still use the hook to get stored params
 */
export default function GlobalUtmInitializer() {
  return (
    <Suspense fallback={null}>
      <GlobalUtmInitializerInner />
    </Suspense>
  )
}
