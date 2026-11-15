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
  { label: 'Experience', value: '9+ years' },
  { label: 'Domains', value: 'Fintech, capital markets, AI products' },
  { label: 'Certified', value: 'ICPM, IBM AI Product Manager, Google Project Management' },
  { label: 'Open to', value: 'Product Manager and Technical Product Owner roles in the UAE and Singapore' },
]

export interface ProofPoint {
  value: string
  label: string
  detail: string
}

/**
 * Proof strip under the hero.
 * TODO(Mauhhik): confirm each number before the redesign goes live.
 */
export const PROOF_POINTS: ProofPoint[] = [
  {
    value: '9+',
    label: 'Years in financial infrastructure',
    detail: 'Delivery across fintech and capital markets',
  },
  {
    value: '4',
    label: 'Global exchanges served',
    detail: 'NASDAQ, NSE, JPX and ASX',
  },
  {
    value: '30%',
    label: 'Shorter implementation timeline',
    detail: 'Measured against the baseline agreed for a client delivery',
  },
  {
    value: '3',
    label: 'Product certifications',
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
}

/**
 * Career timeline on the About page.
 * Left empty on purpose: the section stays hidden until real entries are added
 * from the updated resume.
 */
export const CAREER: CareerEntry[] = []
