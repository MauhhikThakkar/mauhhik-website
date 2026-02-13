'use client'

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { usePathname } from 'next/navigation'
import CTAButton from "@/components/CTAButton"
import { trackHomepageHeroCtaClick } from "@/lib/analytics"
import { useUtmTracker } from "@/hooks/useUtmTracker"

// Headline line animation variants
// Properly typed to satisfy Framer Motion Variants type
const headlineLineVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : 20,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const, // cubic-bezier array - valid Easing type
    },
  },
}

// Headline container with stagger
// Properly typed to satisfy Framer Motion Variants type
const headlineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
}

// Subheadline animation (after headline completes)
// Properly typed to satisfy Framer Motion Variants type
const subheadlineVariants: Variants = {
  hidden: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : 20,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1] as const, // cubic-bezier array - valid Easing type
      delay: 0.35, // After headline lines complete (0.1 stagger + 0.25 duration)
    },
  },
}

// CTA buttons animation (scale-in, last)
// Properly typed to satisfy Framer Motion Variants type
const ctaContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.4, // After subheadline starts
    },
  },
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion()
  const pathname = usePathname()
  const { utmParams } = useUtmTracker()

  const handleCtaClick = (): void => {
    trackHomepageHeroCtaClick({
      cta_text: 'View Portfolio',
      cta_destination: '/portfolio',
      page_path: pathname,
      ...(utmParams || {}),
    })
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="max-w-3xl text-center">
        {/* Headline with staggered line reveal */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-[1.1]"
          variants={headlineContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="block"
            variants={headlineLineVariants}
            custom={shouldReduceMotion}
          >
            Product Manager focused on
          </motion.span>
          <motion.span
            className="block"
            variants={headlineLineVariants}
            custom={shouldReduceMotion}
          >
            clarity, judgment, and execution.
          </motion.span>
        </motion.h1>

        {/* Subheadline - animates after headline */}
        <motion.p
          className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
          variants={subheadlineVariants}
          initial="hidden"
          animate="visible"
          custom={shouldReduceMotion}
        >
          Designing products for complex, high-trust environments. 
          AI, fintech, and enterprise platforms.
        </motion.p>

        {/* Primary CTA - Portfolio */}
        <motion.div
          variants={ctaContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <CTAButton href="/portfolio" variant="primary" onClick={handleCtaClick}>
            View Portfolio
          </CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
  