import Link from 'next/link'
import JsonLd, { breadcrumbSchema } from '@/components/site/JsonLd'
import StatusChip from '@/components/site/StatusChip'
import { CASE_P as P, CaseBody, CaseNote, CaseSection as Section } from '@/components/portfolio/CaseStudyParts'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/constants'

const SLUG = 'remitflow-spec'
const TITLE = 'RemitFlow spec excerpt: the transfer quote'

const RPW = 'https://remittanceprices.worldbank.org/corridor/United-Arab-Emirates/India'
const RBI = 'https://rbi.org.in/Scripts/BS_ViewBulletin.aspx?Id=23260'

export const metadata = generateSEOMetadata({
  title: 'Spec excerpt: RemitFlow transfer quote',
  description:
    'An excerpt from the RemitFlow product spec: user stories, acceptance criteria, edge cases and metrics for a UAE to India transfer quote that holds the amount received and the arrival time.',
  url: `/portfolio/${SLUG}`,
  type: 'article',
})

const TOC = [
  { id: 'problem', label: 'Problem and evidence' },
  { id: 'scope', label: 'Scope of this excerpt' },
  { id: 'stories', label: 'User stories' },
  { id: 'edges', label: 'Edge cases' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'pricing', label: 'Where price fits' },
  { id: 'open', label: 'Open questions' },
]

const EVIDENCE = [
  { label: 'UAE share of India’s inward remittances, 2023-24', value: '19.2% of US$118.7 bn', source: 'RBI' },
  { label: 'Average total cost to send AED 735, Q3 2025', value: '3.72%', source: 'World Bank' },
  { label: 'Of which exchange-rate margin', value: '0.75%', source: 'World Bank' },
  { label: 'Range across surveyed providers, AED 735', value: '0.77% to 21.06%', source: 'World Bank' },
  { label: 'Delivery time across surveyed providers', value: 'Under 1 hour to 3–5 days', source: 'World Bank' },
]

const STORIES = [
  {
    id: 'Q1',
    story: 'As a sender, I want to see the rupees that will arrive before anything else, so I know what my family gets.',
    criteria: [
      'The sender can enter either the dirhams to send or the rupees to arrive; the other figure updates as they type.',
      'The amount received is the largest number on the screen.',
    ],
  },
  {
    id: 'Q2',
    story: 'As a sender, I want the total cost as one number, so I can compare it with what I use today.',
    criteria: [
      'Total cost = fee + exchange-rate margin, shown in AED and as a percentage of the amount sent.',
      'The margin is measured against a named reference rate, shown with its time.',
    ],
  },
  {
    id: 'Q3',
    story: 'As a sender, I want the quoted rate held while I pay, so the amount does not change under me.',
    criteria: [
      'The rate is held for a stated window, with a visible countdown.',
      'If the window ends before payment, a new quote is shown and the sender confirms again if the amount received changed.',
    ],
  },
  {
    id: 'Q4',
    story: 'As a sender, I want a stated arrival time, so I can tell my family when to expect the money.',
    criteria: [
      'The quote shows an arrival time in India time, based on the payout rail and its cut-offs.',
      'If a transfer will miss that time (a weekend, a holiday, a bank cut-off), the sender is told before paying.',
    ],
  },
  {
    id: 'Q5',
    story: 'As a recipient, I want the amount on the sender’s confirmation to be the amount I receive.',
    criteria: [
      'No deductions after confirmation. Any charge by the receiving bank is shown on the quote or absorbed.',
      'Any shortfall is logged as a defect and refunded to the sender.',
    ],
  },
  {
    id: 'Q6',
    story: 'As a sender, I want to know about limits before I pay, not after.',
    criteria: [
      'If the amount exceeds the sender’s verified limit, the quote says so and offers the largest allowed amount.',
      'Recipient account details are validated before payment where the payout rail supports it.',
    ],
  },
  {
    id: 'Q7',
    story: 'As a repeat sender, I want to send to a saved recipient in one step.',
    criteria: [
      'Repeat starts from the last amount and recipient but always fetches a fresh quote; an old rate is never reused.',
    ],
  },
  {
    id: 'Q8',
    story: 'As a sender, I want to see where my money is after I pay.',
    criteria: [
      'Status shows paid, sent and credited, each with a timestamp.',
      'Sender and recipient are notified when the money is credited.',
    ],
  },
]

const EDGES = [
  { title: 'Rate moves during payment', text: 'The held rate stands until the window ends. After that, a new quote and a new confirmation.' },
  { title: 'Card payment fails after the rate is held', text: 'The hold is released and the sender sees why. No transfer is created.' },
  { title: 'Recipient account rejected in India', text: 'Funds return to the sender with a stated refund time, and the recipient record is flagged for correction.' },
  { title: 'Holiday or weekend cut-off', text: 'The arrival time on the quote already reflects it. It is never changed after payment.' },
  { title: 'Compliance review holds a transfer', text: 'Status shows "under review" with what is needed, rather than "processing".' },
]

const METRICS = [
  { type: 'Primary', metric: 'Repeat transfers per sender within 90 days', why: 'The bet is that certainty drives repeat use' },
  { type: 'Primary', metric: 'Share of transfers credited by the time quoted', why: 'The arrival promise only works if it is kept' },
  { type: 'Leading', metric: 'Quote-to-send conversion', why: 'Shows whether showing the full cost puts people off' },
  { type: 'Guardrail', metric: 'Transfers where the amount received was less than quoted', why: 'Should be zero; every case is a defect' },
  { type: 'Guardrail', metric: '“Where is my money?” and “wrong amount” contacts per 1,000 transfers', why: 'Status and the quote should cut these' },
]

const OPEN = [
  'How long can the rate be held before the exchange-rate risk costs more than it earns in trust?',
  'Who absorbs a receiving bank’s charge when the rail does not show it in advance?',
  'Can an arrival time be promised on every payout rail, or only on instant ones?',
  'How much of the UPI and Aani link is live for person-to-person transfers today?',
]

function Table({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse border border-line bg-paper text-[15.5px] leading-normal">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="text-left font-mono text-xs uppercase tracking-[0.08em]">
            {head.map((cell) => (
              <th key={cell} scope="col" className="border-b-2 border-ink px-4 py-3 font-medium text-zinc-500">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')} className="border-b border-line last:border-0">
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={cell} scope="row" className="px-4 py-4 text-left align-top font-semibold text-white">
                    {cell}
                  </th>
                ) : (
                  <td key={cell} className="px-4 py-4 align-top text-zinc-300">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function RemitFlowSpecPage() {
  return (
    <main className="min-h-screen bg-charcoal text-white">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Work', url: `${SITE_URL}/portfolio` },
          { name: TITLE, url: `${SITE_URL}/portfolio/${SLUG}` },
        ])}
      />

      <section className="border-b border-line bg-paper">
        <div className="site-container pb-14 pt-28 sm:pt-32">
          <Link href="/portfolio/remitflow" className="inline-flex min-h-[44px] items-center text-[15px] text-accent hover:text-ink">
            ← RemitFlow case study
          </Link>
          <p className="animate-fade-up mb-5 mt-5 flex flex-wrap items-center gap-3">
            <StatusChip status="spec" />
            <span className="font-mono text-[13px] text-zinc-500">Work sample · RemitFlow</span>
          </p>
          <h1 className="animate-fade-up max-w-4xl text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-white sm:text-[44px] lg:text-[52px]">
            {TITLE}
          </h1>
          <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-[19px]">
            The part of the RemitFlow spec that defines what a sender sees before paying: the amount
            received, the total cost and the arrival time, and the rules that hold each one.
          </p>
          <CaseNote>
            RemitFlow is a concept. It is not built for production and has not been tested with users.
            Market figures were checked on 25 November 2026.
          </CaseNote>
        </div>
      </section>

      <CaseBody toc={TOC}>
        <Section id="problem" number={1} title="Problem and evidence">
          <p className={P}>
            A sender in the UAE cannot easily tell, before paying, how many rupees will arrive or when. The
            same transfer can cost under 1% or over 20%, and arrive in under an hour or in several days,
            depending on the provider and the method.
          </p>
          <Table
            caption="Corridor evidence"
            head={['Measure', 'Figure', 'Source']}
            rows={EVIDENCE.map((row) => [row.label, row.value, row.source])}
          />
          <p className="mt-4 text-sm text-zinc-500">
            Sources: <a className="text-accent hover:text-ink" href={RBI}>RBI Bulletin, March 2025</a> ·{' '}
            <a className="text-accent hover:text-ink" href={RPW}>World Bank, Remittance Prices Worldwide</a> (AED 735 is the
            survey&apos;s US$200 reference amount).
          </p>
          <p className={`${P} mt-6`}>
            <strong className="text-white">Hypothesis:</strong> for regular senders, certainty about the amount and
            the arrival time drives repeat use more than the lowest headline price.
          </p>
        </Section>

        <Section id="scope" number={2} title="Scope of this excerpt">
          <p className={P}>
            In scope: the quote, confirmation and status screens for transfers from the UAE to a bank account in
            India.
          </p>
          <p className={P}>
            Out of scope: sign-up and identity checks, the wallet, cash pickup, the refund operations process,
            and the commercial terms with the licensed partners RemitFlow would rely on.
          </p>
        </Section>

        <Section id="stories" number={3} title="User stories and acceptance criteria">
          <ol className="mt-6 grid gap-4">
            {STORIES.map((item) => (
              <li key={item.id} className="card grid grid-cols-[2.75rem_1fr] gap-4 p-5 sm:p-6">
                <span className="font-mono text-sm text-accent" aria-hidden="true">
                  {item.id}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold leading-snug text-white">{item.story}</h3>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15.5px] leading-relaxed text-zinc-400">
                    {item.criteria.map((criterion) => (
                      <li key={criterion}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="edges" number={4} title="Edge cases">
          <Table caption="Edge cases" head={['Case', 'Behaviour']} rows={EDGES.map((row) => [row.title, row.text])} />
        </Section>

        <Section id="metrics" number={5} title="Metrics">
          <p className={P}>Targets are set after a pilot gives a baseline. None of these is a measured result.</p>
          <Table
            caption="Metrics"
            head={['Type', 'Metric', 'Why it matters']}
            rows={METRICS.map((row) => [row.type, row.metric, row.why])}
          />
        </Section>

        <Section id="pricing" number={6} title="Where price fits">
          <p className={P}>
            The original concept targeted a flat 1.5% fee. On AED 735 that is about AED 11, below the corridor
            average of 3.72% (about AED 27) but above the cheapest surveyed options, which cost under 1.1%.
          </p>
          <p className={P}>
            So RemitFlow cannot win on price alone. Price has to be competitive; the product competes on the
            amount and arrival time being known, and kept.
          </p>
        </Section>

        <Section id="open" number={7} title="Open questions">
          <ul className="mt-2 list-disc space-y-2 pl-5 text-[16.5px] leading-relaxed text-zinc-200">
            {OPEN.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </Section>
      </CaseBody>

      <section className="border-t border-line bg-paper">
        <div className="site-container flex flex-col gap-3 py-12 sm:flex-row">
          <Link href="/portfolio/remitflow" className="btn-secondary">
            RemitFlow case study
          </Link>
          <Link href="/blog/uae-to-india-remittance-where-sender-loses-money" className="btn-secondary">
            Related post: where the sender loses money
          </Link>
          <Link href="/resume" className="btn-primary">
            Download resume
          </Link>
        </div>
      </section>
    </main>
  )
}
