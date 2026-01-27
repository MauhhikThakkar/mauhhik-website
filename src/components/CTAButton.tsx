'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'

interface CTAButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  external?: boolean
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
}: CTAButtonProps) {
  const shouldReduceMotion = useReducedMotion()
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch devices
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Animation variants - subtle micro-interactions
  // Properly typed to satisfy Framer Motion Variants type
  const buttonVariants: Variants = {
    rest: {
      y: 0,
      scale: 1,
      boxShadow: variant === 'primary' 
        ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
        : '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
    },
    hover: isTouchDevice || shouldReduceMotion
      ? {
          // No hover effect on touch devices or reduced motion
          y: 0,
          scale: 1,
        }
      : {
          y: -2,
          boxShadow: variant === 'primary'
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            : '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
          transition: {
            duration: 0.15,
            ease: [0.22, 1, 0.36, 1] as const, // cubic-bezier array - valid Easing type
          },
        },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.12,
        ease: [0.22, 1, 0.36, 1] as const, // cubic-bezier array - valid Easing type
      },
    },
  }

  // Base classes for primary vs secondary
  const baseClasses = variant === 'primary'
    ? 'px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200'
    : 'px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/30'

  const focusClasses = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal'

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block ${baseClasses} ${focusClasses} transition-colors duration-200 ${className}`}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        whileFocus="hover"
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.div
      className="inline-block"
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      <Link
        href={href}
        className={`${baseClasses} ${focusClasses} transition-colors duration-200 ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  )
}
