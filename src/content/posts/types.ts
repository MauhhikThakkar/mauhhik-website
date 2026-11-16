/**
 * Blog posts written in code.
 *
 * Posts can also be written in Sanity Studio. Code posts exist so an article
 * can be published through a pull request, with tables and reviewed wording.
 * Text supports **bold** and [links](https://example.com).
 */
export type PostBlock =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'table'; caption?: string; head: string[]; rows: string[][] }

export interface LocalPost {
  slug: string
  title: string
  metaTitle: string
  description: string
  category: string
  tags: string[]
  /** ISO date */
  publishedAt: string
  readingTime: number
  shortAnswer: string
  takeaway: string
  body: PostBlock[]
  related?: { href: string; label: string }
}
