import { client } from '@/sanity/lib/client'
import { SITE_URL } from '@/lib/constants'
import { LOCAL_POSTS } from '@/content/posts'

export const revalidate = 3600

interface FeedPost {
  title: string
  slug: string
  shortDescription?: string
  publishedAt?: string
}

const FEED_QUERY = `*[_type == "blog" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...50]{
  title, "slug": slug.current, shortDescription, publishedAt
}`

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * GET /blog/rss.xml
 * RSS feed of blog posts, for feed readers and for cross-posting tools.
 */
export async function GET() {
  let posts: FeedPost[] = []
  try {
    posts = await client.fetch<FeedPost[]>(FEED_QUERY)
  } catch (error) {
    console.error('RSS: could not fetch posts', error)
  }

  const localPosts: FeedPost[] = LOCAL_POSTS.map((post) => ({
    title: post.title,
    slug: post.slug,
    shortDescription: post.description,
    publishedAt: post.publishedAt,
  }))
  const localSlugs = new Set(localPosts.map((post) => post.slug))

  const items = [...localPosts, ...posts.filter((post) => !localSlugs.has(post.slug))]
    .filter((post) => post.title && post.slug)
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>${
        post.publishedAt ? `\n      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ''
      }${
        post.shortDescription ? `\n      <description>${escapeXml(post.shortDescription)}</description>` : ''
      }
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mauhhik Thakkar — Writing</title>
    <link>${SITE_URL}/blog</link>
    <description>Notes on payments infrastructure, delivery and moving from project to product management.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
