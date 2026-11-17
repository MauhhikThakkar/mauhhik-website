import { SITE_URL } from '@/lib/constants'

/** Stable identifier other structured data (blog posts) points to as the author */
export const PERSON_ID = `${SITE_URL}/#person`

/**
 * Person Schema Component
 *
 * Server-rendered JSON-LD describing Mauhhik for search engines and AI
 * assistants. Every value here must match the resume and LinkedIn exactly:
 * this is the record machines quote.
 */
export default function PersonSchema() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Mauhhik Thakkar',
    url: SITE_URL,
    image: `${SITE_URL}/images/mauhhik-thakkar.jpg`,
    jobTitle: 'FIN Infrastructure Project Manager',
    worksFor: {
      '@type': 'Organization',
      name: 'Waypoint Trading Solutions',
    },
    description:
      'Project manager with 9+ years of experience, including 4+ years managing IT delivery for global exchanges and fintech, moving into Product Manager and Technical Product Owner roles.',
    sameAs: [
      'https://www.linkedin.com/in/mauhhikthakkar/',
      'https://thepmtransition.substack.com',
      'https://github.com/MauhhikThakkar',
    ],
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    knowsAbout: [
      'Project management',
      'Product management',
      'Secure SD-WAN deployment',
      'Financial market infrastructure',
      'FinTech',
      'Data analytics',
      'AI products',
    ],
    hasCredential: [
      'ICPM Product Management Certification',
      'IBM AI Product Manager Professional Certificate',
      'Google Project Management Professional Certificate',
    ].map((name) => ({ '@type': 'EducationalOccupationalCredential', name })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  )
}
