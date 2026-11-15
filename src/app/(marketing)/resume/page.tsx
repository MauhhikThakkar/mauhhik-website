import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import ResumeDirectDownload from '@/components/ResumeDirectDownload'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'

export const metadata = generateSEOMetadata({
  title: 'Resume | Mauhhik',
  description: 'Resume of Mauhhik Thakkar: project manager with 9+ years of experience, moving into technical product roles.',
  url: '/resume',
  imageAlt: 'Mauhhik — Resume',
})

// Fetch featured case studies that demonstrate resume experience
const FEATURED_CASE_STUDIES_QUERY = `
  *[_type == "project" && (whatThisDemonstrates != null || intendedImpact != null)]
  | order(_createdAt desc)
  [0...3] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    "categories": categories[]->{ title }
  }
`

interface FeaturedCaseStudy {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  categories?: Array<{ title: string }>
}

async function getFeaturedCaseStudies(): Promise<FeaturedCaseStudy[]> {
  try {
    return await client.fetch(FEATURED_CASE_STUDIES_QUERY)
  } catch (error) {
    console.error('Error fetching featured case studies:', error)
    return []
  }
}

export default async function ResumePage() {
  const featuredCaseStudies = await getFeaturedCaseStudies()

  return (
    <main className="bg-charcoal text-white min-h-screen">
      <section className="relative overflow-hidden border-b border-line">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="site-container relative pb-16 pt-32 sm:pt-40 md:pb-20">
          <p className="eyebrow mb-5">Resume</p>
          <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Mauhhik Thakkar
          </h1>
          <p className="mt-4 text-lg text-zinc-200 sm:text-xl">
            Project Manager moving into Product Management
          </p>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-400">
            9+ years of experience, including 4+ years managing IT delivery for global exchanges and fintech.
            Open to Product Manager and Technical Product Owner roles in the UAE and Singapore.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ResumeDirectDownload />
            <a
              href="https://www.linkedin.com/in/mauhhikthakkar/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              LinkedIn
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-500">PDF. One click, no email or sign-up needed.</p>
        </div>
      </section>

      <div className="site-container py-16 md:py-20">
        {/* Related Case Studies Section */}
        {featuredCaseStudies && featuredCaseStudies.length > 0 && (
          <div>
            <div className="max-w-2xl">
              <p className="eyebrow mb-6">
                Concept case studies that show how I approach product decisions:
              </p>
              <div className="space-y-3">
                {featuredCaseStudies.map((caseStudy) => (
                  <Link
                    key={caseStudy._id}
                    href={`/portfolio/${caseStudy.slug}`}
                    className="block group p-4 card rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white group-hover:text-white mb-1">
                          {caseStudy.title}
                        </h3>
                        {caseStudy.shortDescription && (
                          <p className="text-xs text-zinc-500 line-clamp-1">
                            {caseStudy.shortDescription}
                          </p>
                        )}
                        {caseStudy.categories && caseStudy.categories.length > 0 && (
                          <p className="text-xs text-zinc-600 mt-1">
                            {caseStudy.categories.map(c => c.title).join(', ')}
                          </p>
                        )}
                      </div>
                      <svg
                        className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 mt-0.5 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/portfolio"
                  className="text-link text-sm"
                >
                  View all case studies
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
