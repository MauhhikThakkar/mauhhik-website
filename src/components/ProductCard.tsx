'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ProductCardProps {
  product: {
    _id: string
    title: string
    slug: string
    shortDescription: string
    price?: number
    ctaText?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch devices
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Hover variants - disabled on touch devices
  // Properly typed to satisfy Framer Motion Variants type
  const cardVariants: Variants = {
    rest: {
      y: 0,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    hover: isTouchDevice
      ? {
          // No hover effect on touch devices
          y: 0,
        }
      : {
          y: -4,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          transition: {
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1] as const, // cubic-bezier array - valid Easing type
          },
        },
  }

  return (
    <motion.article
      className="relative bg-charcoal-light/30 border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col hover:border-zinc-700 group"
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      whileTap={isTouchDevice ? {} : { scale: 0.98 }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-2xl"
      >
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 leading-[1.3] group-hover:text-zinc-200 transition-colors line-clamp-2">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 flex-1 break-words mb-4">
            {product.shortDescription}
          </p>

          {/* Price / CTA */}
          <div className="mt-auto pt-4 border-t border-zinc-900">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                {product.price ? `$${product.price.toFixed(2)}` : 'Free'}
              </span>
              <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                {product.ctaText || 'Learn more'} →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
