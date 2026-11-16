import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { SITE_URL } from '@/lib/constants'

export const revalidate = 3600

interface SlugEntry {
  slug: string
  _updatedAt?: string
}

const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
const POSTS_QUERY = `*[_type == "blog" && defined(slug.current) && !(_id in path("drafts.**"))]{ "slug": slug.current, _updatedAt }`

async function fetchEntries(query: string): Promise<SlugEntry[]> {
  try {
    return await client.fetch<SlugEntry[]>(query)
  } catch (error) {
    // The sitemap must still build if the CMS is unreachable
    console.error('Sitemap: could not fetch entries', error)
    return []
  }
}

/**
 * sitemap.xml, built from the static pages plus every case study and blog
 * post in Sanity. New posts appear within an hour of publishing.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    fetchEntries(PROJECTS_QUERY),
    fetchEntries(POSTS_QUERY),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/portfolio/exchange-connectivity-delivery`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/portfolio/bank-loan-assessment-mvp`, changeFrequency: 'monthly', priority: 0.9 },
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/portfolio`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/resume`, changeFrequency: 'monthly', priority: 0.8 },
  ]

  staticPages.push({ url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 })

  return [
    ...staticPages,
    ...projects.map((project) => ({
      url: `${SITE_URL}/portfolio/${project.slug}`,
      lastModified: project._updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post._updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
