import Link from 'next/link'

const POINTS = [
  {
    label: 'What I do',
    text: 'Deliver secure network deployments for tier-1 global exchanges across 10+ countries.',
  },
  {
    label: 'Best proof',
    text: 'A multi-exchange build delivered about 30% faster than the agreed baseline.',
  },
  {
    label: 'What I want',
    text: 'A Technical Product Manager or Technical Product Owner role in the UAE or Singapore.',
  },
]

/** The 30-second view: three facts and two actions */
export default function QuickSummary() {
  return (
    <section className="site-container pb-20" aria-label="30-second summary">
      <div className="rounded-lg bg-ink p-8 text-paper sm:p-10">
        <div className="grid gap-8 md:grid-cols-3">
          {POINTS.map((point) => (
            <div key={point.label}>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-muted">{point.label}</p>
              <p className="text-[17px] leading-relaxed">{point.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/resume" className="btn-on-dark">
            Download resume
          </Link>
          <Link href="/portfolio/exchange-connectivity-delivery" className="btn-outline-on-dark">
            Read the 30% case study
          </Link>
        </div>
      </div>
    </section>
  )
}
