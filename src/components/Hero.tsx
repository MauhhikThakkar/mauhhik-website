'use client'

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

// Headline line animation variants
const headlineLineVariants = {
  hidden: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : 20,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Headline container with stagger
const headlineContainerVariants = {
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
const subheadlineVariants = {
  hidden: (reduced: boolean) => ({
    opacity: 0,
    y: reduced ? 0 : 20,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.35, // After headline lines complete (0.1 stagger + 0.25 duration)
    },
  },
}

// CTA buttons animation (scale-in, last)
const ctaContainerVariants = {
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

const ctaButtonVariants = {
  hidden: (reduced: boolean) => ({
    opacity: 0,
    scale: reduced ? 1 : 0.95,
  }),
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

// Button hover animation variants
const buttonHoverVariants = {
  rest: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -1,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  tap: {
    scale: 0.98,
  },
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="max-w-3xl text-center">
        {/* Badge - no animation per requirements */}
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-gray-300 border border-white/5">
          Product Manager • AI & SaaS • India → UAE / Global
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
            I build <span className="text-gray-400">AI-first products</span>
          </motion.span>
          <motion.span
            className="block"
            variants={headlineLineVariants}
            custom={shouldReduceMotion}
          >
            and ship them to production
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
          Product Manager with hands-on experience in AI tools, Excel automation,
          SaaS MVPs, and real-world delivery.  
          Actively targeting PM roles and consulting opportunities.
        </motion.p>

        {/* CTAs - scale-in animation, last */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={ctaContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={ctaButtonVariants}
            custom={shouldReduceMotion}
            whileHover={buttonHoverVariants.hover}
            whileTap={buttonHoverVariants.tap}
          >
            <Link
              href="#portfolio"
              className="inline-block px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
            >
              View Portfolio
            </Link>
          </motion.div>
          <motion.div
            variants={ctaButtonVariants}
            custom={shouldReduceMotion}
            whileHover={buttonHoverVariants.hover}
            whileTap={buttonHoverVariants.tap}
          >
            <Link
              href="/blog"
              className="inline-block px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
            >
              Read Blog
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
  