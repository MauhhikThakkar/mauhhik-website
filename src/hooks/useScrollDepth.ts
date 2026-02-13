'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackScrollDepth, ScrollDepthPayload } from '@/lib/analytics'
import { getUtmParams } from '@/hooks/useUtmTracker'

/**
 * Scroll depth milestones to track
 */
const SCROLL_DEPTHS: Array<25 | 50 | 75 | 100> = [25, 50, 75, 100]

/**
 * Hook to track scroll depth milestones
 * 
 * Tracks scroll depth at 25%, 50%, 75%, and 100%
 * Only fires once per milestone per page view
 */
export function useScrollDepth(): void {
  const pathname = usePathname()
  const trackedDepths = useRef<Set<25 | 50 | 75 | 100>>(new Set())

  useEffect(() => {
    // Reset tracked depths on pathname change
    trackedDepths.current.clear()

    const handleScroll = (): void => {
      if (typeof window === 'undefined') {
        return
      }

      // Calculate scroll depth percentage
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollDepth = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      )

      // Check each milestone
      for (const milestone of SCROLL_DEPTHS) {
        if (scrollDepth >= milestone && !trackedDepths.current.has(milestone)) {
          // Mark as tracked
          trackedDepths.current.add(milestone)

          // Get UTM params
          const utmParams = getUtmParams()

          // Track the milestone
          const payload: ScrollDepthPayload = {
            scroll_depth: milestone,
            page_path: pathname,
            ...(utmParams || {}),
          }

          trackScrollDepth(payload)
        }
      }
    }

    // Throttle scroll events for performance
    let ticking = false
    const throttledHandleScroll = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [pathname])
}
