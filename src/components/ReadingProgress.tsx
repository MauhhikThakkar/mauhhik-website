'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article')
      if (!article) return

      const articleTop = article.offsetTop
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      const articleBottom = articleTop + articleHeight - windowHeight
      const scrollableDistance = articleBottom - articleTop

      if (scrollableDistance <= 0) {
        setProgress(100)
        return
      }

      const scrolled = scrollTop - articleTop
      const progressPercent = Math.min(100, Math.max(0, (scrolled / scrollableDistance) * 100))
      setProgress(progressPercent)
    }

    // Initial calculation
    updateProgress()

    // Update on scroll and resize
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </div>
  )
}
