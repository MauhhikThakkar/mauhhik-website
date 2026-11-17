/**
 * Profile content
 *
 * Every fact shown in the hero card, the proof strip and the career timeline
 * lives in this one file. Edit here; the pages update themselves.
 *
 * Rule for this file: only facts you can defend in an interview.
 */

export interface ProfileFact {
  label: string
  value: string
}

/** Hero side card */
export const PROFILE_FACTS: ProfileFact[] = [
  { label: 'Role', value: 'Project Manager, financial infrastructure' },
  { label: 'Experience', value: '9+ years, including 4+ managing IT delivery' },
  { label: 'Domains', value: 'Exchange network infrastructure, fintech, SaaS' },
  { label: 'Certified', value: 'ICPM, IBM AI Product Manager, Google Project Management' },
  { label: 'Open to', value: 'Technical Product Manager and Technical Product Owner roles in the UAE and Singapore' },
]

export interface ProofPoint {
  value: string
  label: string
  detail: string
}

/**
 * Proof strip under the hero. Figures are taken from the resume.
 */
export const PROOF_POINTS: ProofPoint[] = [
  {
    value: '9+',
    label: 'Years of professional experience',
    detail: 'Including 4+ years managing IT delivery',
  },
  {
    value: '10+',
    label: 'Countries delivered into',
    detail: 'Secure SD-WAN deployments for tier-1 global exchanges',
  },
  {
    value: '30%',
    label: 'Faster delivery',
    detail: 'On a multi-exchange build, against the agreed baseline timeline',
  },
  {
    value: '3',
    label: 'Product and project certifications',
    detail: 'ICPM, IBM AI Product Manager, Google Project Management',
  },
]

export interface CareerEntry {
  /** e.g. "2021 to present" */
  period: string
  /** Official title, exactly as on your employment record */
  title: string
  /** Employer name, or an anonymised description */
  employer: string
  /** Two or three outcomes, each one sentence */
  outcomes: string[]
  /** Titles held within this employer, newest first, when there was an internal move */
  roles?: { title: string; period: string }[]
}

/**
 * Career timeline on the About page. Titles, employers and dates match the resume.
 */
export const CAREER: CareerEntry[] = [
  {
    period: 'Jan 2024 to present',
    title: 'FIN Infrastructure Project Manager',
    employer: 'Waypoint Trading Solutions (formerly Transaction Network Services)',
    roles: [
      { title: 'FIN Infrastructure Project Manager', period: 'May 2026 to present' },
      { title: 'Project Manager, FSD PMO, Service Implementation', period: 'Jan 2024 to Apr 2026' },
    ],
    outcomes: [
      'Deliver Secure SD-WAN solutions for tier-1 global exchanges across 10+ countries, from planning through deployment.',
      'Reduced project delivery timelines by 30% while achieving 100% compliance with Operational Readiness standards.',
      'Established KPIs and dashboards to track deployment performance.',
    ],
  },
  {
    period: 'Jul 2023 to Nov 2023',
    title: 'Project Manager (IT)',
    employer: 'Aviansoft Pvt. Ltd., Surat',
    outcomes: [
      'Managed IT delivery for a product-based startup in the automobile industry, from requirements to deployment.',
      'Introduced Microsoft 365 tools and new SOPs, improving operational efficiency by 20%.',
    ],
  },
  {
    period: 'Jul 2022 to Jun 2023',
    title: 'Project Manager (IT)',
    employer: 'Inventam Tech Solution, Surat',
    outcomes: [
      'Managed 3 client projects across FinTech, Gaming and AI/ML, along with multiple SaaS initiatives.',
      'Supported in-house product development for habit-tracking applications and CRM platforms.',
      'Delivered a fintech product phase in three months against a four-month plan, at about 20% below planned cost.',
    ],
  },
  {
    period: 'Aug 2019 to Jun 2022',
    title: 'Senior Assistant Manager, Data Analyst',
    employer: 'PM Consultancy, Surat',
    outcomes: [
      'Performed customer segmentation and business analysis across Retail, Finance and Manufacturing.',
      'Enabled process innovation that reduced project duration by 40% and increased client revenue by 15%.',
    ],
  },
  {
    period: 'Jan 2018 to Apr 2019',
    title: 'Founder',
    employer: 'Nandishwar Enterprise (Sports Station), Ahmedabad',
    outcomes: ['Founded a multibrand sports footwear retail store and ran it from funding to merchandising and team building.'],
  },
  {
    period: 'Aug 2016 to Nov 2017',
    title: 'Assistant General Manager',
    employer: 'Euro India Fresh Foods',
    outcomes: ['Achieved 30% year-on-year sales growth in South Gujarat and managed distributed teams across Gujarat.'],
  },
]
