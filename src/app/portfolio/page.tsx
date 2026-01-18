import { client } from '@/sanity/lib/client'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import PortfolioHeader from '@/components/portfolio/PortfolioHeader'
import PortfolioCard from '@/components/portfolio/PortfolioCard'

// Enhanced query for portfolio index page
const PORTFOLIO_INDEX_QUERY = `
  *[_type == "project"] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
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
 */
function calculateSeniorityScore(project: PortfolioProject): number {
  let score = 0
  
  // Projects with judgment fields signal deeper thinking
  if (project.whatThisDemonstrates) score += 10
  if (project.intendedImpact) score += 8
  if (project.tradeoffs && project.tradeoffs.length > 0) score += 6
  if (project.keyAssumptions && project.keyAssumptions.length > 0) score += 4
  
  // Projects with impact metrics (if real, not deprecated)
  if (project.impact && project.impact.length > 0) score += 2
  
  // Categories can indicate domain complexity
  if (project.categories && project.categories.length > 0) {
    const categoryTitles = project.categories.map(c => c.title.toLowerCase())
    // Enterprise, AI, Fintech, SaaS signal higher complexity
    if (categoryTitles.some(c => c.includes('enterprise') || c.includes('ai') || c.includes('fintech'))) {
      score += 3
    }
  }
  
  return score
}

/**
 * Generate judgment hook - a concise line that signals PM thinking
 */
function getJudgmentHook(project: PortfolioProject): string | null {
  // Prefer whatThisDemonstrates as it's most direct
  if (project.whatThisDemonstrates) {
    // Extract first sentence or first ~80 chars
    const text = project.whatThisDemonstrates.trim()
    const firstSentence = text.split(/[.!?]/)[0]
    if (firstSentence.length <= 100) {
      return firstSentence
    }
    return text.substring(0, 97) + '...'
  }
  
  // Fallback to intendedImpact
  if (project.intendedImpact) {
    const text = project.intendedImpact.trim()
    const firstSentence = text.split(/[.!?]/)[0]
    if (firstSentence.length <= 100) {
      return firstSentence
    }
    return text.substring(0, 97) + '...'
  }
  
  // If we have tradeoffs, create a hook from the first one
  if (project.tradeoffs && project.tradeoffs.length > 0) {
    const firstTradeoff = project.tradeoffs[0]
    return `Trade-off: ${firstTradeoff.decision}`
  }
  
  return null
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

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <main className="bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <PortfolioHeader />

        {projects && projects.length > 0 ? (
          <div className="mt-16 sm:mt-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, index) => {
                const judgmentHook = getJudgmentHook(project)
                return (
                  <PortfolioCard
                    key={project._id}
                    project={project}
                    index={index}
                    judgmentHook={judgmentHook}
                  />
                )
              })}
            </div>
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
