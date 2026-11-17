import Link from 'next/link'
import { EVIDENCE, HEADLINE_EVIDENCE } from '@/content/profile'

/**
 * EvidenceSection
 *
 * The headline figure as a large tile, and every other figure in a table
 * that names where it comes from.
 */
export default function EvidenceSection() {
  return (
    <section className="border-y border-line bg-paper" aria-labelledby="evidence-heading">
      <div className="site-container py-16 md:py-20">
        <p className="eyebrow mb-3">Evidence</p>
        <h2 id="evidence-heading" className="section-title">
          Every figure, and where it comes from.
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-400">
          My title is Project Manager. Work on this site is labelled as delivered or concept, so you
          never have to guess which is which.
        </p>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-stretch">
          <Link
            href={HEADLINE_EVIDENCE.href}
            className="group flex flex-col justify-between gap-7 rounded-xl bg-ink p-8 text-paper transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-[400px] lg:flex-none"
          >
            <span className="text-[96px] font-bold leading-[0.85] tracking-[-0.05em] text-highlight sm:text-[136px]">
              {HEADLINE_EVIDENCE.value}
            </span>
            <span className="text-lg leading-normal">
              {HEADLINE_EVIDENCE.measures}{' '}
              <span className="underline decoration-paper/40 underline-offset-4 group-hover:decoration-paper">
                Read the case study
              </span>
            </span>
          </Link>

          <div className="min-w-0 flex-1 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[15.5px] leading-normal">
              <caption className="sr-only">Figures from my work and where each comes from</caption>
              <thead>
                <tr className="text-left font-mono text-xs uppercase tracking-[0.08em] text-zinc-500">
                  <th scope="col" className="w-[8.5rem] border-b-2 border-ink pb-3 pr-4 font-medium">Figure</th>
                  <th scope="col" className="border-b-2 border-ink px-4 pb-3 font-medium">What it measures</th>
                  <th scope="col" className="w-44 border-b-2 border-ink pb-3 pl-4 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {EVIDENCE.map((row) => (
                  <tr key={row.value} className="border-b border-line transition-colors last:border-0 hover:bg-charcoal">
                    <td className="py-[18px] pr-4 text-[26px] font-semibold text-accent">{row.value}</td>
                    <td className="px-4 py-[18px] text-zinc-200">{row.measures}</td>
                    <td className="py-[18px] pl-4">
                      {row.href ? (
                        <Link href={row.href} className="text-link">
                          {row.source}
                        </Link>
                      ) : (
                        <span className="text-zinc-400">{row.source}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
