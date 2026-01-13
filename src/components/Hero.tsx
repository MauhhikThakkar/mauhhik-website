'use client'

import Link from "next/link"
import { motion } from "framer-motion"

// Animation variants for premium, calm feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth, premium feel
    },
  },
}

export default function Hero() {
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
            className="inline-block mb-6 px-4 py-1 rounded-full bg-white/10 text-sm text-gray-300"
            variants={itemVariants}
          >
            Product Manager • AI & SaaS • India → UAE / Global
          </motion.div>
  
          {/* Headline */}
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            I build <span className="text-gray-400">AI-first products</span><br />
            and ship them to production
          </motion.h1>
  
          {/* Subtext */}
          <motion.p 
            className="text-gray-400 text-lg mb-10"
            variants={itemVariants}
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
          >
            <Link
              href="#portfolio"
              className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition"
            >
              View Portfolio
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
            >
              Read Blog
            </Link>
          </motion.div>
        </motion.div>
      </section>
    );
  }
  