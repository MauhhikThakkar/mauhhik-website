/**
 * MetricsStrip Component
 * 
 * Premium metrics display appearing below hero section.
 * Displays authority metrics in a clean, minimal layout.
 * 
 * Layout:
 * - Desktop: 4 columns
 * - Tablet: 2x2 grid
 * - Mobile: Stacked
 */
export default function MetricsStrip() {
  const metrics = [
    {
      value: '9+ Years',
      label: 'FinTech, B2B & B2C SaaS · Product & Delivery Leadership',
    },
    {
      value: 'Global Exchanges',
      label: 'Products deployed across NASDAQ, NSE, JPX, ASX',
    },
    {
      value: '500+ Users Impacted',
      label: 'Across AI, FinTech & Digital Platforms',
    },
    {
      value: 'AI-First Builder',
      label: 'Claude · Cursor · ChatGPT · Perplexity · Gamma',
    },
  ]

  return (
    <section className="border-t border-zinc-900 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center min-h-[120px] md:min-h-[140px] flex flex-col justify-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight leading-none">
                {metric.value}
              </div>
              <div className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-xs mx-auto">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
