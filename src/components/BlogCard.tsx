'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface BlogCardProps {
  post: {
    _id: string
    title: string
    slug: string
    shortDescription: string
    category?: {
      title: string
      slug: string
      color?: string
    }
    readingTime: number
    publishedAt: string
  }
  imageUrl?: string | null
  imageAlt?: string
  variant?: 'featured' | 'standard'
}

export default function BlogCard({ post, imageUrl = null, imageAlt, variant = 'standard' }: BlogCardProps) {
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
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    hover: isTouchDevice
      ? {
          // Empty object for touch devices (no hover effect)
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

  const isFeatured = variant === 'featured'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
    >
      <motion.article
        className="relative bg-zinc-950/30 border border-zinc-900 rounded-2xl overflow-hidden h-full flex flex-col hover:border-zinc-700"
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        whileFocus="hover"
        whileTap={isTouchDevice ? {} : { scale: 0.98 }}
      >
        {/* Image */}
        {imageUrl && (
          <div className="relative w-full aspect-[16/9] bg-zinc-950">
            <Image
              src={imageUrl}
              alt={imageAlt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes={isFeatured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category & Meta */}
          <div className={`flex items-center ${isFeatured ? 'gap-3 mb-4 text-sm' : 'gap-2 mb-3 text-xs'} flex-wrap`}>
            {post.category && (
              <span
                className={`${isFeatured ? 'px-3' : 'px-2.5'} py-1 rounded-full ${isFeatured ? 'text-xs' : ''} font-medium`}
                style={{
                  backgroundColor: post.category.color ? post.category.color + '20' : '#27272a',
                  color: post.category.color || '#a1a1aa',
                  borderWidth: '1px',
                  borderColor: post.category.color ? post.category.color + '40' : '#3f3f46',
                }}
              >
                {post.category.title}
              </span>
            )}
            {post.category && <span className="text-zinc-600">•</span>}
            <time className="text-zinc-500">
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                ...(isFeatured ? { year: 'numeric' } : {}),
              })}
            </time>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">{post.readingTime} min{isFeatured ? ' read' : ''}</span>
          </div>

          {/* Title */}
          <h3 className={`${isFeatured ? 'text-2xl mb-3' : 'text-xl mb-2 line-clamp-2'} font-bold text-white leading-[1.3] group-hover:text-zinc-200 transition-colors`}>
            {post.title}
          </h3>

          {/* Description */}
          <p className={`${isFeatured ? 'text-base line-clamp-2' : 'text-sm line-clamp-3'} text-zinc-400 leading-relaxed flex-1 break-words`}>
            {post.shortDescription}
          </p>
        </div>
      </motion.article>
    </Link>
  )
}
