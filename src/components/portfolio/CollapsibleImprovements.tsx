'use client'

import { useState } from 'react'

/**
 * Collapsible Improvements Component
 * 
 * Displays "What I Would Improve Today" section with:
 * - Technical iteration
 * - GTM refinement
 * - Metrics evolution
 */

interface ImprovementSection {
  technicalIteration?: string
  gtmRefinement?: string
  metricsEvolution?: string
}

interface CollapsibleImprovementsProps {
  improvements?: ImprovementSection
}

export default function CollapsibleImprovements({
  improvements,
}: CollapsibleImprovementsProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Only render if we have at least one improvement
  const hasData =
    improvements?.technicalIteration ||
    improvements?.gtmRefinement ||
    improvements?.metricsEvolution

  if (!hasData) {
    return null
  }

  return (
    <section className="py-16 md:py-20 border-b border-zinc-900/50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl overflow-hidden">
          {/* Header - Always Visible */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-charcoal-light/70 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-inset"
            aria-expanded={isOpen}
            aria-controls="improvements-content"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-800/50">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-1 tracking-tight">
                  What I Would Improve Today
                </h2>
                <p className="text-sm text-zinc-400">
                  Technical iteration, GTM refinement, and metrics evolution
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-zinc-400 transition-transform flex-shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Collapsible Content */}
          {isOpen && (
            <div id="improvements-content" className="border-t border-zinc-900/80">
              <div className="p-6 md:p-8 space-y-8">
                {/* Technical Iteration */}
                {improvements.technicalIteration && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-3 tracking-tight flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      Technical Iteration
                    </h3>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {improvements.technicalIteration}
                    </p>
                  </div>
                )}

                {/* GTM Refinement */}
                {improvements.gtmRefinement && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-3 tracking-tight flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      GTM Refinement
                    </h3>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {improvements.gtmRefinement}
                    </p>
                  </div>
                )}

                {/* Metrics Evolution */}
                {improvements.metricsEvolution && (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-3 tracking-tight flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-zinc-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Metrics Evolution
                    </h3>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                      {improvements.metricsEvolution}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
