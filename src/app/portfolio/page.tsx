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

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <main className="bg-charcoal text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        <PortfolioHeader />

        {projects && projects.length > 0 ? (
          <div className="mt-16 sm:mt-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, index) => {
                const isRecommended = index === 0
                return (
                  <PortfolioCard
                    key={project._id}
                    project={project}
                    index={index}
                    isRecommended={isRecommended}
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
