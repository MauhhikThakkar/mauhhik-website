import type { ReactNode } from 'react'

/** Paragraph style shared by delivery case studies */
export const CASE_P = 'text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5'

/**
 * CaseStudySection
 *
 * One titled band of a delivery case study: label and heading on the left,
 * content on the right.
 */
export function CaseStudySection({
  eyebrow,
  title,
  id,
  children,
}: {
  eyebrow: string
  title: string
  id: string
  children: ReactNode
}) {
  return (
    <section className="border-b border-line" aria-labelledby={id}>
      <div className="site-container py-14 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-4">{eyebrow}</p>
            <h2 id={id} className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {title}
            </h2>
          </div>
          <div className="max-w-3xl">{children}</div>
        </div>
      </div>
    </section>
  )
}

/** Row list used for constraints: short title on the left, explanation on the right */
export function CaseStudyRows({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <li key={item.title} className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
          <h3 className="text-base font-medium text-white">{item.title}</h3>
          <p className="text-[15px] leading-relaxed text-zinc-400">{item.text}</p>
        </li>
      ))}
    </ul>
  )
}

/** Numbered list of actions */
export function CaseStudySteps({ steps }: { steps: string[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line">
      {steps.map((step, index) => (
        <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
          <span className="font-mono text-sm text-accent" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="text-[15px] leading-relaxed text-zinc-300">{step}</p>
        </li>
      ))}
    </ol>
  )
}

/** Boxed note that qualifies a result */
export function CaseStudyNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 rounded-xl border border-line bg-charcoal-light/60 p-5 text-sm leading-relaxed text-zinc-400">
      {children}
    </p>
  )
}
