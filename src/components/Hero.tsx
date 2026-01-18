'use client'

import { motion, useReducedMotion, type Variants } from "framer-motion"
import CTAButton from "@/components/CTAButton"

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

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="max-w-3xl text-center">
        {/* Badge - no animation per requirements */}
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-gray-300 border border-white/5">
          Product Manager • ICPM Certified • AI & Data
        </div>

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
            Product Manager.
          </motion.span>
          <motion.span
            className="block"
            variants={headlineLineVariants}
            custom={shouldReduceMotion}
          >
            Outcomes through <span className="text-gray-400">ambiguity</span>.
          </motion.span>
        </motion.h1>

        {/* Subheadline - animates after headline */}
        <motion.p
          className="text-gray-400 text-lg md:text-xl mb-4 leading-relaxed max-w-2xl mx-auto"
          variants={subheadlineVariants}
          initial="hidden"
          animate="visible"
          custom={shouldReduceMotion}
        >
          ICPM-certified PM shipping product strategy into delivered software.
          AI and data-driven decision making.
        </motion.p>

        {/* Credibility line - small text */}
        <motion.p
          className="text-gray-500 text-sm mb-10 max-w-2xl mx-auto"
          variants={subheadlineVariants}
          initial="hidden"
          animate="visible"
          custom={shouldReduceMotion}
        >
          Available for PM roles and consulting.
        </motion.p>

        {/* CTAs - scale-in animation, last */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={ctaContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <CTAButton href="/portfolio" variant="primary">
            View Portfolio
          </CTAButton>
          <CTAButton href="/blog" variant="secondary">
            Read Blog
          </CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
  