'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const rafId = useRef<number | null>(null)
  const lastProgress = useRef(0)

  // Throttle updates using requestAnimationFrame for performance
  const updateProgress = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }

    rafId.current = requestAnimationFrame(() => {
      // Try to find article element - check both 'article' tag and main content area
      const article = document.querySelector('article') || 
                     document.querySelector('[data-article-content]') ||
                     document.querySelector('main article')
      
      if (!article) {
        setIsVisible(false)
        return
      }

      const articleTop = article.offsetTop
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Hide on mobile if screen height is too small (less than 500px)
      const isSmallScreen = windowHeight < 500
      if (isSmallScreen) {
        setIsVisible(false)
        return
      }

      setIsVisible(true)

      // Calculate progress based on article scroll position
      const articleBottom = articleTop + articleHeight
      const viewportBottom = scrollTop + windowHeight
      
      // If article is fully scrolled past, show 100%
      if (scrollTop >= articleBottom - windowHeight) {
        setProgress(100)
        lastProgress.current = 100
        return
      }

      // If article hasn't been reached yet, show 0%
      if (viewportBottom < articleTop) {
        setProgress(0)
        lastProgress.current = 0
        return
      }

      // Calculate progress: how much of the article has been scrolled through
      const articleStart = articleTop
      const articleEnd = articleBottom - windowHeight
      const scrollableDistance = articleEnd - articleStart

      if (scrollableDistance <= 0) {
        setProgress(100)
        lastProgress.current = 100
        return
      }

      const scrolled = scrollTop - articleStart
      const progressPercent = Math.min(100, Math.max(0, (scrolled / scrollableDistance) * 100))
      
      // Only update if change is significant (reduces re-renders)
      if (Math.abs(progressPercent - lastProgress.current) > 0.1) {
        setProgress(progressPercent)
        lastProgress.current = progressPercent
      }
    })
  }, [])

  useEffect(() => {
    // Initial calculation after mount to avoid hydration mismatch
    const timer = setTimeout(() => {
      updateProgress()
    }, 100)

    // Update on scroll and resize with passive listeners
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    // Cleanup
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [updateProgress])

  // Don't render if hidden or if reduced motion is preferred
  if (!isVisible || shouldReduceMotion) {
    return null
  }

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-0.5 bg-zinc-900 z-50 pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-[width] duration-150 ease-out"
        style={{ 
          width: `${progress}%`
        }}
      />
    </div>
  )
}
