'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : 24,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '0px 0px -100px 0px', // Start animation slightly before element enters viewport
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const, // cubic-bezier array - valid Easing type
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
