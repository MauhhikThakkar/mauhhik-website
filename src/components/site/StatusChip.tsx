/**
 * StatusChip
 *
 * Says plainly what kind of work a card or case study is.
 * "concept" = a prototype with no users, "pilot" = tested with real users,
 * "shipped" = live work with measured results.
 */
export type WorkStatus = 'concept' | 'pilot' | 'shipped'

const LABELS: Record<WorkStatus, string> = {
  concept: 'Concept prototype',
  pilot: 'Pilot',
  shipped: 'Shipped',
}

export default function StatusChip({ status = 'concept' }: { status?: WorkStatus }) {
  const isLive = status !== 'concept'
  return (
    <span
      className={`inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${
        isLive
          ? 'border-accent/30 bg-accent-muted text-accent'
          : 'border-line-strong bg-white/5 text-zinc-300'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-accent' : 'bg-zinc-400'}`}
        aria-hidden="true"
      />
      {LABELS[status]}
    </span>
  )
}
