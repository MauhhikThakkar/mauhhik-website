import Link from 'next/link'
import StatusChip from '@/components/site/StatusChip'
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

function Section({ eyebrow, title, id, children }: { eyebrow: string; title: string; id: string; children: React.ReactNode }) {
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

const P = 'text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5'

export default function ExchangeConnectivityCaseStudy() {
  return (
    <main className="bg-charcoal text-white min-h-screen">
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Work', url: `${SITE_URL}/portfolio` },
          { name: TITLE, url: `${SITE_URL}/portfolio/${SLUG}` },
        ])}
      />

      {/* Summary */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="site-container relative pb-14 pt-32 sm:pt-40 md:pb-20">
          <Link href="/portfolio" className="text-link text-sm">
            All work
          </Link>
          <div className="mt-8">
            <StatusChip status="delivered" />
          </div>
          <h1 className="mt-6 max-w-4xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            {TITLE}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            By overlapping readiness activities, accelerating the equipment shipment and moving
            configuration work before dispatch, I reduced the build&apos;s dependence on limited on-site
            installation windows and delivered about 30% faster than the agreed baseline timeline.
          </p>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((fact) => (
              <div key={fact.label} className="bg-charcoal-light p-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">{fact.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-200">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section eyebrow="Context" title="What was being delivered" id="context">
        <p className={P}>
          The client needed low-latency access to several Asian exchanges. The scope covered server and
          network infrastructure across three racks, internet and exchange connectivity, market-data
          connectivity, configuration, physical installation and patching, and coordinated testing with
          the client.
        </p>
        <p className={P}>
          It was an integrated infrastructure and data implementation, not a standalone server install.
        </p>
      </Section>

      <Section eyebrow="Role" title="What I owned, and what I did not" id="role">
        <p className={P}>
          I owned delivery planning, dependency tracking, coordination and escalation, and I proposed
          the execution sequence. I coordinated network engineering, sales, product, infrastructure
          delivery, the U.S. head office and third-party field engineers at the data centre.
        </p>
        <p className={P}>
          Network engineering owned technical configuration and validation. Field engineers did the
          physical installation. Express freight and pre-dispatch configuration were my proposals;
          the decisions were taken with the teams that owned the cost and the configuration.
        </p>
      </Section>

      <Section eyebrow="Problem" title="A plan that queued everything behind the freight" id="problem">
        <p className={P}>
          The initial approach left most of the work waiting for equipment to reach the data centre,
          followed by installation and configuration inside limited change windows. With freight
          disrupted, that sequence put the client&apos;s timeline at risk: one late shipment would have
          pushed every later step into the next available Saturday.
        </p>
      </Section>

      <Section eyebrow="Constraints" title="What could not be changed" id="constraints">
        <ul className="divide-y divide-line border-y border-line">
          {CONSTRAINTS.map((item) => (
            <li key={item.title} className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
              <h3 className="text-base font-medium text-white">{item.title}</h3>
              <p className="text-[15px] leading-relaxed text-zinc-400">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Decision" title="Three choices, one principle" id="decision">
        <p className={P}>
          The scarcest resource was time on site. Each choice moved work away from it.
        </p>
        <div className="mt-8 space-y-4">
          {OPTIONS.map((option) => (
            <div key={option.question} className="card p-5 sm:p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">{option.question}</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-500">Conventional</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-zinc-400">{option.conventional}</p>
                </div>
                <div className="border-l-2 border-accent/40 pl-4">
                  <p className="text-xs text-accent">Chosen</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-zinc-200">{option.chosen}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className={`${P} mt-8`}>
          <strong className="text-white">The trade-off:</strong> higher shipping cost and more
          coordination across many small work packages, in exchange for less work that depended on
          scarce on-site windows.
        </p>
      </Section>

      <Section eyebrow="Execution" title="What I did" id="execution">
        <ol className="divide-y divide-line border-y border-line">
          {ACTIONS.map((action, index) => (
            <li key={action} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
              <span className="font-mono text-sm text-accent" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[15px] leading-relaxed text-zinc-300">{action}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Result" title="About 30% faster than the agreed baseline" id="result">
        <p className={P}>
          The implementation was delivered about 30% faster than the baseline timeline agreed for the
          project, which covered implementation and client testing. Less of the work was tied to
          on-site change windows than the original sequence required.
        </p>
        <p className="mt-6 rounded-xl border border-line bg-charcoal-light/60 p-5 text-sm leading-relaxed text-zinc-400">
          This is one project, measured against its own agreed baseline. I do not publish the
          week-by-week schedule here; I am glad to walk through it in conversation.
        </p>
      </Section>

      <Section eyebrow="Reflection" title="What I would change" id="reflection">
        <p className={P}>
          I would assess alternative execution sequences at the start of the project, not introduce
          them under schedule pressure. That means asking on day one which activities can be finished
          before shipment, which can run in parallel, and which truly need a dedicated on-site window.
        </p>
        <h3 className="mt-10 text-lg font-medium text-white">If I were the product owner of this service</h3>
        <p className={P}>
          I would explore making pre-dispatch configuration, inventory checks, site-readiness criteria
          and modular installation packages part of a repeatable service model. I would judge that
          model on delivery lead time, first-time acceptance, installation rework, implementation cost
          and time to billable service, not on speed alone.
        </p>
      </Section>

      <section>
        <div className="site-container py-14 text-center">
          <p className="mx-auto max-w-xl text-sm text-zinc-500">
            Client and site details are withheld. Nothing here comes from internal documents.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/portfolio" className="btn-secondary">
              All work
            </Link>
            <Link href="/resume" className="btn-primary">
              View resume
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
