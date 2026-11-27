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

const SLUG = 'routeminds-ai'
const TITLE = 'RouteMinds: following each cash-on-delivery parcel from the doorstep to the deposit'
const PROTOTYPE = prototypeLinkFor(SLUG) ?? 'https://routeminds-v2.vercel.app'

export const metadata = generateSEOMetadata({
  title: 'Case study: RouteMinds, from a route optimiser to COD parcels and cash',
  description:
    'Why I retired an AI route-optimisation concept and rebuilt it around failed delivery attempts, rider cash and per-parcel merchant statements for a courier hub. A last-mile logistics concept by Mauhhik Thakkar.',
  url: `/portfolio/${SLUG}`,
  type: 'article',
})

const FACTS = [
  { label: 'Type', value: 'Concept prototype with simulated data' },
  { label: 'My role', value: 'Research, product definition, design and build, on my own' },
  { label: 'Setting', value: 'Hub of a fictional mid-size Dubai courier serving cash-on-delivery merchants' },
  { label: 'Versions', value: 'v1 in Feb 2026 during ICPM; v2 rebuilt in Nov 2026' },
]

const DECISIONS = [
  {
    question: 'What the product is',
    conventional: 'An AI route optimiser for mid-size fleets',
    chosen: 'One chain per COD parcel, from risk check to payout; the route solver is bought',
  },
  {
    question: 'Where AI is used',
    conventional: 'As the headline, including for routing',
    chosen: 'Two narrow jobs: turning rider notes into proposed rules, and later failure risk. Never cash or judging a rider',
  },
  {
    question: 'How a failure claim is checked',
    conventional: 'The rider’s reason, typed at the end of the shift',
    chosen: 'Evidence attached at the door; no call or more than 300 m from the pin means “needs review”, never “fraud”',
  },
  {
    question: 'How the merchant is paid',
    conventional: 'One total, twice a week to monthly',
    chosen: 'A statement line per parcel, fees set off only with consent, and every line can be disputed',
  },
  {
    question: 'How savings are shown',
    conventional: 'Before and after against an assumed baseline',
    chosen: 'No targets until four weeks of baseline; the north star is cost per delivered COD order',
  },
]

const FEATURES = [
  {
    title: 'A risk score before dispatch',
    text: 'Six visible factors, such as a missing Makani number or an unanswered pre-call, give each shipment a score. The controller pre-confirms High ones on WhatsApp, offers a prepaid link or moves them to tomorrow.',
  },
  {
    title: 'A known cash float for every rider',
    text: 'Each rider’s expected COD is checked against a cap, and a rules library checks the plan: AED 500 per order, the UAE midday rule in summer and truck windows for heavy vehicles.',
  },
  {
    title: 'One tap at the door',
    text: 'The rider records the outcome and tender in one tap. Calls, distance from the pin and time are attached automatically, and a partial delivery recalculates the COD before cash changes hands.',
  },
  {
    title: 'A 36-hour recovery clock',
    text: 'Every failed attempt shows the time left before it becomes a return, with a self-reschedule link, reattempt slots, address fixes and evidence review.',
  },
  {
    title: 'Cash-in by tender, statements by parcel',
    text: 'Cash is counted against what deliveries should have produced; card and link money never enters the drawer. Merchants get one line per parcel, with fees, anything held and a dispute button.',
  },
  {
    title: 'Rules learned from riders, approved by a person',
    text: 'Each week, AI groups rider notes into proposed rules with an evidence label, such as a tower with no signal or a gate that closes at 18:00. The controller approves or rejects each one.',
  },
]

const EDGE_CASES = [
  {
    title: 'The customer keeps two of three items',
    text: 'The COD drops before collection, and the third item starts its return. The rider’s count and the merchant’s statement agree by construction.',
  },
  {
    title: 'Cash recorded on a parcel marked refused',
    text: 'Cash-in sign-off is blocked until either the delivery status or the cash is corrected.',
  },
  {
    title: 'An honest rider with no signal',
    text: 'A claim from a basement with no network is flagged, cleared with a note, and the building becomes a proposed rule. The false-flag rate is a guardrail.',
  },
  {
    title: 'A suspected counterfeit note',
    text: 'Held and logged; the rider is not charged until it is verified, and the merchant’s statement shows the amount as held.',
  },
]

const STEPS = [
  'Reviewed my February 2026 version’s code. The prototype sat behind a login, its “AI engine” sorted orders by latitude, its savings were the optimised figure × 1.25, and its own sample data produced a 1,142 km route for an 8-hour shift.',
  'Checked the market in November. Google sells route optimisation per shipment, Routific is free under 100 orders a month, and FarEye, Shipsy and Locus all pitch AI agents for dispatch.',
  'Considered a planner that learns from drivers’ deviations, and dropped it: Locus already markets learned service times and OptimoRoute ships a planned-versus-actual report.',
  'Compared 22 logistics product ideas on eight weighted criteria, including the gap still open, fit with my payments background and whether I could gather evidence. A chain from failed attempts to merchant payouts ranked first.',
  'Chose a setting, a mid-size Dubai courier, with India as a second market profile, because I can gather field evidence in Surat.',
  'Wrote a PRD covering local rules, the RBI and CBUAE positions on cash on delivery, 15 edge cases, metrics without invented targets and an evidence plan.',
  'Rebuilt the prototype in React and TypeScript: eight screens on one simulated hub day and a nine-step guided walkthrough that cites the evidence behind each decision.',
]

const SOURCES = [
  { label: 'ClickPost: COD 24.15% vs prepaid 3.61% failed to reach customers (Meesho, H1 FY26)', href: 'https://www.clickpost.ai/blog/address-quality-digipin-statistics-india' },
  { label: 'ClickPost: 88.5% of orders with three or more failed attempts end as returns', href: 'https://www.clickpost.ai/blog/ndr-failed-delivery-statistics-india' },
  { label: 'Amazon Shipping India: the 36-hour window after a failed delivery', href: 'https://shipping.amazon.in/blog/what-is-ndr-in-shipping-india' },
  { label: 'Quiqup: COD billing and payout days', href: 'https://support.quiqup.com/support/solutions/articles/154000236056-billing-cash-on-delivery-cod-' },
  { label: 'RBI directions on payment aggregators, 15 September 2025', href: 'https://www.fidcindia.org.in/wp-content/uploads/2025/09/RBI-PAYMENT-AGGREGATORS-DIRECTIONS-15-09-25.pdf' },
  { label: 'Khaleej Times: delivery riders and the UAE midday break', href: 'https://www.khaleejtimes.com/uae/delivery-drivers-cannot-be-forced-work-midday-break' },
  { label: 'Google Maps Platform: Route Optimization API billing', href: 'https://developers.google.com/maps/documentation/route-optimization/usage-and-billing' },
  { label: 'Locus: service time learned per driver feeds the next plan', href: 'https://locus.sh/blogs/driver-app-workarounds-service-time-data/' },
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

export default function RouteMindsCaseStudy() {
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
        kicker="Last-mile logistics"
        title={TITLE}
        summary="My first version promised AI route optimisation for mid-size fleets. When I reviewed it, its solver sorted orders by latitude and its savings were invented, and route solving had become a commodity. I moved the product to where couriers lose money: cash-on-delivery attempts that fail, and the cash that follows the ones that succeed."
        result={{
          value: '1 chain',
          label: 'Risk check, attempt, recovery, cash-in, statement and payout, traced for every parcel.',
        }}
        facts={FACTS}
        actions={
          <>
            <a href={`${PROTOTYPE}/walkthrough/1`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Start the walkthrough
            </a>
            <a href={`${PROTOTYPE}/console`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Open the hub console
            </a>
          </>
        }
      />

      <CaseBody toc={TOC}>
        <Section id="context" number={1} title="Context and my role">
          <p className={P}>
            I built the first RouteMinds in February 2026 during my product management programme at the Institute of Product
            Leadership, as one of four concepts in different industries. It was a route optimisation and dispatch tool for fleets of
            20 to 200 vehicles.
          </p>
          <p className={P}>
            In November 2026 I reviewed it, found it could not survive an interviewer&apos;s first question, and rebuilt it as a
            different product under the same name. I did the research, product definition, design and build myself.
          </p>
          <CaseNote>
            This is a concept, not a product. Sandline Couriers and every merchant, rider, customer and figure in the prototype are
            fictional, and it uses no employer information.
          </CaseNote>
        </Section>

        <Section id="problem" number={2} title="Why I changed it">
          <p className={P}>
            v1&apos;s problems were my own first. Its engine did not optimise anything: it sorted orders by latitude and split them
            evenly across vehicles, ignoring capacity and time windows. Its before-and-after savings were the optimised figure
            multiplied by 1.25, so every plan showed exactly 20%. I removed all of it.
          </p>
          <p className={P}>
            The market had also moved. Route solving is sold per shipment by Google and given away by Routific for small volumes, and
            the large vendors now pitch AI agents for dispatch. A better planner would have been a me-too product.
          </p>
          <p className={P}>
            The money is lost after the plan leaves the hub. COD orders fail far more often than prepaid ones: Meesho saw 24.15% of
            COD shipments fail to reach customers in the first half of FY26, against 3.61% of prepaid. A failed delivery that is not
            recovered within about 36 hours usually becomes a return. And published UAE payout cycles run from twice a week to
            monthly, with no per-parcel trail for the merchant to check.
          </p>
        </Section>

        <Section id="decision" number={3} title="The decisions">
          <DecisionTable rows={DECISIONS} />
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The main trade-off: strict evidence rules protect merchants but will flag honest riders, so every flag can be cleared
            with a note, and the share of flags cleared is watched as a guardrail.
          </p>
        </Section>

        <Section id="prototype" number={4} title="What the prototype shows">
          <ChoiceCards items={FEATURES} />
        </Section>

        <Section id="edges" number={5} title="Edge cases I designed for">
          <ConstraintGrid items={EDGE_CASES} />
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The PRD lists 15 in total, from a merchant editing the COD after dispatch to Ramadan iftar windows, each with the
            expected behaviour.
          </p>
        </Section>

        <Section id="process" number={6} title="How I got there">
          <CaseTimeline steps={STEPS} />
        </Section>

        <Section id="measure" number={7} title="How I would measure it">
          <p className={P}>
            The north star is cost per delivered COD order: delivery, reattempts, returns and cash handling, divided by COD orders
            delivered. It falls when failed attempts are prevented or recovered, and it cannot be improved by hiding failures.
          </p>
          <p className={P}>
            Alongside it: first-attempt delivery rate, failed attempts recovered within 36 hours, return rate, the share of failure
            claims backed by evidence, cash variance, rider cash-days outstanding, days from delivery to payout, and merchant disputes
            per 1,000 parcels. Three guardrails: the false-flag rate on rider claims, rider attrition, and how often customers are
            contacted. I set no targets until four weeks of baseline exist.
          </p>
        </Section>

        <Section id="limits" number={8} title="Limits">
          <p className={P}>
            I have not interviewed couriers or merchants for this concept yet. Most of the Indian failure figures come from ClickPost,
            which sells software for this problem, and the UAE share of COD depends on how it is measured. Every number in the
            prototype is simulated.
          </p>
          <p className={P}>
            The legal position matters too. In India, the RBI&apos;s payment aggregator rules exclude cash COD from escrow, so cash
            and electronic payments at the door must stay separate. In the UAE, I found no Central Bank text on couriers holding COD
            cash for merchants, so a real launch would need a legal opinion first.
          </p>
        </Section>

        <OwnerPanel id="owner" number={9} title="If I were the product owner taking it forward">
          <p>
            I would start with 8 to 12 conversations in Surat with courier franchise owners and online sellers who take a lot of COD
            orders, and collect an anonymised cash-in sheet, the spread of failure reasons and a remittance statement. If sellers told
            me payouts are rarely wrong, I would drop the statement and keep first-attempt recovery on its own.
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
        href="/portfolio/ai-enterprise-support-triage"
        title="Triage Genius: deciding what an AI support agent may do, and checking its work"
        disclaimer="RouteMinds is a concept. Sandline Couriers is fictional and all figures in the prototype are simulated."
      />
    </main>
  )
}
