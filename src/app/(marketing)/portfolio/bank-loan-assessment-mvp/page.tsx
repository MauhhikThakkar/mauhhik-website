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
  OwnerPanel,
} from '@/components/portfolio/CaseStudyParts'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/constants'

const SLUG = 'bank-loan-assessment-mvp'
const TITLE = 'A loan-assessment tool for small banks, shaped by interviewing branch managers'

export const metadata = generateSEOMetadata({
  title: 'Case study: loan-assessment MVP for small banks',
  description:
    'How in-person interviews with bank managers shaped a B2B fintech MVP delivered in two months, with two of three pilot branches willing to adopt it. A case study by Mauhhik Thakkar.',
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

const TOC = [
  { id: 'context', label: 'Context and my role' },
  { id: 'problem', label: 'The problem' },
  { id: 'decision', label: 'The decision' },
  { id: 'actions', label: 'What I did' },
  { id: 'result', label: 'Result and limits' },
  { id: 'reflection', label: 'What I would change' },
  { id: 'owner', label: 'As product owner' },
]

export default function BankLoanAssessmentCaseStudy() {
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
        kicker="Case study 02 · Inventam Tech Solution"
        title={TITLE}
        summary="I interviewed bank managers in person, turned what I learned into the shape of the product, and coordinated an MVP that was delivered in two months. Two of the three pilot branches were willing to adopt it."
        result={{
          value: '1 month',
          label: 'early on a four-month phase one, delivered at about 20% below the planned cost.',
        }}
        facts={FACTS}
      />

      <CaseBody toc={TOC}>
        <Section id="context" number={1} title="Context and my role">
          <p className={P}>
            A startup wanted to help branch staff at smaller Indian banks assess loan applications. Staff
            were reviewing an applicant&apos;s finances across paper documents and several separate sources.
            The product brought applicant information, uploaded bank statements and data from external
            integrations into one assessment workbook. I worked on the two-month MVP and on the first
            phase of development after it.
          </p>
          <p className={P}>
            My role combined project management with product discovery and definition. I ran the user
            interviews myself, wrote the requirements that came from them, and coordinated the founder,
            our sales representative, designers and developers through delivery.
          </p>
          <CaseNote>
            I advised the founder, who made the final product decisions. I had no authority over lending
            policy or loan decisions.
          </CaseNote>
        </Section>

        <Section id="problem" number={2} title="The problem">
          <p className={P}>
            To assess one application, staff checked income, tax information, existing liabilities and
            repayment behaviour across paper records and separate sources. The startup&apos;s working
            estimate was four to five business days per assessment. I did not measure that baseline myself.
          </p>
          <p className={P}>
            Retrieving the data was only half the problem. It had to arrive in a form branch staff could
            read and use in the way they already assessed loans.
          </p>
          <ConstraintGrid items={CONSTRAINTS} />
        </Section>

        <Section id="decision" number={3} title="The decision">
          <p className={P}>Three product choices, each traced back to what the branch managers said.</p>
          <ChoiceCards items={CHOICES} />
          <p className="mt-5 text-base leading-relaxed text-zinc-400">
            The trade-off: a spreadsheet is a modest piece of technology. It was also what the people
            making the assessment could read on day one.
          </p>
        </Section>

        <Section id="actions" number={4} title="What I did, in order">
          <CaseTimeline steps={ACTIONS} />
        </Section>

        <Section id="result" number={5} title="Result and limits">
          <p className={P}>
            We delivered the MVP within the planned two months and showed it to three branches. Two were
            happy with it and willing to adopt it. The third asked us to come back after a quarter, citing
            a budget constraint.
          </p>
          <p className={P}>
            Phase one was planned for four months. We delivered it in three, testing included, at about 20%
            below the planned cost.
          </p>
          <p className={P}>
            Processing time, as I observed it, was about two and a half hours in the MVP and about 70
            minutes by the end of phase one. The product&apos;s ambition was 59 minutes, which had not been
            reached.
          </p>
          <CaseNote>
            These are times I observed, not a controlled measurement, and the two figures may not cover
            identical work. They describe producing the assessment. They are not loan-approval times, and
            this project does not show any effect on lending outcomes.
          </CaseNote>
        </Section>

        <Section id="reflection" number={6} title="What I would change">
          <p className={P}>
            I would spend more time on discovery before fixing the MVP, and widen it. More interviews is not
            the point. I would make sure the research covered different user responsibilities, different
            branch contexts and the exceptions in the assessment process.
          </p>
          <p className={P}>
            I would also identify specialist technical needs earlier, since external integrations and
            bank-statement processing were central to the product.
          </p>
        </Section>

        <OwnerPanel id="owner" number={7} title="If I were the product owner taking it forward">
          <p>
            I would define success measures precisely from the start, and keep them separate:
            report-processing time, staff effort, assessment turnaround, report accuracy, exception handling
            and user adoption. Faster information and better lending decisions are different goals, and
            only the first was in scope here.
          </p>
        </OwnerPanel>
      </CaseBody>

      <CaseNext
        href="/portfolio/exchange-connectivity-delivery"
        title="Multi-exchange connectivity build, delivered through scarce change windows"
        disclaimer="The client, the banks and the data providers are not named."
      />
    </main>
  )
}
