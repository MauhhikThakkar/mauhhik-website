'use client'

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"

// Animation variants for premium, calm feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: (reduced: boolean) => ({ 
    opacity: 0, 
    y: reduced ? 0 : 16,
  }),
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth, premium feel
    },
  },
}

// Button hover animation variants
const buttonVariants = {
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
      <motion.div 
        className="max-w-3xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div 
          className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-gray-300 border border-white/5"
          variants={itemVariants}
          custom={shouldReduceMotion}
        >
          Product Manager • AI & SaaS • India → UAE / Global
        </motion.div>

        {/* Headline */}
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-[1.1]"
          variants={itemVariants}
          custom={shouldReduceMotion}
        >
          I build <span className="text-gray-400">AI-first products</span><br />
          and ship them to production
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
          variants={itemVariants}
          custom={shouldReduceMotion}
        >
          Product Manager with hands-on experience in AI tools, Excel automation,
          SaaS MVPs, and real-world delivery.  
          Actively targeting PM roles and consulting opportunities.
        </motion.p>

        {/* CTAs */}
        {/* Portfolio uses hash link (section on this page) */}
        {/* CRITICAL: Blog changed from hash (#blog) to route (/blog) */}
        {/* Hash links prevent Next.js data fetching, causing stale blog content in Chrome */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
          custom={shouldReduceMotion}
        >
          <motion.div
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              href="#portfolio"
              className="inline-block px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
            >
              View Portfolio
            </Link>
          </motion.div>
          <motion.div
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              href="/blog"
              className="inline-block px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
            >
              Read Blog
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
  