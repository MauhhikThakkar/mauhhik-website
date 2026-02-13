'use client'

import { useScrollDepth } from '@/hooks/useScrollDepth'

/**
 * Scroll Depth Tracker Component
 * 
 * Global component that tracks scroll depth milestones (25%, 50%, 75%, 100%)
 * across all pages. Renders nothing - only handles tracking.
 */
export default function ScrollDepthTracker() {
  useScrollDepth()
  return null
}
