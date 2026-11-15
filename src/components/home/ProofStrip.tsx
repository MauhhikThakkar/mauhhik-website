import { PROOF_POINTS } from '@/content/profile'

/**
 * ProofStrip
 *
 * Four measured facts directly under the hero. Server-rendered so the numbers
 * are in the page HTML. Content lives in src/content/profile.ts.
 */
export default function ProofStrip() {
  return (
    <section aria-label="Experience in numbers" className="border-b border-line bg-charcoal-dark/60">
      <div className="site-container">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {PROOF_POINTS.map((point, index) => (
            <div
              key={point.label}
              className={`flex flex-col px-1 py-8 sm:px-6 md:py-10 ${
                index % 2 === 1 ? 'border-l border-line pl-5' : ''
              } ${index >= 2 ? 'border-t border-line lg:border-t-0' : ''} ${
                index === 2 ? 'lg:border-l lg:pl-6' : ''
              } ${index === 0 ? 'sm:pl-0' : ''}`}
            >
              <dt className="order-2 mt-3 text-sm font-medium text-zinc-200">{point.label}</dt>
              <dd className="order-1 font-mono text-4xl font-medium tracking-tight text-white md:text-5xl">
                {point.value}
              </dd>
              <dd className="order-3 mt-1.5 text-xs leading-relaxed text-zinc-500">{point.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
