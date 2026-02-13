'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

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
 * 
 * Animation:
 * - Subtle fade-in on load
 * - Respects reduced motion preferences
 */
export default function MetricsStrip() {
  const shouldReduceMotion = useReducedMotion()

  const metrics = [
    {
      value: '9+',
      label: 'Years in FinTech & Capital Markets',
    },
    {
      value: 'Global Exchanges',
      label: 'Products Serving (NASDAQ, NSE, JPX, ASX)',
    },
    {
      value: '500+',
      label: 'Users Across AI & Digital Products',
    },
    {
      value: 'AI-First Builder',
      label: 'Cursor, Claude, ChatGPT',
    },
  ]

  // Animation variants - subtle fade-in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  return (
    <section className="border-t border-zinc-900 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center min-h-[120px] md:min-h-[140px] flex flex-col justify-center"
              variants={itemVariants}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight leading-none">
                {metric.value}
              </div>
              <div className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xs mx-auto">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
