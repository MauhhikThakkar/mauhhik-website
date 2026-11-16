import Link from 'next/link'
import StatusChip from '@/components/site/StatusChip'
import JsonLd, { breadcrumbSchema } from '@/components/site/JsonLd'
import {
  CASE_P as P,
  CaseStudyNote,
  CaseStudyRows,
  CaseStudySection as Section,
  CaseStudySteps,
} from '@/components/portfolio/CaseStudyParts'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/constants'

const SLUG = 'bank-loan-assessment-mvp'
const TITLE = 'A loan-assessment tool for small banks, shaped by interviewing branch managers'

export const metadata = generateSEOMetadata({
  title: 'Case study: loan-assessment MVP for small banks',
  description:
    'How in-person interviews with bank managers shaped a B2B fintech MVP that was delivered in two months and piloted in three branches. A case study by Mauhhik Thakkar.',
  url: `/portfolio/${SLUG}`,
  type: 'article',
})

const FACTS = [
  { label: 'Employer', value: 'Inventam Tech Solution' },
  { label: 'My role', value: 'Project Manager (IT), with product discovery and definition' },
  { label: 'Client', value: 'Fintech startup (not named)' },
  { label: 'Users', value: 'Branch staff at smaller Indian banks, including cooperative banks' },
]

const CONSTRAINTS = [
  {
    title: 'Two months',
    text: 'The MVP had a two-month delivery target.',
  },
  {
    title: 'Mixed comfort with software',
    text: 'Branch staff varied widely in how comfortable they were with software, so the output had to be readable without training.',
  },
  {
    title: 'External data',
    text: 'The product depended on integrations with external data providers, which the founder was willing to pay for per call.',
  },
  {
    title: 'Inconsistent statements',
    text: 'Uploaded bank statements came in a different format from each bank, and the product had to extract and organise them all.',
  },
]

const CHOICES = [
  {
    title: 'Combine two sources of data',
    text: 'Use uploaded documents together with externally retrieved information, so the assessment did not rest only on what the applicant supplied.',
  },
  {
    title: 'Deliver the assessment as an Excel workbook',
    text: 'A structured workbook of about 14 to 15 tabs, with charts and summaries beside the detailed data. This came from asking managers how they wanted to review the information.',
  },
  {
    title: 'Pilot before building further',
    text: 'Launch an MVP, test it in a small number of branches, then develop the product on what the pilot showed.',
  },
]

const ACTIONS = [
  'Interviewed bank managers and branch stakeholders in person about their loan-assessment workflow, the information they needed and how they preferred to read it.',
  'Turned those findings into product and design requirements, including the multi-tab Excel output with visual summaries.',
  'Worked with the founder and the technical team on data-provider access, bank-statement processing and bringing the information into one consolidated assessment.',
  'Coordinated designers and frontend and backend developers to deliver the MVP within the two-month target, followed by testing in three branches.',
  'Continued into phase-one development after the pilot, coordinating further improvements to the product and its processing time.',
]

export default function BankLoanAssessmentCaseStudy() {
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
            I interviewed bank managers in person, turned what I learned into the shape of the product,
            and coordinated an MVP that was delivered in two months and piloted in three branches.
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

      <Section eyebrow="Context" title="What was being built" id="context">
        <p className={P}>
          A startup wanted to help branch staff at smaller Indian banks assess loan applications. Staff
          were reviewing an applicant&apos;s finances across paper documents and several separate sources.
        </p>
        <p className={P}>
          The product brought applicant information, uploaded bank statements and data from external
          integrations into one assessment workbook. I worked on the two-month MVP and on the first
          phase of development after it.
        </p>
      </Section>

      <Section eyebrow="Role" title="What I owned, and what I did not" id="role">
        <p className={P}>
          My role combined project management with product discovery and definition. I ran the user
          interviews myself, wrote the requirements that came from them, and coordinated the founder,
          our sales representative, designers and developers through delivery.
        </p>
        <p className={P}>
          I advised the founder, who made the final product decisions. I had no authority over lending
          policy or loan decisions, and the product informed a bank&apos;s assessment; it did not approve loans.
        </p>
      </Section>

      <Section eyebrow="Problem" title="Days spent assembling information" id="problem">
        <p className={P}>
          To assess one application, staff checked income, tax information, existing liabilities and
          repayment behaviour across paper records and separate sources. The startup&apos;s working estimate
          was four to five business days per assessment. I did not measure that baseline myself.
        </p>
        <p className={P}>
          Retrieving the data was only half the problem. It had to arrive in a form branch staff could
          read and use in the way they already assessed loans.
        </p>
      </Section>

      <Section eyebrow="Constraints" title="What shaped the MVP" id="constraints">
        <CaseStudyRows items={CONSTRAINTS} />
      </Section>

      <Section eyebrow="Decision" title="Three product choices" id="decision">
        <div className="space-y-4">
          {CHOICES.map((choice, index) => (
            <div key={choice.title} className="card grid grid-cols-[2.5rem_1fr] gap-4 p-5 sm:p-6">
              <span className="font-mono text-sm text-accent" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-base font-medium text-white">{choice.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">{choice.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p className={`${P} mt-8`}>
          <strong className="text-white">The trade-off:</strong> a spreadsheet is a modest piece of
          technology. It was also what the people making the assessment could read on day one.
        </p>
      </Section>

      <Section eyebrow="Execution" title="What I did" id="execution">
        <CaseStudySteps steps={ACTIONS} />
      </Section>

      <Section eyebrow="Result" title="MVP in two months, piloted in three branches" id="result">
        <p className={P}>
          We delivered the MVP within the planned two months and tested it in three branches. Two of
          the three said they were willing to proceed.
        </p>
        <p className={P}>
          Processing time, as I observed it, was about two and a half hours in the MVP and about 70
          minutes by the end of phase one. The product&apos;s ambition was 59 minutes, which had not been
          reached.
        </p>
        <CaseStudyNote>
          These are times I observed, not a controlled measurement, and the two figures may not cover
          identical work. They describe producing the assessment. They are not loan-approval times,
          and this project does not show any effect on lending outcomes.
        </CaseStudyNote>
      </Section>

      <Section eyebrow="Reflection" title="What I would change" id="reflection">
        <p className={P}>
          I would spend more time on discovery before fixing the MVP, and widen it. More interviews is
          not the point. I would make sure the research covered different user responsibilities,
          different branch contexts and the exceptions in the assessment process.
        </p>
        <p className={P}>
          I would also identify specialist technical needs earlier, since external integrations and
          bank-statement processing were central to the product.
        </p>
        <h3 className="mt-10 text-lg font-medium text-white">If I were the product owner taking it forward</h3>
        <p className={P}>
          I would define success measures precisely from the start, and keep them separate:
          report-processing time, staff effort, assessment turnaround, report accuracy, exception
          handling and user adoption. Faster information and better lending decisions are different
          goals, and only the first was in scope here.
        </p>
      </Section>

      <section>
        <div className="site-container py-14 text-center">
          <p className="mx-auto max-w-xl text-sm text-zinc-500">
            The client, the banks and the data providers are not named.
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
