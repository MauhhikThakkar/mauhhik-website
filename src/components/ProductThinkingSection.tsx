'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

/**
 * Product Thinking Pillar
 */
interface Pillar {
  title: string
  description: string
}

/**
 * ProductThinkingSection Component
 * 
 * Displays five pillars of product thinking in a modern card-based layout.
 * Positions the owner as a strategic operator, not just a feature builder.
 * 
 * Features:
 * - Modern card-based layout
 * - Clean typography hierarchy
 * - Subtle hover interactions
 * - Fully responsive (5 columns → 3 → 2 → 1)
 * - Fade-in animation on scroll
 * - Respects reduced motion preferences
 */
export default function ProductThinkingSection() {
  const shouldReduceMotion = useReducedMotion()

  const pillars: Pillar[] = [
    {
      title: 'Clear Problem Framing',
      description: 'Define the problem before proposing solutions. Separate symptoms from root causes, and ensure alignment on what success looks like.',
    },
    {
      title: 'Hypothesis-Driven Development',
      description: 'Test assumptions with minimal viable experiments. Learn fast, iterate based on evidence, not opinions.',
    },
    {
      title: 'Scope Discipline',
      description: 'Ship value incrementally. Resist feature bloat. Focus on outcomes, not output.',
    },
    {
      title: 'Metrics & Feedback Loops',
      description: 'Establish clear success metrics upfront. Build tight feedback loops with users and stakeholders.',
    },
    {
      title: 'AI-First Execution',
      description: 'Leverage AI tools (Cursor, Claude, ChatGPT) to accelerate development while maintaining quality and strategic focus.',
    },
  ]

  // Animation variants
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
      y: shouldReduceMotion ? 0 : 20,
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
    <section className="border-t border-zinc-900 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            How I Think About Product
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Strategic frameworks that guide decision-making in complex, high-trust environments.
          </p>
        </motion.div>

        {/* Pillars Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              className="group bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 md:p-8 hover:border-zinc-800 transition-all duration-300 flex flex-col"
              variants={itemVariants}
            >
              {/* Pillar Number */}
              <div className="text-xs font-semibold text-zinc-500 mb-4 tracking-wider uppercase">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Pillar Title */}
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3 leading-tight group-hover:text-white transition-colors">
                {pillar.title}
              </h3>

              {/* Pillar Description */}
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed flex-1">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
