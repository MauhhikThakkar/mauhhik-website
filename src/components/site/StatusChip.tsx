/**
 * StatusChip
 *
 * Says plainly what kind of work a card or case study is.
 * "concept" = a prototype with no users, "pilot" = tested with real users,
 * "shipped" = live work with measured results, "delivered" = real client
 * delivery from employment, "spec" = a written work sample for a concept.
 * Real work gets the amber tag; concepts and specs an outline.
 */
export type WorkStatus = 'concept' | 'pilot' | 'shipped' | 'delivered' | 'spec'

const LABELS: Record<WorkStatus, string> = {
  concept: 'Concept prototype',
  pilot: 'Pilot',
  shipped: 'Shipped',
  delivered: 'Delivered',
  spec: 'Spec excerpt · concept',
}

export default function StatusChip({ status = 'concept', detail }: { status?: WorkStatus; detail?: string }) {
  const label = detail ? `${LABELS[status]} · ${detail}` : LABELS[status]
  return <span className={status === 'concept' || status === 'spec' ? 'tag-concept' : 'tag-delivered'}>{label}</span>
}
