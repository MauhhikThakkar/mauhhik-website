/**
 * Written work samples: excerpts of product documents for concept projects.
 * Shown on the Work page between delivery work and the concept prototypes,
 * and linked from the matching case study.
 */
export interface WorkSample {
  slug: string
  title: string
  /** Case study the sample belongs to */
  caseStudySlug: string
  domain: string
  summary: string
  shows: string
}

export const WORK_SAMPLES: WorkSample[] = [
  {
    slug: 'remitflow-spec',
    title: 'RemitFlow spec excerpt: the transfer quote',
    caseStudySlug: 'remitflow',
    domain: 'UAE to India remittance · Product spec',
    summary:
      'The section of the RemitFlow spec that defines the quote a sender sees before paying: the amount received, the total cost and the arrival time, each held to.',
    shows: 'User stories with acceptance criteria, edge cases, metrics and open questions, built on World Bank and RBI figures.',
  },
]

export function workSampleFor(caseStudySlug: string): WorkSample | undefined {
  return WORK_SAMPLES.find((sample) => sample.caseStudySlug === caseStudySlug)
}
