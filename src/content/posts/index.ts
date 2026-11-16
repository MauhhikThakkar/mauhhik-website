import type { LocalPost } from './types'
import deliverFaster from './deliver-faster-change-windows'
import pmToPo from './pm-to-po-job-postings'
import remittance from './uae-india-remittance-cost'

/** Newest first. Add a new post by creating a file beside these and listing it here. */
export const LOCAL_POSTS: LocalPost[] = [deliverFaster, pmToPo, remittance]

export function getLocalPost(slug: string): LocalPost | undefined {
  return LOCAL_POSTS.find((post) => post.slug === slug)
}

export type { LocalPost, PostBlock } from './types'
