import {
  CASE_P as P,
  CaseBody,
  CaseHeader,
  CaseNext,
  CaseNote,
  CaseSection as Section,
  CaseTimeline,
  ConstraintGrid,
  DecisionTable,
  OwnerPanel,
} from '@/components/portfolio/CaseStudyParts'
import JsonLd, { breadcrumbSchema } from '@/components/site/JsonLd'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/constants'

const SLUG = 'exchange-connectivity-delivery'
const TITLE = 'Multi-exchange connectivity build, delivered through scarce change windows'

export const metadata = generateSEOMetadata({
  title: 'Case study: multi-exchange connectivity delivery',
  description:
    'How a three-rack infrastructure and market-data connectivity build was re-sequenced to depend less on limited on-site change windows, and delivered about 30% faster than the agreed baseline.',
  url: `/portfolio/${SLUG}`,
  type: 'article',
})

const FACTS = [
  { label: 'Employer', value: 'My current employer (financial infrastructure)' },
  { label: 'My role', value: 'Project Manager' },
  { label: 'Client', value: 'U.S.-based financial-services firm (not named)' },
  { label: 'Site', value: 'Southeast Asian data centre, three racks' },
]

const CONSTRAINTS = [
  {
    title: 'No on-site team',
    text: 'Physical work was done by third-party field engineers, working from instructions coordinated with our network engineers.',
  },
  {
    title: 'Short change windows',
    text: 'Large installation activities were restricted to approved windows, typically four to five hours on Saturdays, so existing services were not affected.',
  },
  {
    title: 'Incomplete inventory',
    text: 'Stock already at the data centre could not be assumed to cover the build. The rest had to come from the United States.',
  },
  {
    title: 'Slow freight',
    text: 'Standard shipping was estimated at three to four weeks at the time, against a usual estimate of about one week. These were planning estimates.',
  },
  {
    title: 'Two time zones',
    text: 'Coordination ran across U.S. and Asian working hours, with the U.S. head office, sales, product, engineering and the field engineers all involved.',
  },
]

const OPTIONS = [
  {
    question: 'How to use site access',
    conventional: 'Wait for all equipment, then use a few large installation windows',
    chosen: 'Split the build into small, dependency-based work packages and complete each when its materials, engineers and access lined up',
  },
  {
    question: 'How to ship',
    conventional: 'Standard freight',
    chosen: 'Express air freight',
  },
  {
    question: 'Where to configure',
    conventional: 'Configure equipment on site after arrival',
    chosen: 'Complete suitable configuration in the United States before dispatch',
  },
]

const ACTIONS = [
  'Ran an inventory and requirements review with engineering and product colleagues, to establish what was already at the facility and what had to be supplied.',
  'Divided the implementation into smaller work packages by dependency, and scheduled them alongside other planned activity at the same data centre.',
  'From about the second week, progressed rack space, power provisioning and administrative prerequisites in parallel with equipment preparation and shipping.',
  'Requested express air freight. The equipment arrived in about seven business days.',
  'Asked network engineering to complete suitable configuration before dispatch, then coordinated the remaining installation, patching, configuration checks and client testing on site.',
]

const TOC = [
  { id: 'context', label: 'Context and my role' },
  { id: 'problem', label: 'The problem' },
  { id: 'decision', label: 'The decision' },
  { id: 'actions', label: 'What I did' },
  { id: 'result', label: 'Result and limits' },
  { id: 'owner', label: 'As product owner' },
]

export default function ExchangeConnectivityCaseStudy() {
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
        kicker="Case study 01 · Current employer"
        title={TITLE}
        summary="By overlapping readiness activities, accelerating the equipment shipment and moving configuration work before dispatch, I reduced the build’s dependence on limited on-site installation windows."
        result={{
          value: '30%',
          label: 'faster than the agreed baseline timeline, covering implementation and client testing.',
        }}
        facts={FACTS}
      />

      <CaseBody toc={TOC}>
        <Section id="context" number={1} title="Context and my role">
          <p className={P}>
            The client needed low-latency access to several Asian exchanges. The scope covered server and
            network infrastructure across three racks, internet and exchange connectivity, market-data
            connectivity, configuration, physical installation and patching, and coordinated testing with
            the client. It was an integrated infrastructure and data implementation, not a standalone
            server install.
          </p>
          <p className={P}>
            I owned delivery planning, dependency tracking, coordination and escalation, and I proposed
            the execution sequence. I coordinated network engineering, sales, product, infrastructure
            delivery, the U.S. head office and third-party field engineers at the data centre.
          </p>
          <CaseNote>
            Network engineering owned technical configuration and validation. Field engineers did the
            physical installation. Express freight and pre-dispatch configuration were my proposals; the
            decisions were taken with the teams that owned the cost and the configuration.
          </CaseNote>
        </Section>

        <Section id="problem" number={2} title="The problem">
          <p className={P}>
            The initial approach left most of the work waiting for equipment to reach the data centre,
            followed by installation and configuration inside limited change windows. With freight
            disrupted, that sequence put the client&apos;s timeline at risk: one late shipment would have
            pushed every later step into the next available Saturday.
          </p>
          <ConstraintGrid items={CONSTRAINTS} />
        </Section>

        <Section id="decision" number={3} title="The decision">
          <p className={P}>The scarcest resource was time on site. Each choice moved work away from it.</p>
          <DecisionTable rows={OPTIONS} />
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The trade-off: higher shipping cost and more coordination across many small work packages, in
            exchange for less work that depended on scarce on-site windows.
          </p>
        </Section>

        <Section id="actions" number={4} title="What I did, in order">
          <CaseTimeline steps={ACTIONS} />
        </Section>

        <Section id="result" number={5} title="Result and limits">
          <p className={P}>
            The implementation was delivered about 30% faster than the baseline timeline agreed for the
            project, which covered implementation and client testing. Less of the work was tied to on-site
            change windows than the original sequence required.
          </p>
          <p className={P}>
            This is one project, measured against its own agreed baseline. I do not publish the
            week-by-week schedule here; I am glad to walk through it in conversation.
          </p>
          <p className={P}>
            Next time I would assess alternative execution sequences at the start of the project, not
            introduce them under schedule pressure. That means asking on day one which activities can be
            finished before shipment, which can run in parallel, and which truly need a dedicated on-site
            window.
          </p>
        </Section>

        <OwnerPanel id="owner" number={6} title="If I were the product owner of this service">
          <p>
            I would explore making pre-dispatch configuration, inventory checks, site-readiness criteria
            and modular installation packages part of a repeatable service model. I would judge that model
            on delivery lead time, first-time acceptance, installation rework, implementation cost and time
            to billable service, not on speed alone.
          </p>
        </OwnerPanel>
      </CaseBody>

      <CaseNext
        href="/portfolio/bank-loan-assessment-mvp"
        title="A loan-assessment tool for small banks, shaped by interviewing branch managers"
        disclaimer="Client and site details are withheld. Nothing here comes from internal documents."
      />
    </main>
  )
}
