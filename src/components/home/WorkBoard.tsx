import Link from 'next/link'
import { CONCEPT_ITEMS, DELIVERED_ITEMS } from '@/content/work'

const Chevron = () => (
  <svg
    className="chev h-4 w-4 flex-none text-zinc-500 transition-transform duration-200 motion-reduce:transition-none"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path d="M6 3l5 5-5 5" />
  </svg>
)

/**
 * WorkBoard
 *
 * Delivered work as rows that open for a summary, concepts on one line
 * beneath. Uses native <details>, so it works without JavaScript.
 */
export default function WorkBoard() {
  return (
    <section id="work" className="site-container py-16 md:py-20" aria-labelledby="work-heading">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-3">Work</p>
          <h2 id="work-heading" className="section-title">
            What shipped, and what is a concept.
          </h2>
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-zinc-400">
          Delivered rows are real employment work and open for a summary. Concept rows are prototypes.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-paper">
        {DELIVERED_ITEMS.map((item, index) => (
          <details key={item.slug} open={index === 0} className="group border-b border-line">
            <summary className="flex min-h-[44px] flex-wrap items-center gap-x-5 gap-y-2 px-5 py-5 transition-colors hover:bg-charcoal sm:px-6">
              <span className="w-7 flex-none font-mono text-[13px] text-zinc-500">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0 flex-[999_1_18rem] text-lg font-semibold leading-snug text-white sm:text-xl">
                {item.title}
              </span>
              <span className="tag-delivered">Delivered{item.result ? ` · ${item.result}` : ''}</span>
              <Chevron />
            </summary>
            <div className="flex flex-col gap-4 px-5 pb-7 sm:flex-row sm:items-end sm:gap-12 sm:pl-[4.5rem] sm:pr-6">
              <p className="flex-1 text-base leading-relaxed text-zinc-400">{item.summary}</p>
              <div className="flex-none sm:w-60">
                <p className="mb-1 text-sm text-zinc-500">{item.domain}</p>
                <Link href={`/portfolio/${item.slug}`} className="inline-flex min-h-[44px] items-center font-semibold text-accent hover:text-ink">
                  Read case study →
                </Link>
              </div>
            </div>
          </details>
        ))}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 bg-charcoal px-5 py-5 sm:px-6">
          <span className="w-7 flex-none font-mono text-[13px] text-zinc-500">
            {String(DELIVERED_ITEMS.length + 1).padStart(2, '0')}
          </span>
          <span className="tag-concept">Concepts</span>
          <ul className="flex flex-[999_1_24rem] flex-wrap gap-x-7">
            {CONCEPT_ITEMS.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="inline-flex min-h-[44px] items-center text-base text-accent hover:text-ink"
                >
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-zinc-400">&nbsp;· {item.domain}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
