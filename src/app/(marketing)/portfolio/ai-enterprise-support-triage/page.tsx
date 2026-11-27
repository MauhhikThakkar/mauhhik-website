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

const SLUG = 'ai-enterprise-support-triage'
const TITLE = 'Triage Genius: deciding what an AI support agent may do, and checking its work'
const PROTOTYPE = prototypeLinkFor(SLUG) ?? 'https://triage-genius-v2.vercel.app'

export const metadata = generateSEOMetadata({
  title: 'Case study: Triage Genius, an autonomy policy for AI support agents',
  description:
    'Why I rebuilt an AI ticket-triage concept into a policy that decides which tickets an AI agent may resolve, a handoff brief, and a check on AI resolutions. A B2B SaaS support concept by Mauhhik Thakkar.',
  url: `/portfolio/${SLUG}`,
  type: 'article',
})

const FACTS = [
  { label: 'Type', value: 'Concept prototype with simulated data' },
  { label: 'My role', value: 'Research, product definition, design and build, on my own' },
  { label: 'Setting', value: 'Support team of a fictional B2B SaaS company running an AI agent' },
  { label: 'Versions', value: 'v1 in Feb 2026 during ICPM; v2 rebuilt in Nov 2026' },
]

const DECISIONS = [
  {
    question: 'What the product is',
    conventional: 'An AI engine that sorts and routes tickets',
    chosen: 'A written policy for what the AI may do, plus a check on what it did',
  },
  {
    question: 'What the AI may do',
    conventional: 'Whatever the vendor’s agent can resolve',
    chosen: 'Three lanes set by request type and plan, with hard limits on refunds, access and legal requests',
  },
  {
    question: 'How it hands off',
    conventional: 'A chat transcript and an alert',
    chosen: 'A brief that lists what the customer already gave, so nobody asks again',
  },
  {
    question: 'What counts as resolved',
    conventional: 'The vendor’s count',
    chosen: 'Our own check: flags for likely false resolutions plus a random 5% sample',
  },
]

const FEATURES = [
  {
    title: 'A lane for every ticket, with its reasons',
    text: 'The policy sets a base lane; risk signals such as a renewal within 60 days or low AI confidence raise it one lane. A “lane track” on each ticket draws how the decision was made.',
  },
  {
    title: 'A policy editor that shows the cost first',
    text: 'Changing a lane previews the effect on the lane mix, agent hours and AI fees before saving, and every saved change needs a logged reason.',
  },
  {
    title: 'A brief, not a transcript',
    text: 'The person who takes over sees the request in one line, what the AI tried, the facts already collected and a suggested next step.',
  },
  {
    title: 'A visible way to a person',
    text: 'Customers can ask for a person at any time and are told who will reply and by when. The target is 15 minutes in business hours.',
  },
  {
    title: 'Incident hold',
    text: 'When many tickets share a symptom, they are grouped, the AI is paused for that symptom, and customers get one approved holding message instead of guesses.',
  },
  {
    title: 'Verification and learning',
    text: 'AI resolutions are flagged when reopened, followed by a new ticket, closed by silence or contradicted by the knowledge base. Overrides and repeat issues feed next week’s policy and the product backlog.',
  },
]

const EDGE_CASES = [
  {
    title: 'Two requests in one message',
    text: 'A how-to question and a refund together: the ticket takes the strictest lane of its parts.',
  },
  {
    title: 'Account data is missing',
    text: 'If plan or renewal data is slow or absent, the ticket goes to a person. A failed check never gives the AI more autonomy.',
  },
  {
    title: 'Customer asks for a person first',
    text: 'Routed at once, with no AI attempt and no penalty to any metric.',
  },
  {
    title: 'Forty tickets in an hour',
    text: 'Grouped as one incident; the AI may send only the message the incident commander approved.',
  },
]

const STEPS = [
  'Reviewed my February 2026 version: an AI engine that classified, scored and routed tickets, with people making the final call.',
  'Checked it against the market in November. Ticket sorting by AI is a standard helpdesk feature, and AI agents now resolve most routine tickets and are billed per resolution.',
  'Found where the failures had moved: what the AI should not touch, the handoff to a person, and whether “resolved” was true.',
  'Kept v1’s best idea, human control with visible reasoning, and rebuilt the concept around one loop: decide, hand off, verify, learn.',
  'Chose one setting, B2B SaaS support, because account context such as a renewal date changes the right decision.',
  'Wrote a PRD with alternatives, hard limits, a validation plan with pass marks, rollout and rollback criteria, and a decision log.',
  'Rebuilt the prototype in React and TypeScript, with a working policy editor and a 13-step guided walkthrough that cites the evidence behind each decision.',
]

const SOURCES = [
  { label: 'Salesforce: Fin acquisition and 76% average resolution rate', href: 'https://www.salesforce.com/news/press-releases/2026/09/10/salesforce-completes-acquisition-of-fin/' },
  { label: 'Zendesk: intelligent triage', href: 'https://support.zendesk.com/hc/en-us/articles/4964463770650-About-intelligent-triage' },
  { label: 'diginomica: Zendesk and verified resolutions', href: 'https://diginomica.com/zendesk-relate-2026-zendesk-prepares-outcome-based-future-built-verified-resolutions' },
  { label: 'CX Today: 83% of customers repeat themselves after a handoff', href: 'https://cxtoday.com/ai-handoffs-should-feel-seamless-why-arent-they-five9' },
  { label: 'Gartner: 87% of customers want access to a human', href: 'https://www.gartner.com/en/newsroom/press-releases/2026-08-04-gartner-survey-finds-87-percent-of-customers-say-companies-using-genai-for-customer-service-must-provide-access-to-a-human-agent0' },
  { label: 'California AB 1609 signed', href: 'https://www.lawcommentary.com/articles/california-ai-customer-service-chatbots-real-person-law' },
  { label: 'The Register: Cursor’s support bot invented a policy', href: 'https://www.theregister.com/2025/04/18/cursor_ai_support_bot_lies/' },
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

export default function TriageGeniusCaseStudy() {
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
        kicker="B2B SaaS support"
        title={TITLE}
        summary="My first version sorted and routed tickets with AI. By late 2026 every major helpdesk did that, and AI agents were resolving tickets themselves. The open problem had moved: which tickets the AI may close alone, how a person takes over, and whether “resolved” is true."
        result={{
          value: '3 lanes',
          label: 'AI resolves, AI drafts for a person, or a person owns it, set by a written policy with hard limits.',
        }}
        facts={FACTS}
        actions={
          <>
            <a href={`${PROTOTYPE}/walkthrough/1`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Start the walkthrough
            </a>
            <a href={`${PROTOTYPE}/console`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Open the console
            </a>
          </>
        }
      />

      <CaseBody toc={TOC}>
        <Section id="context" number={1} title="Context and my role">
          <p className={P}>
            I built the first Triage Genius in February 2026 during my product management programme at the Institute of Product
            Leadership, as one of four concepts in different industries. It was an AI engine that classified support tickets, scored
            their business impact and routed them, with people making the final decision.
          </p>
          <p className={P}>
            In November 2026 I tested it against the market, found its core feature had become standard, and rebuilt it. I did the
            research, product definition, design and build myself.
          </p>
          <CaseNote>
            This is a concept, not a product. The company, Northstack, and every account, person and ticket in the prototype are
            fictional. No real AI model runs in it, and it uses no employer information.
          </CaseNote>
        </Section>

        <Section id="problem" number={2} title="Why I changed it">
          <p className={P}>
            AI sorting of tickets by topic, sentiment and language has been a built-in helpdesk feature since 2022. And AI agents now
            resolve most routine tickets on their own: Fin reports a 76% average resolution rate across more than 30,000 companies,
            and Zendesk bills its AI agents only for verified resolutions. v1&apos;s promise that the AI would never reply was behind
            the market.
          </p>
          <p className={P}>
            The failures had moved to the edges. An AI agent can close a refund or an access request that needed a person. Handoffs
            lose context: in one 2026 survey, 96% of CX leaders said their handoffs keep context, while 83% of customers said they
            still repeat themselves. And AI can close a ticket that was never solved, or state a policy that does not exist, as
            Cursor&apos;s support bot did in 2025.
          </p>
          <p className={P}>
            v1 also had problems of its own. The case study described B2B customer support, but the prototype&apos;s tickets were
            internal IT requests. It showed two different sets of impact numbers, neither with a baseline. I removed all of them.
          </p>
        </Section>

        <Section id="decision" number={3} title="The decisions">
          <DecisionTable rows={DECISIONS} />
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The main trade-off: a strict policy gives up some of the AI&apos;s savings, and a loose one risks renewals. That is why
            every policy change shows its effect on agent hours and AI fees before anyone saves it.
          </p>
        </Section>

        <Section id="prototype" number={4} title="What the prototype shows">
          <ChoiceCards items={FEATURES} />
        </Section>

        <Section id="edges" number={5} title="Edge cases I designed for">
          <ConstraintGrid items={EDGE_CASES} />
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The PRD lists 13 in total, each with the expected behaviour.
          </p>
        </Section>

        <Section id="process" number={6} title="How I got there">
          <CaseTimeline steps={STEPS} />
        </Section>

        <Section id="measure" number={7} title="How I would measure it">
          <p className={P}>
            The headline measure is the share of all tickets that are resolved and still resolved 7 days later, whoever resolved them.
            It rewards real outcomes and cannot be gamed by closing tickets early.
          </p>
          <p className={P}>
            Alongside it: the gap between the vendor&apos;s resolution count and the verified count, confirmed false resolutions per
            1,000, how often a customer is asked again after a handoff, and the median time to reach a person. Two guardrails: zero AI
            resolutions on refunds, access or legal requests, and no drop in satisfaction for enterprise accounts.
          </p>
        </Section>

        <Section id="limits" number={8} title="Limits">
          <p className={P}>
            The evidence is public research only. I have not interviewed support teams for this concept, and the prototype uses
            simulated tickets and figures. The routing logic is real in the prototype, but there is no AI model behind the confidence
            and tone scores.
          </p>
          <p className={P}>
            Two things would decide whether it works in practice: whether the helpdesk&apos;s AI agent lets a company hold and
            re-route a reply before it sends, and whether account data can reach every ticket in about a second.
          </p>
        </Section>

        <OwnerPanel id="owner" number={9} title="If I were the product owner taking it forward">
          <p>
            I would run the policy in shadow mode on 500 past tickets before it touched a customer, and ask two senior agents to label
            which tickets needed a person. If the policy sent fewer than 98% of those to a person, I would fix the policy before
            building anything else.
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
        href="/portfolio/remitflow"
        title="RemitFlow: rebuilding a remittance concept around certainty, not price"
        disclaimer="Triage Genius is a concept. Northstack is fictional and all figures in the prototype are simulated."
      />
    </main>
  )
}
