/**
 * Real delivery work (from employment), shown above the concept prototypes.
 * Each entry has its own page under /portfolio/<slug>.
 */
export interface DeliveryWork {
  slug: string
  title: string
  domain: string
  summary: string
  shows: string
}

export const DELIVERY_WORK: DeliveryWork[] = [
  {
    slug: 'exchange-connectivity-delivery',
    title: 'Multi-exchange connectivity build, delivered through scarce change windows',
    domain: 'Current employer · Infrastructure delivery',
    summary:
      'A three-rack infrastructure and market-data connectivity build at a Southeast Asian data centre, with no on-site team and installation limited to short weekend windows.',
    shows: 'Re-sequencing the work so less of it depended on the scarcest resource, time on site. Delivered about 30% faster than the agreed baseline.',
  },
  {
    slug: 'bank-loan-assessment-mvp',
    title: 'A loan-assessment tool for small banks, shaped by interviewing branch managers',
    domain: 'Inventam Tech Solution · B2B fintech',
    summary:
      'A fintech MVP that brought an applicant\u2019s financial information into one workbook for branch staff. Two of three pilot branches were willing to adopt it; phase one finished a month early.',
    shows: 'Discovery with real users, and letting what they said decide the format of the product.',
  },
]
