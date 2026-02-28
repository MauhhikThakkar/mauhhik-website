'use client'

import Link from 'next/link'

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
    <div className="group bg-charcoal-light/40 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700/50 transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="p-8 sm:p-10 md:p-12">
        {/* Header with Badge */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                Flagship
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Positioning Statement */}
        <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed mb-8 max-w-2xl">
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
