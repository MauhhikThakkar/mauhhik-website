'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

interface ImpactMetric {
  label: string
  value: string
  context?: string
}

interface Category {
  title: string
  slug: string
}

interface PortfolioProject {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  coverImage?: {
    alt?: string
    asset?: {
      _id: string
      url: string
      metadata?: {
        dimensions?: {
          width: number
          height: number
        }
      }
    }
  }
  impact?: ImpactMetric[]
  categories?: Category[]
}

interface PortfolioCardProps {
  project: PortfolioProject
  index: number
}

export default function PortfolioCard({ project, index }: PortfolioCardProps) {
  const shouldReduceMotion = useReducedMotion()

  // Get primary impact metric (first one, or most relevant)
  const primaryImpact = project.impact?.[0]

  return (
    <motion.div
      initial={{
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
        delay: shouldReduceMotion ? 0 : index * 0.1,
      }}
    >
      <Link
        href={`/portfolio/${project.slug}`}
        className="group block h-full"
      >
        <motion.article
          className="h-full bg-zinc-950/30 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300"
          style={{
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}
          whileHover={shouldReduceMotion ? {} : {
            y: -2,
            boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.4)',
            transition: {
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        >
          {/* Cover Image */}
          {project.coverImage?.asset?.url && (
            <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-zinc-900">
              <Image
                src={project.coverImage.asset.url}
                alt={project.coverImage.alt || project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Role / Primary Category */}
            {project.categories && project.categories.length > 0 && (
              <div className="mb-3">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {project.categories[0].title}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-white transition-colors">
              {project.title}
            </h2>

            {/* Description */}
            {project.shortDescription && (
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-4 line-clamp-2">
                {project.shortDescription}
              </p>
            )}

            {/* Impact Metric */}
            {primaryImpact && (
              <div className="mb-6 pb-6 border-b border-zinc-900">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white">
                    {primaryImpact.value}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {primaryImpact.label}
                  </span>
                </div>
                {primaryImpact.context && (
                  <p className="text-xs text-zinc-600 mt-1">
                    {primaryImpact.context}
                  </p>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center text-sm font-medium text-white group-hover:text-white">
              <span>Read Case Study</span>
              <motion.svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={shouldReduceMotion ? {} : {
                  x: 4,
                  transition: {
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}
