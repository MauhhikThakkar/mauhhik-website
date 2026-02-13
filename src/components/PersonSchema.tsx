import { SITE_URL } from '@/lib/constants'

/**
 * Person Schema Component
 * 
 * Server-rendered JSON-LD structured data for Person schema.
 * Provides rich snippets for search engines.
 */
export default function PersonSchema() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mauhhik Thakkar',
    jobTitle: 'Product Manager',
    url: SITE_URL,
    sameAs: [
      'https://www.linkedin.com/in/mauhhikthakkar/',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'India',
    },
    knowsAbout: [
      'Product Management',
      'Product Strategy',
      'AI Products',
      'SaaS',
      'FinTech',
      'Enterprise Software',
    ],
    description: 'Product Manager focused on clarity, judgment, and execution in complex, high-trust environments. Building products in FinTech, SaaS, and AI-native execution.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  )
}
