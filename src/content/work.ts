import { DELIVERY_WORK } from './deliveryWork'

/**
 * Everything shown on the home page work board, in order: real delivery
 * from employment first, then concept prototypes.
 */
export interface BoardItem {
  slug: string
  title: string
  domain: string
  summary: string
  kind: 'delivered' | 'concept'
  /** Short result shown in the Delivered tag */
  result?: string
  prototype?: string
}

const RESULTS: Record<string, string> = {
  'exchange-connectivity-delivery': '30% faster',
  'bank-loan-assessment-mvp': '1 month early',
}

export const DELIVERED_ITEMS: BoardItem[] = DELIVERY_WORK.map((item) => ({
  slug: item.slug,
  title: item.title,
  domain: item.domain,
  summary: `${item.summary} ${item.shows}`,
  kind: 'delivered',
  result: RESULTS[item.slug],
}))

export const CONCEPT_ITEMS: BoardItem[] = [
  {
    slug: 'remitflow',
    title: 'RemitFlow',
    domain: 'UAE to India remittance',
    summary:
      'A remittance concept for the UAE to India corridor, rebuilt around certainty: what arrives, when, and what happens if a transfer goes wrong.',
    kind: 'concept',
    prototype: 'https://remitflow-v2.vercel.app',
  },
  {
    slug: 'ai-enterprise-support-triage',
    title: 'Triage Genius',
    domain: 'Support triage',
    summary:
      'A support concept that decides which tickets an AI agent may resolve, hands the rest to a person with a brief, and checks what the AI called resolved.',
    kind: 'concept',
    prototype: 'https://triage-genius-v2.vercel.app',
  },
  {
    slug: 'routeminds-ai',
    title: 'RouteMinds',
    domain: 'Last-mile delivery',
    summary:
      'A courier concept that follows each cash-on-delivery parcel from the doorstep to the deposit: failed attempts prevented and recovered, rider cash reconciled, and a statement line for every parcel.',
    kind: 'concept',
    prototype: 'https://route-joy-flow.vercel.app',
  },
  {
    slug: 'founder-os',
    title: 'Founder OS',
    domain: 'Tools for solo founders',
    summary: 'A planning concept for solo founders, informed by 30+ conversations with solo founders.',
    kind: 'concept',
    prototype: 'https://founder-os-hub.lovable.app',
  },
]
