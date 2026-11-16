import Link from 'next/link'
import StatusChip from '@/components/site/StatusChip'
import { DELIVERY_WORK } from '@/content/deliveryWork'

/**
 * DeliveryShelf
 *
 * Real delivery work from employment, shown above the concept prototypes on
 * the Work page so the two are never confused.
 */
export default function DeliveryShelf() {
  if (DELIVERY_WORK.length === 0) return null

  return (
    <section className="mb-16 sm:mb-20" aria-labelledby="delivery-heading">
      <p id="delivery-heading" className="eyebrow mb-6">
        Delivery work
      </p>
      <div className="grid gap-6">
        {DELIVERY_WORK.map((item) => (
          <Link key={item.slug} href={`/portfolio/${item.slug}`} className="card group block p-6 sm:p-8 md:p-10">
            <div className="mb-6 flex items-start justify-between gap-4">
              <p className="pt-1.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-zinc-500">
                {item.domain}
              </p>
              <StatusChip status="delivered" />
            </div>
            <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">{item.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">{item.summary}</p>
            <p className="mt-5 max-w-2xl border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-zinc-300">
              {item.shows}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Read case study
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
