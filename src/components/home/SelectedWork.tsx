import Link from 'next/link'
import StatusChip, { type WorkStatus } from '@/components/site/StatusChip'

interface WorkItem {
  title: string
  domain: string
  summary: string
  /** What the case study is worth reading for */
  shows: string
  slug: string
  prototype: string
  status: WorkStatus
}

const WORK: WorkItem[] = [
  {
    title: 'RemitFlow',
    domain: 'Fintech · Cross-border payments',
    summary:
      'A remittance concept for the UAE to India corridor, designed around showing the fee and the exchange rate before the sender commits.',
    shows: 'Trust and transparency as product decisions in a regulated flow.',
    slug: 'remitflow',
    prototype: 'https://flow-dubai-mumbai.lovable.app',
    status: 'concept',
  },
  {
    title: 'Triage Genius',
    domain: 'Enterprise AI · Support operations',
    summary:
      'A support triage concept that ranks tickets by business impact and leaves the final call with a person.',
    shows: 'Where to stop automating, and the trade-off behind each limit.',
    slug: 'ai-enterprise-support-triage',
    prototype: 'https://triage-genius-hub.lovable.app',
    status: 'concept',
  },
  {
    title: 'Founder OS',
    domain: 'AI strategy · Founder tools',
    summary:
      'An operating framework concept for solo founders that ties weekly priorities to strategy and metrics.',
    shows: 'Choosing an opinionated structure over a configurable dashboard.',
    slug: 'founder-os',
    prototype: 'https://founder-os-hub.lovable.app',
    status: 'concept',
  },
]

/**
 * SelectedWork
 *
 * Three case studies on the home page. The first card is the lead and spans
 * the full width on desktop.
 */
export default function SelectedWork() {
  return (
    <section className="border-b border-line" aria-labelledby="work-heading">
      <div className="site-container py-20 md:py-28">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-14">
          <div>
            <p className="eyebrow mb-4">Selected work</p>
            <h2 id="work-heading" className="section-title">
              Product concepts, with the reasoning shown
            </h2>
          </div>
          <Link href="/portfolio" className="text-link text-sm">
            All case studies
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {WORK.map((item, index) => (
            <article
              key={item.slug}
              className={`card group flex flex-col p-6 sm:p-8 ${index === 0 ? 'md:col-span-2' : ''}`}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <p className="pt-1.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-zinc-500">
                  {item.domain}
                </p>
                <StatusChip status={item.status} />
              </div>

              <h3
                className={`font-semibold tracking-tight text-white ${
                  index === 0 ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-2xl sm:text-3xl'
                }`}
              >
                {item.title}
              </h3>

              <p className={`mt-4 text-base leading-relaxed text-zinc-400 ${index === 0 ? 'max-w-2xl sm:text-lg' : ''}`}>
                {item.summary}
              </p>

              <p className="mt-5 border-l-2 border-accent/40 pl-4 text-sm leading-relaxed text-zinc-300">
                {item.shows}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-white"
                >
                  Read case study
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6l6 6-6 6" />
                  </svg>
                </Link>
                <a
                  href={item.prototype}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  Open prototype
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
