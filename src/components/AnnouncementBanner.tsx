'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

/**
 * Storage key for dismissed banner state
 */
const BANNER_DISMISSED_KEY = 'announcement_banner_dismissed'

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
function setLocalStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // localStorage may be disabled or unavailable
  }
}

/**
 * AnnouncementBanner Component
 * 
 * Professional, dismissible announcement banner at the top of the website.
 * 
 * Features:
 * - Sticky top position
 * - Dismissible with localStorage persistence
 * - Smooth slide-down animation
 * - No layout shift (fixed positioning)
 * - Mobile optimized
 * - Respects reduced motion preferences
 */
export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Check if banner was dismissed on mount
  useEffect(() => {
    setIsMounted(true)
    const dismissed = getLocalStorageItem(BANNER_DISMISSED_KEY)
    if (!dismissed) {
      // Small delay to ensure smooth initial render
      setTimeout(() => {
        setIsVisible(true)
      }, 100)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setLocalStorageItem(BANNER_DISMISSED_KEY, 'true')
  }

  // Update CSS variable for navbar positioning
  useEffect(() => {
    if (isVisible) {
      document.documentElement.style.setProperty('--banner-height', '48px')
    } else {
      document.documentElement.style.setProperty('--banner-height', '0px')
    }
  }, [isVisible])

  // Don't render until mounted (prevents hydration mismatch)
  if (!isMounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[60] bg-zinc-900 border-b border-zinc-800"
          initial={{ y: shouldReduceMotion ? 0 : -100, opacity: shouldReduceMotion ? 0 : 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: shouldReduceMotion ? 0 : -100, opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.4,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
          onAnimationComplete={(definition) => {
            // Update CSS variable after animation completes
            if (definition === 'exit') {
              document.documentElement.style.setProperty('--banner-height', '0px')
            }
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-center gap-4">
              {/* Announcement Text */}
              <p className="text-sm sm:text-base text-zinc-300 text-center flex-1">
                <span className="hidden sm:inline">
                  Currently exploring Product Manager opportunities in UAE & India. Let&apos;s connect.
                </span>
                <span className="sm:hidden">
                  Exploring PM opportunities in UAE & India. Let&apos;s connect.
                </span>
              </p>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1.5 text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded"
                aria-label="Dismiss announcement"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
