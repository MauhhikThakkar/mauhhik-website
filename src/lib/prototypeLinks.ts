/**
 * Prototype links that override the `prototypeLink` field stored in Sanity.
 *
 * The prototypes are moving off Lovable to GitHub + Vercel one by one.
 * Listing a slug here makes every place on the site (portfolio grid,
 * case study page, work board) use the new link, even if the Sanity
 * entry still holds the old one.
 */
export const PROTOTYPE_LINKS: Record<string, string> = {
  remitflow: 'https://remitflow-v2.vercel.app',
  'ai-enterprise-support-triage': 'https://triage-genius-v2.vercel.app',
  'routeminds-ai': 'https://route-joy-flow.vercel.app',
}

export function prototypeLinkFor(slug: string, fallback?: string | null): string | undefined {
  return PROTOTYPE_LINKS[slug] ?? fallback ?? undefined
}
