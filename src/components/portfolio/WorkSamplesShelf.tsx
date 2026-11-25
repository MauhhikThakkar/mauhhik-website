import Link from 'next/link'
import StatusChip from '@/components/site/StatusChip'
import { WORK_SAMPLES } from '@/content/workSamples'

/**
 * WorkSamplesShelf
 *
 * Written product documents (spec excerpts) for concept projects, shown
 * between delivery work and the concept prototypes on the Work page.
 */
export default function WorkSamplesShelf() {
  if (WORK_SAMPLES.length === 0) return null

  return (
    <section className="mb-16 sm:mb-20" aria-labelledby="samples-heading">
      <p id="samples-heading" className="eyebrow mb-6">
        Work samples
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {WORK_SAMPLES.map((item) => (
          <Link key={item.slug} href={`/portfolio/${item.slug}`} className="card group block p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <p className="pt-1.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-zinc-500">
                {item.domain}
              </p>
              <StatusChip status="spec" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{item.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">{item.summary}</p>
            <p className="mt-5 max-w-2xl border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-zinc-300">
              {item.shows}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Read the excerpt
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
