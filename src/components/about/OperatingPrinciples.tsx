interface OperatingPrinciple {
  title: string
  /** The principle, in one sentence */
  statement: string
  /** Where it shows up in real work. Facts here match the resume. */
  evidence: string
}

const PRINCIPLES: OperatingPrinciple[] = [
  {
    title: 'Write the trade-off down',
    statement:
      'Every decision costs something. I name the cost when the decision is made, so the next person can see why it was made and when to revisit it.',
    evidence:
      'At Waypoint I manage risks, issues, technical dependencies and change for deployments that span engineering teams, clients and stakeholders in 10+ countries.',
  },
  {
    title: 'Measure before and after',
    statement:
      'A result only counts against a baseline. I agree the measure first, then report against it.',
    evidence:
      'I set up the KPIs and dashboards that track deployment performance at Waypoint. Before that I spent three years in analytics, building customer segmentation and churn models.',
  },
  {
    title: 'Protect quality, cut scope',
    statement:
      'When time is short, I reduce what ships. I do not lower the standard for what does ship.',
    evidence:
      'Delivery timelines at Waypoint came down 30% with 100% compliance with Operational Readiness standards. A fintech project at Inventam finished ahead of schedule, saving 15% of time and 20% of cost.',
  },
  {
    title: 'Use AI for speed, keep the judgment',
    statement:
      'AI tools shorten the distance from idea to something a person can click. Deciding what to build, and what to leave out, stays with me.',
    evidence:
      'The prototypes on this site were built with Lovable, Cursor and Claude. Each case study records the calls I made myself: what was cut, and where a person stays in the loop.',
  },
]

/**
 * OperatingPrinciples
 *
 * Four principles, each paired with where it shows up in real work.
 * The pairing is the point: a principle without evidence is a slogan.
 */
export default function OperatingPrinciples() {
  return (
    <section className="border-b border-line" aria-labelledby="principles-heading">
      <div className="site-container py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-4">Principles</p>
            <h2 id="principles-heading" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              How I operate
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Four rules, each with the work it comes from.
            </p>
          </div>

          <ol className="divide-y divide-line border-y border-line">
            {PRINCIPLES.map((principle, index) => (
              <li key={principle.title} className="grid gap-5 py-8 md:grid-cols-[3rem_1fr] md:gap-6">
                <span className="font-mono text-sm text-accent" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="grid gap-5 xl:grid-cols-2 xl:gap-10">
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-white">{principle.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-300">{principle.statement}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-charcoal-light/60 p-5">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                      In practice
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-400">{principle.evidence}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
