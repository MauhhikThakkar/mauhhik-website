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
    <main className="bg-charcoal text-white min-h-screen print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-20">
        {/* Above-the-fold: Role positioning and context */}
        <div className="mb-12 print:mb-8">
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight print:text-2xl">
              Mauhik Thakkar
            </h1>
            <p className="text-lg sm:text-xl text-zinc-300 mb-2 print:text-base print:text-gray-800">
              Product Manager
            </p>
            <p className="text-sm sm:text-base text-zinc-500 leading-relaxed max-w-2xl mx-auto print:text-sm print:text-gray-600">
              Focused on clarity, judgment, and execution in complex, high-trust environments. 
              AI, fintech, and enterprise platforms.
            </p>
          </div>

          {/* Subtle CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 print:hidden">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-charcoal"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Case Studies
            </Link>
            <a
              href="https://www.linkedin.com/in/mauhhikthakkar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-white hover:bg-zinc-800 hover:border-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-charcoal"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Resume Request Section */}
        <div className="mb-12 print:hidden">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              Request Resume Access
            </h2>
            <p className="text-base text-zinc-400 leading-relaxed max-w-xl mx-auto mb-2">
              My resume is available to verified professionals. Enter your email to receive a secure download link.
            </p>
            <p className="text-sm text-zinc-500 max-w-xl mx-auto">
              Secure download link valid for 6 hours. Up to 3 downloads per request.
            </p>
          </div>
          
          <Suspense fallback={null}>
            <DownloadSuccessMessageWrapper searchParams={searchParams} />
          </Suspense>
          
          <ResumeRequestForm />
        </div>

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
                    className="block group p-4 bg-charcoal-light/30 border border-zinc-900/50 rounded-lg hover:border-zinc-800/50 transition-colors"
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
