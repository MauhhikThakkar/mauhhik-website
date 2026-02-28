import { Suspense } from 'react'
import { client } from '@/sanity/lib/client'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { getProjectFilterCategory } from '@/lib/portfolioCategories'
import type { FilterCategory } from '@/lib/portfolioCategories'
import PortfolioHeader from '@/components/portfolio/PortfolioHeader'
import PortfolioFilterableGrid from '@/components/portfolio/PortfolioFilterableGrid'

// Enhanced query for portfolio index page
const PORTFOLIO_INDEX_QUERY = `
  *[_type == "project"] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    featured,
    prototypeLink,
    coverImage {
      alt,
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    },
    impact[] {
      label,
      value,
      context
    },
    "categories": categories[]->{ 
      title, 
      "slug": slug.current 
    },
    intendedImpact,
    whatThisDemonstrates,
    keyAssumptions,
    tradeoffs,
    _createdAt
  }
`

interface ImpactMetric {
  label: string
  value: string
  context?: string
}

interface Category {
  title: string
  slug: string
}

interface PortfolioProject {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  featured?: boolean
  prototypeLink?: string
  coverImage?: {
    alt?: string
    asset?: {
      _id: string
      url: string
      metadata?: {
        dimensions?: {
          width: number
          height: number
        }
      }
    }
  }
  impact?: ImpactMetric[]
  categories?: Category[]
  intendedImpact?: string
  whatThisDemonstrates?: string
  keyAssumptions?: string[]
  tradeoffs?: Array<{ decision: string; tradeoff: string }>
  _createdAt?: string
}

/**
 * Calculate seniority signal score for ordering
 * Higher score = stronger seniority signal
 * Prioritizes projects with clear judgment signals and complexity indicators
 */
function calculateSeniorityScore(project: PortfolioProject): number {
  let score = 0
  
  // Intended impact signals concrete problem framing (highest weight)
  if (project.intendedImpact) {
    score += 12
    // Longer intended impact suggests more thorough thinking
    if (project.intendedImpact.length > 100) score += 2
  }
  
  // Trade-offs indicate decision complexity (high weight)
  if (project.tradeoffs && project.tradeoffs.length > 0) {
    score += 8
    // More trade-offs = more complex decisions
    if (project.tradeoffs.length >= 3) score += 3
    else if (project.tradeoffs.length >= 2) score += 1
  }
  
  // What this demonstrates signals reflection and judgment
  if (project.whatThisDemonstrates) {
    score += 6
  }
  
  // Key assumptions indicate problem complexity
  if (project.keyAssumptions && project.keyAssumptions.length > 0) {
    score += 4
    // More assumptions = more complex problem space
    if (project.keyAssumptions.length >= 3) score += 2
  }
  
  // Categories indicate domain complexity
  if (project.categories && project.categories.length > 0) {
    const categoryTitles = project.categories.map(c => c.title.toLowerCase())
    // High-complexity domains
    if (categoryTitles.some(c => c.includes('enterprise') || c.includes('fintech'))) {
      score += 5
    } else if (categoryTitles.some(c => c.includes('ai') || c.includes('saas'))) {
      score += 3
    }
  }
  
  // Short description quality (indicates clear problem framing)
  if (project.shortDescription) {
    if (project.shortDescription.length > 80) score += 1
  }
  
  return score
}

async function getProjects(): Promise<PortfolioProject[]> {
  const projects: PortfolioProject[] = await client.fetch(PORTFOLIO_INDEX_QUERY)
  
  // Sort by seniority score (descending), then by creation date (descending)
  return projects.sort((a: PortfolioProject, b: PortfolioProject) => {
    const scoreA = calculateSeniorityScore(a)
    const scoreB = calculateSeniorityScore(b)
    
    if (scoreB !== scoreA) {
      return scoreB - scoreA // Higher score first
    }
    
    // Tie-breaker: most recent first
    const dateA = a._createdAt ? new Date(a._createdAt).getTime() : 0
    const dateB = b._createdAt ? new Date(b._createdAt).getTime() : 0
    return dateB - dateA
  })
}

export const metadata = generateSEOMetadata({
  title: 'Product Case Studies | Mauhhik',
  description: 'Selected product case studies showcasing product thinking, execution, and real-world delivery. From AI-first products to SaaS MVPs.',
  url: '/portfolio',
  imageAlt: 'Mauhhik — Product Case Studies',
})

const FEATURED_ITEMS = [
  {
    id: 'founder-os',
    title: 'Founder OS',
    positioning: 'AI-powered operating system for founders. Streamlines decision-making, prioritization, and execution across product, growth, and operations.',
    caseStudySlug: 'founder-os',
    prototypeLink: 'https://founder-os-hub.lovable.app',
    filterCategory: 'AI Strategy' as const,
  },
  {
    id: 'triage-genius',
    title: 'Triage Genius',
    positioning: 'Enterprise AI support triage system. Automates ticket routing with high accuracy, reducing response time and improving customer satisfaction.',
    caseStudySlug: 'ai-enterprise-support-triage',
    prototypeLink: 'https://triage-genius-hub.lovable.app',
    filterCategory: 'Enterprise AI' as const,
  },
]

/** Slugs used by hardcoded flagship cards — exclude these from the general grid to avoid duplicates */
const FEATURED_CASE_STUDY_SLUGS = new Set(
  FEATURED_ITEMS.map((item) => item.caseStudySlug)
)

const DEFAULT_FILTER_CATEGORY: FilterCategory = 'AI Strategy'

/** Convert a flagship Sanity project into FeaturedItem shape for the grid */
function toFeaturedItem(project: PortfolioProject): {
  id: string
  title: string
  positioning: string
  caseStudySlug: string
  prototypeLink: string
  filterCategory: FilterCategory
} {
  const filterCategory =
    getProjectFilterCategory(project.slug, project.title, project.categories) ??
    DEFAULT_FILTER_CATEGORY
  return {
    id: project._id,
    title: project.title,
    positioning: project.shortDescription ?? '',
    caseStudySlug: project.slug,
    prototypeLink: project.prototypeLink ?? '',
    filterCategory,
  }
}

export default async function PortfolioPage() {
  const projects = await getProjects()

  const flagshipProjects = projects.filter(
    (p): p is PortfolioProject => p.featured === true
  )
  // Exclude flagship projects AND any project whose slug is already shown as a hardcoded flagship card
  const regularProjects = projects.filter(
    (p): p is PortfolioProject =>
      !p.featured && !FEATURED_CASE_STUDY_SLUGS.has(p.slug)
  )

  const featuredItems = [
    ...FEATURED_ITEMS,
    ...flagshipProjects.map(toFeaturedItem),
  ]

  const hasContent = featuredItems.length > 0 || regularProjects.length > 0

  return (
    <main className="bg-charcoal text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <PortfolioHeader />

        {hasContent ? (
          <div className="mt-16 sm:mt-20">
            <section>
              <div className="mb-8 sm:mb-10">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
                  Case Studies
                </h2>
                <p className="text-base sm:text-lg text-zinc-400 max-w-2xl">
                  Product case studies across AI, FinTech, and enterprise — filter by category.
                </p>
              </div>

              <Suspense fallback={
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="h-64 bg-charcoal-light/30 border rounded-2xl border-zinc-900 animate-pulse" />
                  <div className="h-64 bg-charcoal-light/30 border rounded-2xl border-zinc-900 animate-pulse" />
                </div>
              }>
                <PortfolioFilterableGrid
                  featuredItems={featuredItems}
                  projects={regularProjects}
                />
              </Suspense>
            </section>
          </div>
        ) : (
          <div className="mt-16 text-center py-20">
            <p className="text-zinc-500 text-lg mb-4">No case studies found.</p>
            <p className="text-zinc-600 text-sm">
              Case studies will appear here once they&apos;re added to the CMS.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
