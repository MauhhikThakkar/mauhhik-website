/**
 * Portfolio filter category mapping
 * Maps projects (by slug/title) and Sanity categories to filter categories
 */

export const FILTER_CATEGORIES = [
  "All",
  "AI Strategy",
  "Enterprise AI",
  "Fintech",
  "Logistics",
] as const

export type FilterCategory = (typeof FILTER_CATEGORIES)[number]

// Explicit project → filter category mapping (slug or title, case-insensitive)
const PROJECT_CATEGORY_MAP: Record<string, FilterCategory> = {
  "founder-os": "AI Strategy",
  "founder os": "AI Strategy",
  "ai-enterprise-support-triage": "Enterprise AI",
  "triage genius": "Enterprise AI",
  "routeminds": "Logistics",
  "route minds": "Logistics",
  "remitflow": "Fintech",
  "remit flow": "Fintech",
  "msme-digital-lending": "Fintech",
}

// Sanity category title → filter category (case-insensitive match)
const SANITY_CATEGORY_MAP: Record<string, FilterCategory> = {
  "ai strategy": "AI Strategy",
  "enterprise ai": "Enterprise AI",
  "fintech": "Fintech",
  "logistics": "Logistics",
}

export function getProjectFilterCategory(
  slug: string,
  title: string,
  sanityCategories?: Array<{ title: string }>
): FilterCategory | null {
  // 1. Check explicit project mapping
  const slugKey = slug.toLowerCase().trim()
  const titleKey = title.toLowerCase().trim()
  if (PROJECT_CATEGORY_MAP[slugKey]) return PROJECT_CATEGORY_MAP[slugKey]
  if (PROJECT_CATEGORY_MAP[titleKey]) return PROJECT_CATEGORY_MAP[titleKey]

  // 2. Check Sanity categories
  if (sanityCategories?.length) {
    for (const cat of sanityCategories) {
      const catKey = cat.title.toLowerCase().trim()
      if (SANITY_CATEGORY_MAP[catKey]) return SANITY_CATEGORY_MAP[catKey]
    }
  }

  return null
}
