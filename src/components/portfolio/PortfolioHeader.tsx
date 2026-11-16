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
      <p className="eyebrow mb-5">Work</p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 leading-[1.1] tracking-tight">
        Case studies
      </h1>
      <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
        Delivery work from my roles, then concept projects across fintech, enterprise AI
        and founder tools. Each one shows the options considered and the trade-off behind the decision.
      </p>
    </motion.header>
  )
}
