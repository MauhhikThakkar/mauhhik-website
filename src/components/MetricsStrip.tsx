'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackMetricsStripInteraction } from '@/lib/analytics'
import { useUtmTracker } from '@/hooks/useUtmTracker'

/**
 * MetricsStrip Component
 * 
 * Premium metrics display appearing below hero section.
 * Displays authority metrics in a clean, minimal layout.
 * 
 * Layout:
 * - Desktop: 4 columns
 * - Tablet: 2x2 grid
 * - Mobile: Stacked
 */
export default function MetricsStrip() {
  const pathname = usePathname()
  const { utmParams } = useUtmTracker()
  const hasTrackedView = useRef(false)

  // Track view on mount (when component enters viewport)
  useEffect(() => {
    if (!hasTrackedView.current) {
      // Small delay to ensure component is rendered
      const timer = setTimeout(() => {
        trackMetricsStripInteraction({
          interaction_type: 'view',
          page_path: pathname,
          ...(utmParams || {}),
        })
        hasTrackedView.current = true
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [pathname, utmParams])

  const handleMetricInteraction = (index: number, type: 'hover' | 'click'): void => {
    trackMetricsStripInteraction({
      interaction_type: type,
      metric_index: index,
      page_path: pathname,
      ...(utmParams || {}),
    })
  }
  const metrics = [
    {
      value: '9+ Years',
      label: 'FinTech, B2B & B2C SaaS · Product & Delivery Leadership',
    },
    {
      value: 'Global Exchanges',
      label: 'Products deployed across NASDAQ, NSE, JPX, ASX',
    },
    {
      value: '500+ Users Impacted',
      label: 'Across AI, FinTech & Digital Platforms',
    },
    {
      value: 'AI-First Builder',
      label: 'Claude · Cursor · ChatGPT · Perplexity · Gamma',
    },
  ]

  return (
    <section className="border-t border-zinc-900 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center min-h-[120px] md:min-h-[140px] flex flex-col justify-center"
              onMouseEnter={() => handleMetricInteraction(index, 'hover')}
              onClick={() => handleMetricInteraction(index, 'click')}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight leading-none">
                {metric.value}
              </div>
              <div className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xs mx-auto">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
