interface Principle {
  title: string
  description: string
}

const PRINCIPLES: Principle[] = [
  {
    title: 'Frame the problem first',
    description:
      'Separate symptoms from root causes and agree what success looks like before proposing a solution.',
  },
  {
    title: 'Test the riskiest assumption',
    description:
      'Run the smallest experiment that could prove the idea wrong, then change course on the evidence.',
  },
  {
    title: 'Hold the scope',
    description: 'Ship value in increments, say what is deliberately left out, and measure outcomes, not output.',
  },
  {
    title: 'Make trade-offs explicit',
    description:
      'Write down what each decision costs, so the next person can see why it was made.',
  },
]

const DOMAINS: { title: string; points: string }[] = [
  {
    title: 'Fintech and capital markets',
    points: 'Regulated flows, cross-border systems, trust-heavy journeys',
  },
  {
    title: 'Enterprise and B2B platforms',
    points: 'Workflow-heavy tools with many stakeholders',
  },
  {
    title: 'AI products',
    points: 'Human-in-the-loop design, explainability, limits on automation',
  },
]

/**
 * HowIWork
 *
 * Replaces the two older card grids (positioning and product thinking) with
 * one quieter section: four principles on the left, three domains on the right.
 */
export default function HowIWork() {
  return (
    <section className="border-b border-line" aria-labelledby="approach-heading">
      <div className="site-container py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="eyebrow mb-4">Approach</p>
            <h2 id="approach-heading" className="section-title mb-10">
              How I work
            </h2>
            <ol className="divide-y divide-line border-y border-line">
              {PRINCIPLES.map((principle, index) => (
                <li key={principle.title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6 sm:grid-cols-[3.5rem_1fr]">
                  <span className="font-mono text-sm text-accent" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-white">{principle.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
                      {principle.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:pt-[5.5rem]">
            <p className="eyebrow mb-6">Where I fit</p>
            <ul className="space-y-4">
              {DOMAINS.map((domain) => (
                <li key={domain.title} className="card p-5">
                  <h3 className="text-base font-medium text-white">{domain.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{domain.points}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
