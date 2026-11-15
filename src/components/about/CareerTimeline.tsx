import { CAREER } from '@/content/profile'

/**
 * CareerTimeline
 *
 * Dated career history for the About page. Renders nothing while
 * CAREER in src/content/profile.ts is empty, so no placeholder text
 * can reach the live site.
 */
export default function CareerTimeline() {
  if (CAREER.length === 0) {
    return null
  }

  return (
    <section className="border-b border-line" aria-labelledby="career-heading">
      <div className="site-container py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-4">Experience</p>
            <h2 id="career-heading" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Career
            </h2>
          </div>
          <ol className="border-l border-line">
            {CAREER.map((entry) => (
              <li key={`${entry.period}-${entry.title}`} className="relative pb-10 pl-7 last:pb-0">
                <span
                  className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-accent bg-charcoal"
                  aria-hidden="true"
                />
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">{entry.period}</p>
                <h3 className="mt-2 text-lg font-medium text-white">{entry.title}</h3>
                <p className="text-sm text-zinc-400">{entry.employer}</p>
                <ul className="mt-4 space-y-2">
                  {entry.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3 text-[15px] leading-relaxed text-zinc-300">
                      <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-zinc-500" aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
