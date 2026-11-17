import InView from '@/components/site/InView'
import { CAREER } from '@/content/profile'

/** Oldest first, so the route reads left to right */
const ROUTE = [...CAREER].reverse()

/**
 * CareerRoute
 *
 * The whole career on one line: a horizontal route on desktop, a vertical
 * one on phones. The line draws in when it scrolls into view.
 */
export default function CareerRoute() {
  return (
    <section id="career" className="site-container py-16 md:py-20" aria-labelledby="career-heading">
      <p className="eyebrow mb-3">Career route</p>
      <h2 id="career-heading" className="section-title mb-10">
        Sales, a shop of my own, analytics, then delivery.
      </h2>

      <InView className="relative">
        {/* Desktop line */}
        <div className="draw-x absolute left-1.5 right-0 top-1.5 hidden h-0.5 bg-accent lg:block" aria-hidden="true" />
        {/* Phone line */}
        <div className="draw-y absolute bottom-2 left-1.5 top-1.5 w-0.5 bg-accent lg:hidden" aria-hidden="true" />

        <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-6">
          {ROUTE.map((entry, index) => {
            const isNow = index === ROUTE.length - 1
            return (
              <li key={entry.period} className="stagger grid grid-cols-[14px_1fr] gap-5 lg:block" style={{ ['--i' as string]: index }}>
                <span
                  className={`mt-0 block h-3.5 w-3.5 rounded-full ${
                    isNow ? 'animate-pulse-dot bg-accent' : 'border-2 border-accent bg-charcoal'
                  }`}
                  aria-hidden="true"
                />
                <div>
                  <p className={`mb-2 font-mono text-[12.5px] lg:mt-5 ${isNow ? 'text-accent' : 'text-zinc-500'}`}>
                    {entry.period}
                  </p>
                  <p className="mb-1.5 text-base font-semibold leading-snug text-white">{entry.title}</p>
                  <p className="text-sm leading-normal text-zinc-400">{entry.employer}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </InView>
    </section>
  )
}
