import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import ResumeRequestForm from '@/components/ResumeRequestForm'
import { Suspense } from 'react'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'

export const metadata = generateSEOMetadata({
  title: 'Resume | Mauhhik',
  description: 'Product Manager with hands-on experience in AI tools, Excel automation, SaaS MVPs, and real-world delivery.',
  url: '/resume',
  imageAlt: 'Mauhhik — Resume',
})

function DownloadSuccessMessage() {
  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-2xl p-6 text-center">
        <div className="flex justify-center mb-4" aria-hidden="true">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <p className="text-emerald-400 text-sm">
          Resume downloaded successfully!
        </p>
      </div>
    </div>
  )
}

async function DownloadSuccessMessageWrapper({
  searchParams,
}: {
  searchParams: Promise<{ downloaded?: string }>
}) {
  const params = await searchParams
  if (params.downloaded === 'true') {
    return <DownloadSuccessMessage />
  }
  return null
}

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

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ downloaded?: string }>
}) {
  const featuredCaseStudies = await getFeaturedCaseStudies()

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            Request Resume Access
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-4">
            My resume is available to verified professionals. This controlled access ensures I can track who views my credentials and maintain professional discretion.
          </p>
          <p className="text-base text-zinc-500 leading-relaxed max-w-xl mx-auto">
            Enter your email to receive a secure, time-limited download link.
          </p>
        </div>
        
        <Suspense fallback={null}>
          <DownloadSuccessMessageWrapper searchParams={searchParams} />
        </Suspense>
        
        <ResumeRequestForm />

        {/* Related Case Studies Section */}
        {featuredCaseStudies && featuredCaseStudies.length > 0 && (
          <div className="mt-16 pt-16 border-t border-zinc-900/50">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-zinc-500 mb-6 text-center">
                Detailed case studies that demonstrate the experience outlined in my resume:
              </p>
              <div className="space-y-3">
                {featuredCaseStudies.map((caseStudy) => (
                  <Link
                    key={caseStudy._id}
                    href={`/portfolio/${caseStudy.slug}`}
                    className="block group p-4 bg-zinc-950/30 border border-zinc-900/50 rounded-lg hover:border-zinc-800/50 transition-colors"
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
              <div className="mt-6 text-center">
                <Link
                  href="/portfolio"
                  className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors underline underline-offset-4"
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
