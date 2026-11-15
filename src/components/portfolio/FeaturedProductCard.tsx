'use client'

import Link from 'next/link'
import StatusChip from '@/components/site/StatusChip'

interface FeaturedProductCardProps {
  title: string
  positioning: string
  caseStudySlug: string
  prototypeLink?: string
}

export default function FeaturedProductCard({
  title,
  positioning,
  caseStudySlug,
  prototypeLink,
}: FeaturedProductCardProps) {
  return (
    <div className="card group h-full overflow-hidden">
      <div className="p-6 sm:p-8 md:p-10">
        {/* Header with Badge */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="mb-5">
              <StatusChip status="concept" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-4 leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Positioning Statement */}
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8 max-w-2xl">
          {positioning}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href={`/portfolio/${caseStudySlug}`}
            className="flex-1 px-6 py-3.5 sm:py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-charcoal text-center min-h-[52px] flex items-center justify-center text-base"
          >
            Read Case Study
          </Link>
          {prototypeLink && (
            <a
              href={prototypeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3.5 sm:py-4 bg-zinc-900/50 border border-zinc-700/50 text-white font-medium rounded-lg hover:bg-zinc-800/50 hover:border-zinc-600/50 active:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-charcoal text-center min-h-[52px] flex items-center justify-center text-base"
            >
              View Live Prototype
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
