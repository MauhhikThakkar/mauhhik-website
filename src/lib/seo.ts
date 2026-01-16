import { Metadata } from 'next'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from './constants'

export interface SEOConfig {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`
const DEFAULT_OG_IMAGE_ALT = `${SITE_NAME} — Product Manager & AI Product Builder`
const TWITTER_HANDLE = '@mauhhik'

/**
 * Generate comprehensive SEO metadata with defaults
 * 
 * @param config - SEO configuration (all fields optional, will use defaults)
 * @returns Next.js Metadata object
 */
export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    image = DEFAULT_OG_IMAGE,
    imageAlt = DEFAULT_OG_IMAGE_ALT,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors = [SITE_NAME],
    tags,
    noindex = false,
    nofollow = false,
  } = config

  // Build titles
  // Next.js template will automatically add site name to page titles
  const defaultTitle = `${SITE_NAME} — Product Manager & AI Product Builder`
  const pageTitle = title || defaultTitle
  // For OpenGraph/Twitter, we need the full title with site name
  const fullTitle = title ? `${title} | ${SITE_NAME}` : defaultTitle

  // Build canonical URL
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL

  // OpenGraph configuration
  const openGraph: Metadata['openGraph'] = {
    type,
    locale: 'en_US',
    url: canonicalUrl,
    siteName: SITE_NAME,
    title: fullTitle,
    description,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: imageAlt,
      },
    ],
  }

  // Add article-specific OpenGraph fields
  if (type === 'article') {
    openGraph.article = {}
    if (publishedTime) {
      openGraph.article.publishedTime = publishedTime
    }
    if (modifiedTime) {
      openGraph.article.modifiedTime = modifiedTime
    }
    if (authors && authors.length > 0) {
      openGraph.article.authors = authors
    }
    if (tags && tags.length > 0) {
      openGraph.article.tags = tags
    }
  }

  // Twitter card configuration
  const twitter: Metadata['twitter'] = {
    card: 'summary_large_image',
    title: fullTitle,
    description,
    images: [image],
    creator: TWITTER_HANDLE,
  }

  // Robots configuration
  const robots: Metadata['robots'] = {
    index: !noindex,
    follow: !nofollow,
    googleBot: {
      index: !noindex,
      follow: !nofollow,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${SITE_NAME}`,
      ...(title && { absolute: fullTitle }), // Override for this page
    },
    description,
    keywords: tags || [
      'product manager',
      'AI products',
      'SaaS',
      'product strategy',
      'product management',
      'AI-first products',
      'product thinking',
    ],
    authors: authors.map((name) => ({ name })),
    creator: SITE_NAME,
    openGraph,
    twitter,
    robots,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

/**
 * Generate page-specific metadata with overrides
 * Useful for pages that need to override specific fields
 * 
 * @param baseConfig - Base SEO configuration
 * @param overrides - Specific field overrides
 * @returns Next.js Metadata object
 */
export function generatePageMetadata(
  baseConfig: SEOConfig,
  overrides?: Partial<Metadata>
): Metadata {
  const baseMetadata = generateMetadata(baseConfig)
  
  // Merge with overrides, with overrides taking precedence
  return {
    ...baseMetadata,
    ...overrides,
    openGraph: {
      ...baseMetadata.openGraph,
      ...overrides?.openGraph,
      images: overrides?.openGraph?.images || baseMetadata.openGraph?.images,
    },
    twitter: {
      ...baseMetadata.twitter,
      ...overrides?.twitter,
      images: overrides?.twitter?.images || baseMetadata.twitter?.images,
    },
  }
}

/**
 * Default SEO metadata for the site
 * Used as fallback in root layout
 */
export const defaultMetadata = generateMetadata({
  title: undefined, // Will use default from generateMetadata
  description: SITE_DESCRIPTION,
  url: '/',
})
