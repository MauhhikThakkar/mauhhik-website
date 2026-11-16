import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

/**
 * robots.txt
 *
 * Search and AI-answer crawlers are allowed on all public pages, so posts can
 * appear in Google, Bing, ChatGPT search, Claude and Perplexity. The CMS and
 * API routes are kept out.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/studio', '/api/', '/resume/download', '/resume/success']

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      {
        // Named explicitly so the intent is clear to anyone reading the file
        userAgent: [
          'Googlebot',
          'Bingbot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'Claude-SearchBot',
          'Claude-User',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
        ],
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
