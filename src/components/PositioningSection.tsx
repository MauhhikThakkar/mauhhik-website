/**
 * Positioning Card Data
 */
interface PositioningCard {
  title: string
  content: string[]
  outcome: string
}

/**
 * PositioningSection Component
 * 
 * High-credibility positioning section that clarifies the types of teams
 * and roles where Mauhhik adds the most leverage.
 * 
 * Features:
 * - Enterprise-grade design
 * - Clear value proposition per card
 * - Responsive grid layout
 * - Subtle hover interactions
 * - Server component (no client hooks)
 */
export default function PositioningSection() {
  const cards: PositioningCard[] = [
    {
      title: 'AI & Agentic Product Teams',
      content: [
        'Zero-to-one AI products',
        'Prompt-layer and workflow orchestration',
        'AI-first execution culture',
      ],
      outcome: 'Turn ambiguity into structured AI execution.',
    },
    {
      title: 'FinTech & Capital Markets',
      content: [
        'Regulatory-aware product design',
        'Cross-border systems',
        'Trust-heavy user flows',
      ],
      outcome: 'Ship compliant, scalable financial platforms.',
    },
    {
      title: 'Enterprise SaaS / B2B',
      content: [
        'Workflow-heavy tools',
        'Multi-stakeholder environments',
        'Feedback-loop-driven iteration',
      ],
      outcome: 'Drive clarity in complex product ecosystems.',
    },
  ]

  return (
    <section className="border-t border-zinc-900 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Where I Add the Most Leverage
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            I operate best in high-trust, high-ambiguity environments where structured thinking and disciplined execution matter.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 md:p-8 hover:border-zinc-800 transition-all duration-300 flex flex-col"
            >
              {/* Card Title */}
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 leading-tight group-hover:text-white transition-colors">
                {card.title}
              </h3>

              {/* Card Content */}
              <ul className="space-y-3 mb-6 flex-1">
                {card.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <span className="text-zinc-500 mt-1.5 flex-shrink-0" aria-hidden="true">
                      •
                    </span>
                    <span className="text-sm md:text-base text-zinc-400 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Outcome Line */}
              <div className="pt-4 border-t border-zinc-900">
                <p className="text-sm md:text-base text-zinc-300 font-medium leading-relaxed">
                  {card.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
