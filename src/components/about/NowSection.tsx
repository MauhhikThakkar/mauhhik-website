import Link from 'next/link'

interface NowItem {
  status: string
  title: string
  description: string
  link?: { href: string; label: string }
}

/**
 * What Mauhhik is working on at present. Keep this list short and current:
 * remove an item when it is finished or parked.
 */
/** Change this date whenever the list below is edited */
const NOW_UPDATED = 'November 2026'

const NOW: NowItem[] = [
  {
    status: 'In progress',
    title: 'Product ownership, formally',
    description:
      'Preparing for the Scrum.org PSPO I assessment, to put a tested framework under the backlog and prioritisation work I have done alongside delivery.',
  },
  {
    status: 'Ongoing',
    title: 'Payments as a product problem',
    description:
      'Working through cross-border remittance from the sender’s side, starting with the UAE to India corridor: where fees hide, where trust breaks, and what a product can do about either.',
    link: { href: '/portfolio/remitflow', label: 'RemitFlow case study' },
  },
  {
    status: 'Ongoing',
    title: 'AI-assisted prototyping',
    description:
      'Taking a concept from problem statement to clickable prototype in days, then writing up the reasoning, so the thinking can be judged and not only the screens.',
    link: { href: '/portfolio', label: 'All case studies' },
  },
]

export default function NowSection() {
  return (
    <section className="border-b border-line" aria-labelledby="now-heading">
      <div className="site-container py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-4">Now</p>
            <h2 id="now-heading" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              What I&apos;m working on
            </h2>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
              Updated {NOW_UPDATED}
            </p>
          </div>

          <ul className="grid gap-5 md:grid-cols-3">
            {NOW.map((item) => (
              <li key={item.title} className="card flex flex-col p-6">
                <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {item.status}
                </p>
                <h3 className="text-lg font-medium tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{item.description}</p>
                {item.link && (
                  <Link href={item.link.href} className="text-link mt-5 text-sm">
                    {item.link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
