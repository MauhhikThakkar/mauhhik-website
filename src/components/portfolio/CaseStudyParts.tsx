import Link from 'next/link'
import type { ReactNode } from 'react'
import InView from '@/components/site/InView'
import StatusChip from '@/components/site/StatusChip'

/**
 * Building blocks for delivery case studies (design concept D):
 * a header with the result tile and facts, a body with a contents rail,
 * numbered sections, a constraint grid, a decision table, a timeline of
 * actions, a qualifying note, the product-owner panel and a next link.
 */

/** Paragraph style shared by delivery case studies */
export const CASE_P = 'text-[17.5px] leading-[1.7] text-zinc-200 [&:not(:first-child)]:mt-4'

export interface CaseFact {
  label: string
  value: string
}

export function CaseHeader({
  kicker,
  title,
  summary,
  result,
  facts,
}: {
  kicker: string
  title: string
  summary: ReactNode
  result: { value: string; label: string }
  facts: CaseFact[]
}) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="site-container pb-14 pt-28 sm:pt-32">
        <Link href="/portfolio" className="inline-flex min-h-[44px] items-center text-[15px] text-accent hover:text-ink">
          ← All work
        </Link>
        <div className="mt-5 flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-14">
          <div className="min-w-0 flex-1">
            <p className="animate-fade-up mb-5 flex flex-wrap items-center gap-3">
              <StatusChip status="delivered" />
              <span className="font-mono text-[13px] text-zinc-500">{kicker}</span>
            </p>
            <h1
              className="animate-fade-up text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-white sm:text-[44px] lg:text-[52px]"
              style={{ animationDelay: '80ms' }}
            >
              {title}
            </h1>
            <p
              className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-[19px]"
              style={{ animationDelay: '160ms' }}
            >
              {summary}
            </p>
          </div>
          <div
            className="animate-fade-up flex flex-col justify-between gap-6 rounded-xl bg-ink p-7 text-paper lg:w-[340px] lg:flex-none"
            style={{ animationDelay: '240ms' }}
          >
            <p
              className={`font-bold leading-[0.85] tracking-[-0.05em] text-highlight ${
                result.value.length > 4 ? 'text-[64px] sm:text-[76px]' : 'text-[88px] sm:text-[120px]'
              }`}
            >
              {result.value}
            </p>
            <p className="text-[16.5px] leading-normal">{result.label}</p>
          </div>
        </div>
      </div>
      <div className="site-container">
        <dl className="grid border-t border-line text-[15px] leading-normal sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="py-5 pr-6">
              <dt className="mb-1.5 font-mono text-xs uppercase tracking-[0.08em] text-zinc-500">{fact.label}</dt>
              <dd className="text-zinc-200">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/** Body with a contents rail (sticky on wide screens) and the article column */
export function CaseBody({ toc, children }: { toc: { id: string; label: string }[]; children: ReactNode }) {
  return (
    <div className="site-container flex flex-col gap-10 py-14 md:py-16 lg:flex-row lg:items-start lg:gap-16">
      <nav
        aria-label="On this page"
        className="border-t-2 border-ink pt-3 lg:sticky lg:top-24 lg:w-56 lg:flex-none"
      >
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.08em] text-zinc-500">On this page</p>
        <ol className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
          {toc.map((item, index) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="block py-2 text-[15px] text-accent hover:text-ink">
                {index + 1}. {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <article className="min-w-0 max-w-[48rem] flex-1">{children}</article>
    </div>
  )
}

/** One numbered section of the article */
export function CaseSection({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="mb-14 last:mb-0">
      <h2 id={id} className="mb-4 scroll-mt-24 text-[26px] font-semibold tracking-tight text-white sm:text-[28px]">
        {number}. {title}
      </h2>
      {children}
    </section>
  )
}

/** Boxed note that qualifies a statement or a result */
export function CaseNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 rounded-lg border border-line bg-paper px-5 py-4 text-base leading-relaxed text-zinc-300">
      {children}
    </p>
  )
}

/** Constraints as a grid of short cards */
export function ConstraintGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-px overflow-hidden rounded-lg border border-line bg-line">
      {items.map((item) => (
        <li key={item.title} className="flex-[1_1_220px] bg-paper p-5">
          <h3 className="mb-2 text-[16.5px] font-semibold text-white">{item.title}</h3>
          <p className="text-[15px] leading-relaxed text-zinc-400">{item.text}</p>
        </li>
      ))}
    </ul>
  )
}

/** The conventional option struck through beside the option chosen */
export function DecisionTable({
  rows,
}: {
  rows: { question: string; conventional: string; chosen: string }[]
}) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse border border-line bg-paper text-[15.5px] leading-normal">
        <caption className="sr-only">Options considered and the option chosen</caption>
        <thead>
          <tr className="text-left font-mono text-xs uppercase tracking-[0.08em]">
            <th scope="col" className="w-[24%] border-b-2 border-ink px-4 py-3 font-medium text-zinc-500">Question</th>
            <th scope="col" className="w-[32%] border-b-2 border-ink px-4 py-3 font-medium text-zinc-500">Conventional</th>
            <th scope="col" className="border-b-2 border-ink px-4 py-3 font-medium text-accent">Chosen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.question} className="border-b border-line last:border-0">
              <th scope="row" className="px-4 py-4 text-left align-top font-semibold text-white">{row.question}</th>
              <td className="px-4 py-4 align-top text-zinc-500 line-through decoration-zinc-500/60">
                <span className="sr-only">Not chosen: </span>
                {row.conventional}
              </td>
              <td className="bg-accent-muted px-4 py-4 align-top font-medium text-white">{row.chosen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Numbered product choices, for decisions without a single conventional alternative */
export function ChoiceCards({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="mt-6 grid gap-4">
      {items.map((item, index) => (
        <li key={item.title} className="card grid grid-cols-[2.5rem_1fr] gap-4 p-5 sm:p-6">
          <span className="font-mono text-sm text-accent" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="text-[17px] font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-zinc-400">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Actions in order, on a line that draws down as it scrolls into view */
export function CaseTimeline({ steps }: { steps: string[] }) {
  return (
    <InView className="relative mt-6">
      <div className="draw-y absolute bottom-2 left-[15px] top-2 w-0.5 bg-accent" aria-hidden="true" />
      <ol className="relative flex flex-col gap-6">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          return (
            <li key={step} className="stagger flex gap-5" style={{ ['--i' as string]: index }}>
              <span
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-full font-mono text-[13px] ${
                  isLast ? 'bg-accent text-paper' : 'border-2 border-accent bg-charcoal text-accent'
                }`}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <p className="pt-1 text-[16.5px] leading-relaxed text-zinc-200">{step}</p>
            </li>
          )
        })}
      </ol>
    </InView>
  )
}

/** Amber panel: what I would do as the product owner */
export function OwnerPanel({ id, number, title, children }: { id: string; number: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mb-6 rounded-xl bg-highlight p-7 text-ink sm:p-8">
      <h2 id={id} className="mb-3 scroll-mt-24 font-mono text-[13px] font-medium uppercase tracking-[0.08em]">
        {number}. {title}
      </h2>
      <div className="text-[18px] font-medium leading-relaxed sm:text-[19px]">{children}</div>
    </section>
  )
}

/** Closing band: next case study and the resume */
export function CaseNext({ href, title, disclaimer }: { href: string; title: string; disclaimer: string }) {
  return (
    <section className="border-t border-line bg-paper">
      <div className="site-container py-12">
        <p className="mb-8 text-sm text-zinc-500">{disclaimer}</p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Link href={href} className="group max-w-2xl">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.08em] text-zinc-500">
              Next case study
            </span>
            <span className="text-2xl font-semibold leading-tight tracking-tight text-white group-hover:text-accent sm:text-[32px]">
              {title} →
            </span>
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/portfolio" className="btn-secondary">
              All work
            </Link>
            <Link href="/resume" className="btn-primary">
              Download resume
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
