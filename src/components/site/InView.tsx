'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * InView
 *
 * Marks its wrapper with data-inview="false" after hydration, then "true"
 * the first time it scrolls into view. CSS in globals.css (.draw-x, .draw-y,
 * .stagger) animates on that change. Server HTML carries no attribute, so the
 * content is fully visible without JavaScript.
 */
export default function InView({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'ol'
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [state, setState] = useState<'idle' | 'false' | 'true'>('idle')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    setState('false')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setState('true')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -15% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      data-inview={state === 'idle' ? undefined : state}
    >
      {children}
    </Tag>
  )
}
