import JsonLd, { breadcrumbSchema } from '@/components/site/JsonLd'
import {
  CASE_P as P,
  CaseBody,
  CaseHeader,
  CaseNext,
  CaseNote,
  CaseSection as Section,
  CaseTimeline,
  ChoiceCards,
  ConstraintGrid,
  DecisionTable,
  OwnerPanel,
} from '@/components/portfolio/CaseStudyParts'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/constants'
import { prototypeLinkFor } from '@/lib/prototypeLinks'

const SLUG = 'remitflow'
const TITLE = 'RemitFlow: rebuilding a remittance concept around certainty, not price'
const PROTOTYPE = prototypeLinkFor(SLUG) ?? 'https://remitflow-v2.vercel.app'

export const metadata = generateSEOMetadata({
  title: 'Case study: RemitFlow, a UAE to India remittance concept',
  description:
    'Why I pivoted a UAE to India remittance concept from cheaper and faster to certainty: a locked amount, an arrival time, a name check and a named owner when a transfer goes wrong. A concept by Mauhhik Thakkar.',
  url: `/portfolio/${SLUG}`,
  type: 'article',
})

const FACTS = [
  { label: 'Type', value: 'Concept prototype with simulated data' },
  { label: 'My role', value: 'Research, product definition, design and build, on my own' },
  { label: 'Setting', value: 'A feature set inside a licensed UAE remittance provider (fictional, not named)' },
  { label: 'Versions', value: 'v1 in Feb 2026 during ICPM; v2 rebuilt in Nov 2026' },
]

const DECISIONS = [
  {
    question: 'Core promise',
    conventional: 'The lowest fee and the fastest transfer',
    chosen: 'Certainty: the exact rupee amount, an arrive-by time, and the fee back if it is late',
  },
  {
    question: 'Where it lives',
    conventional: 'A new stand-alone fintech app',
    chosen: 'Inside a licensed provider that already holds the licence, the payout partners and the trust',
  },
  {
    question: 'Who it serves',
    conventional: 'One generic sender',
    chosen: 'Three modes: family supporter, self-saver and salary-card worker',
  },
  {
    question: 'When it goes wrong',
    conventional: 'A support ticket and a wait',
    chosen: 'A named case owner, a dated timeline, and the route to the UAE complaints body if it runs late',
  },
]

const FEATURES = [
  {
    title: 'One number before sending',
    text: 'The quote shows the exact rupees that will arrive and the total cost, held for 10 minutes, with an optional box to compare against the sender’s bank.',
  },
  {
    title: 'A name check before money moves',
    text: 'Four outcomes modelled on the UK’s Confirmation of Payee: match, close match, no match and unable to check. Wrong beneficiary details are a leading cause of returned payments.',
  },
  {
    title: 'A transfer pass instead of a receipt',
    text: 'A boarding-pass style tracker with live stages, the Indian bank reference once paid, and a view the family in India can open in English, Hindi or Malayalam.',
  },
  {
    title: 'Exceptions designed, not left to support',
    text: 'Screens for a returned transfer, a verification hold and a delay, each with a case owner, a dated timeline and the refund or redirect choice.',
  },
  {
    title: 'A question at the moment of risk',
    text: 'For a large first transfer to a new recipient, one targeted scam question replaces a generic warning, and a gift-tax notice appears when a non-relative passes India’s ₹50,000 limit.',
  },
  {
    title: 'An ops console behind it',
    text: 'The provider’s view: filterable cases, refund rules, and a one-click notice to every sender affected by a payout partner incident.',
  },
]

const EDGE_CASES = [
  {
    title: 'Close name match',
    text: '“Priya S Sharma” against “Priya Sharma”. The sender sees the bank’s name and decides; continuing is recorded.',
  },
  {
    title: 'Expired Emirates ID',
    text: 'Flagged on the home screen before payday, not at checkout when the transfer is blocked.',
  },
  {
    title: 'Salary-card funding fees',
    text: 'A card company’s top-up fee can cancel a zero-fee headline, so salary-card mode shows the card and cash routes side by side.',
  },
  {
    title: 'Payout partner outage',
    text: 'Every affected sender gets the same notice from the ops console, instead of finding out from a family member.',
  },
]

const STEPS = [
  'Reviewed my February 2026 version, which promised lower fees and faster delivery through UPI.',
  'Argued against it with current data: the corridor is already cheap, several UAE providers advertise zero-fee transfers, and bill payment from abroad already exists through Bharat Connect.',
  'Went back to my informal conversations with Gulf-based senders. Their worry was not the fee. It was whether the money would arrive, and whom to call if it did not.',
  'Reframed the problem as certainty, placed it inside a licensed provider, and split the sender into three modes with different jobs.',
  'Researched the failure points: returned payments, name look-ups in India, verification holds, scams, gift tax, salary cards and the UAE complaints process.',
  'Wrote a PRD with prioritised requirements, 12 edge cases, success measures and open questions.',
  'Rebuilt the prototype in React and TypeScript off Lovable, with a 15-step guided walkthrough that explains each decision, its trade-off and how I would measure it.',
]

const SOURCES = [
  { label: 'World Bank Remittance Prices, UAE to India corridor', href: 'https://remittanceprices.worldbank.org/corridor/United-Arab-Emirates/India' },
  { label: 'Swift on rejected and returned payments', href: 'https://www.swift.com/fr/node/180461' },
  { label: 'UK Finance: Confirmation of Payee', href: 'https://www.ukfinance.org.uk/policy-and-guidance/guidance/confirmation-payee' },
  { label: 'Income Tax Department FAQ on gifts', href: 'https://www.incometaxindia.gov.in/documents/d/guest/faqs-on-gifts-received-by-an-individual-or-huf' },
  { label: 'Sanadak resolution process', href: 'https://sanadak.gov.ae/en/what-to-expect/resolution-process' },
  { label: 'Gulf News on sending money with a salary card', href: 'https://gulfnews.com/living-in-uae/banking/how-to-send-money-without-a-bank-account-in-the-uae-1.500183039' },
]

const TOC = [
  { id: 'context', label: 'Context and my role' },
  { id: 'problem', label: 'Why I changed it' },
  { id: 'decision', label: 'The decisions' },
  { id: 'prototype', label: 'What the prototype shows' },
  { id: 'edges', label: 'Edge cases' },
  { id: 'process', label: 'How I got there' },
  { id: 'measure', label: 'How I would measure it' },
  { id: 'limits', label: 'Limits' },
  { id: 'owner', label: 'As product owner' },
]

export default function RemitFlowCaseStudy() {
  return (
    <main className="min-h-screen bg-charcoal text-white">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Work', url: `${SITE_URL}/portfolio` },
          { name: TITLE, url: `${SITE_URL}/portfolio/${SLUG}` },
        ])}
      />

      <CaseHeader
        status="concept"
        kicker="UAE to India remittance"
        title={TITLE}
        summary="My first version promised cheaper, faster transfers. Research showed that problem is largely solved in this corridor. The version that remains is about certainty: what arrives, when, and who owns it if something goes wrong."
        result={{
          value: '3 modes',
          label: 'family supporter, self-saver and salary-card worker, in one prototype with a 15-step guided walkthrough.',
        }}
        facts={FACTS}
        actions={
          <>
            <a href={`${PROTOTYPE}/walkthrough/1`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Start the walkthrough
            </a>
            <a href={`${PROTOTYPE}/try`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Try the prototype
            </a>
          </>
        }
      />

      <CaseBody toc={TOC}>
        <Section id="context" number={1} title="Context and my role">
          <p className={P}>
            Millions of Indians working in the UAE send money home every month. I built the first RemitFlow
            in February 2026 during my product management programme at the Institute of Product Leadership.
            It was a secondary project; my submitted capstone was Founder OS.
          </p>
          <p className={P}>
            In November 2026 I reviewed it the way an interviewer would, found the core premise weak, and
            rebuilt it. I did the research, product definition, design and build myself.
          </p>
          <CaseNote>
            This is a concept, not a live service. The provider is fictional, all data is simulated, and no
            money moves. It is not based on any employer&apos;s product or information.
          </CaseNote>
        </Section>

        <Section id="problem" number={2} title="Why I changed it">
          <p className={P}>
            Version 1 competed on price and speed. In this corridor that is a weak position. The World Bank
            puts the average cost of sending $200 from the UAE to India at 3.72% in Q3 2025, and only 0.75% of
            that is the exchange-rate margin. Several UAE providers, banks included, already advertise
            zero-fee transfers. A new product cannot win on a margin that is already close to zero.
          </p>
          <p className={P}>
            What is not solved is uncertainty. A sender cannot always tell exactly how many rupees will
            arrive or when. Payments come back because of a wrong name or account. Transfers stop for
            verification with little explanation. Scams target exactly this moment. The people I spoke to
            informally said the same thing: they stayed with their bank because they knew whom to call in
            the UAE and in India if something went wrong.
          </p>
        </Section>

        <Section id="decision" number={3} title="The decisions">
          <DecisionTable rows={DECISIONS} />
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The main trade-off: showing the full cost openly can look dearer than a zero-fee rival at first
            glance. The bet is that a promise kept earns the second and third transfer, which is where a
            remittance business makes its money.
          </p>
        </Section>

        <Section id="prototype" number={4} title="What the prototype shows">
          <ChoiceCards items={FEATURES} />
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The self-saver mode covers sending to one&apos;s own NRE account with a target rate. Salary-card
            mode runs in English, Hindi, Malayalam and Tamil with a simpler layout.
          </p>
        </Section>

        <Section id="edges" number={5} title="Edge cases I designed for">
          <ConstraintGrid items={EDGE_CASES} />
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The PRD lists 12 in total, each with the expected behaviour.
          </p>
        </Section>

        <Section id="process" number={6} title="How I got there">
          <CaseTimeline steps={STEPS} />
        </Section>

        <Section id="measure" number={7} title="How I would measure it">
          <p className={P}>
            The headline measure is the share of transfers that arrive by the promised time. Alongside it:
            &ldquo;where is my money&rdquo; contacts per 1,000 transfers, time to resolve an exception, and
            whether a first-time sender transfers again within 35 days.
          </p>
          <p className={P}>
            Two guardrails stop the promise becoming expensive: the cost of fee refunds for late transfers,
            and fraud losses on first transfers to new recipients.
          </p>
        </Section>

        <Section id="limits" number={8} title="Limits">
          <p className={P}>
            The evidence is thin, and I want to be clear about it. It rests on two or three informal
            conversations in early 2026, all with white-collar senders, plus desk research. I have not
            tested v2 with users. The salary-card mode comes from research, not from talking to salary-card
            workers, and the Hindi, Malayalam and Tamil text has not yet been checked by native speakers.
          </p>
          <p className={P}>
            The arrive-by promise assumes payout data the provider would need to have. I would not make
            that promise in a real product before checking it against actual delivery times.
          </p>
        </Section>

        <OwnerPanel id="owner" number={9} title="If I were the product owner taking it forward">
          <p>
            I would test the certainty promise before building more: five senders from each mode, the quote
            and the transfer pass in front of them, and one question: would this change where you send from?
            Then I would size the late-fee refund against real delivery data before any public promise.
          </p>
        </OwnerPanel>

        <section aria-labelledby="sources" className="mt-14">
          <h2 id="sources" className="mb-4 text-[20px] font-semibold text-white">Sources</h2>
          <ul className="flex flex-col gap-2 text-[15px]">
            {SOURCES.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ink">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[15px] text-zinc-400">
            Each step of the{' '}
            <a href={`${PROTOTYPE}/walkthrough/1`} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-ink">
              guided walkthrough
            </a>{' '}
            cites the sources behind that decision.
          </p>
        </section>
      </CaseBody>

      <CaseNext
        href="/portfolio/exchange-connectivity-delivery"
        title="Multi-exchange connectivity build, delivered through scarce change windows"
        disclaimer="RemitFlow is a concept. The provider is fictional and all figures in the prototype are simulated."
      />
    </main>
  )
}
