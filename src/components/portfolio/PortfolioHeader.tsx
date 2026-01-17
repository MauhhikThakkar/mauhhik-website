'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function PortfolioHeader() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.header
      initial={{
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="max-w-3xl"
    >
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
        Product Case Studies
      </h1>
      <p className="text-xl text-zinc-400 leading-relaxed">
        Selected case studies showcasing product thinking, execution, and
        real-world delivery. From AI-first products to SaaS MVPs, each project
        demonstrates hands-on problem-solving and measurable impact.
      </p>
    </motion.header>
  )
}
