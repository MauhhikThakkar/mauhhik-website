import Link from 'next/link'
import Image from 'next/image'

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
}

interface PortfolioCardProps {
  project: PortfolioProject
  index: number
  isRecommended?: boolean
}

/**
 * Extract one-line problem statement from project data
 */
function getProblemStatement(project: PortfolioProject): string | null {
  // Use shortDescription as problem statement if available
  if (project.shortDescription) {
    // Take first sentence or first ~100 chars
    const firstSentence = project.shortDescription.split('.')[0]
    if (firstSentence.length <= 120) {
      return firstSentence
    }
    // If first sentence is too long, truncate description
    return project.shortDescription.substring(0, 100).trim() + '...'
  }
  return null
}

/**
 * Extract credibility signal: intended impact, problem scale, or decision complexity
 */
function getCredibilitySignal(project: PortfolioProject): string | null {
  // Priority 1: Intended impact (most concrete)
  if (project.intendedImpact) {
    // Extract first sentence or key phrase
    const impact = project.intendedImpact.split('.')[0]
    if (impact.length <= 100) {
      return impact
    }
    return impact.substring(0, 90).trim() + '...'
  }
  
  // Priority 2: Trade-offs indicate decision complexity
  if (project.tradeoffs && project.tradeoffs.length > 0) {
    const tradeoffCount = project.tradeoffs.length
    if (tradeoffCount >= 3) {
      return `Evaluated ${tradeoffCount}+ critical trade-offs`
    } else if (tradeoffCount >= 2) {
      return `Evaluated multiple trade-offs`
    }
    return 'Evaluated key trade-offs'
  }
  
  // Priority 3: Key assumptions indicate problem complexity
  if (project.keyAssumptions && project.keyAssumptions.length > 0) {
    const assumptionCount = project.keyAssumptions.length
    if (assumptionCount >= 3) {
      return `Validated ${assumptionCount}+ key assumptions`
    }
    return 'Validated critical assumptions'
  }
  
  // Priority 4: What this demonstrates (if concise)
  if (project.whatThisDemonstrates) {
    const text = project.whatThisDemonstrates
    if (text.length <= 100) {
      return text
    }
    // Extract key phrase
    const firstSentence = text.split('.')[0]
    if (firstSentence.length <= 100) {
      return firstSentence
    }
  }
  
  return null
}

export default function PortfolioCard({ project, isRecommended }: PortfolioCardProps) {
  const problemStatement = getProblemStatement(project)
  const credibilitySignal = getCredibilitySignal(project)

  return (
    <div>
      <Link
        href={`/portfolio/${project.slug}`}
        className="group block h-full"
      >
        <article
          className={`h-full bg-zinc-950/30 border rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors ${
            isRecommended ? 'border-zinc-800' : 'border-zinc-900'
          }`}
        >
          {/* Cover Image */}
          {project.coverImage?.asset?.url && (
            <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-zinc-900">
              <Image
                src={project.coverImage.asset.url}
                alt={project.coverImage.alt || project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Recommended Badge */}
            {isRecommended && (
              <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                  Recommended starting point
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-white transition-colors">
              {project.title}
            </h2>

            {/* One-line Problem Statement */}
            {problemStatement && (
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {problemStatement}
              </p>
            )}

            {/* One Credibility Signal */}
            {credibilitySignal && (
              <div className="mb-6 pt-4 border-t border-zinc-900/50">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {credibilitySignal}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
              <span>Read Case Study</span>
              <svg
                className="w-4 h-4 ml-2"
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
          </div>
        </article>
      </Link>
    </div>
  )
}
