/**
 * Decision Snapshot Component
 * 
 * Structured section displaying key decision-making context:
 * - Problem Context
 * - Key Constraints
 * - Strategic Trade-offs
 * - Success Metrics
 * - Outcome
 */

import PortableText from '@/components/PortableText'

interface DecisionSnapshotProps {
  problemContext?: unknown // Portable Text array
  keyConstraints?: string[] // From keyAssumptions or derived
  strategicTradeoffs?: Array<{
    decision: string
    tradeoff: string
  }>
  successMetrics?: Array<{
    label: string
    value: string
    context?: string
  }>
  outcome?: string // From intendedImpact or impact summary
  successCriteria?: string[]
}

// Type guard to check if value is a valid Portable Text array
function isValidPortableText(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

export default function DecisionSnapshot({
  problemContext,
  keyConstraints,
  strategicTradeoffs,
  successMetrics,
  outcome,
  successCriteria,
}: DecisionSnapshotProps) {
  // Only render if we have at least one piece of data
  const hasData =
    problemContext ||
    (keyConstraints && keyConstraints.length > 0) ||
    (strategicTradeoffs && strategicTradeoffs.length > 0) ||
    (successMetrics && successMetrics.length > 0) ||
    outcome ||
    (successCriteria && successCriteria.length > 0)

  if (!hasData) {
    return null
  }

  // Extract problem context for type narrowing
  const hasProblemContext = problemContext && isValidPortableText(problemContext)
  const problemContextArray = hasProblemContext ? (problemContext as unknown[]) : null

  return (
    <section className="py-16 md:py-20 border-b border-zinc-900/50">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="mb-12">
          <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
            Decision Snapshot
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight mb-4">
            Key Decision Context
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed max-w-3xl">
            Problem framing, constraints, trade-offs, and success criteria that shaped this product decision.
          </p>
        </div>

        <div className="space-y-6">
          {/* Problem Context */}
          {problemContextArray && (
            <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
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
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
                    Problem Context
                  </h3>
                  <div className="text-zinc-300 leading-relaxed text-sm md:text-base">
                    <PortableText value={problemContextArray.slice(0, 2)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Constraints */}
          {keyConstraints && keyConstraints.length > 0 && (
            <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">
                    Key Constraints
                  </h3>
                  <ul className="space-y-2.5">
                    {keyConstraints.map((constraint, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                        <span className="text-zinc-300 leading-relaxed">{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Strategic Trade-offs */}
          {strategicTradeoffs && strategicTradeoffs.length > 0 && (
            <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">
                    Strategic Trade-offs
                  </h3>
                  <div className="space-y-4">
                    {strategicTradeoffs.map((tradeoff, index) => (
                      <div key={index} className="border-l-2 border-zinc-800/80 pl-4 py-2">
                        <div className="font-medium text-white mb-1.5">{tradeoff.decision}</div>
                        <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                          {tradeoff.tradeoff}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Metrics */}
          {(successMetrics && successMetrics.length > 0) || (successCriteria && successCriteria.length > 0) ? (
            <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-4 tracking-tight">
                    Success Metrics
                  </h3>
                  {successMetrics && successMetrics.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {successMetrics.map((metric, index) => (
                        <div key={index} className="bg-zinc-900/30 rounded-lg p-4 border border-zinc-800/50">
                          <div className="text-2xl font-bold text-white mb-1 tracking-tight">
                            {metric.value}
                          </div>
                          <div className="text-sm text-zinc-300 font-medium mb-1">
                            {metric.label}
                          </div>
                          {metric.context && (
                            <div className="text-xs text-zinc-500 leading-relaxed">
                              {metric.context}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {successCriteria && successCriteria.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">
                        Evaluation Criteria
                      </h4>
                      <ul className="space-y-2">
                        {successCriteria.map((criterion, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                            <span className="text-zinc-300 leading-relaxed text-sm">{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Outcome */}
          {outcome && (
            <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">
                    Outcome
                  </h3>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line">{outcome}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
