/**
 * Authority & Validation Section Component
 * 
 * Displays testimonial cards to establish credibility and validation.
 * Minimal design, dark theme compatible, no animations.
 */

interface Testimonial {
  quote: string
  role: string
  industry: string
  context: string
}

/**
 * Authority & Validation Section
 * 
 * Features:
 * - 2 testimonial cards
 * - Minimal design
 * - Dark theme compatible
 * - No animations
 * - Responsive grid (2 columns → 1 column on mobile)
 */
export default function AuthorityValidationSection() {
  const testimonials: Testimonial[] = [
    {
      quote: 'Mauhhik demonstrated exceptional product judgment in navigating complex trade-offs between user needs, technical constraints, and regulatory requirements. His structured approach to problem framing and assumption validation was instrumental in delivering a solution that balanced all three dimensions effectively.',
      role: 'Engineering Lead',
      industry: 'FinTech',
      context: 'FinTech Enterprise Platform',
    },
    {
      quote: 'Working with Mauhhik on product strategy, I appreciated his ability to structure ambiguity and make explicit trade-offs. He doesn\'t wait for perfect clarity—he creates frameworks for decision-making that allow the team to move forward with confidence while maintaining rigor.',
      role: 'Product Director',
      industry: 'SaaS',
      context: 'Enterprise SaaS Platform',
    },
  ]

  return (
    <section className="border-t border-zinc-900 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Authority & Validation
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Feedback from collaborators on product judgment, decision-making, and execution.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 md:p-8"
            >
              {/* Quote */}
              <blockquote className="mb-6">
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>

              {/* Attribution */}
              <div className="pt-6 border-t border-zinc-900/50">
                <div className="text-sm font-medium text-white mb-1">
                  {testimonial.role}
                </div>
                <div className="text-xs text-zinc-500">
                  {testimonial.industry} • {testimonial.context}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
