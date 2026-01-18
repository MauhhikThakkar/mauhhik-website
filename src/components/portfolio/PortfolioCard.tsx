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
  judgmentSignal?: string | null
  isRecommended?: boolean
}

export default function PortfolioCard({ project, judgmentSignal, isRecommended }: PortfolioCardProps) {
  // Get primary impact metric (first one, or most relevant)
  const primaryImpact = project.impact?.[0]

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

            {/* Domain / Category */}
            {project.categories && project.categories.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {project.categories[0].title}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-white transition-colors">
              {project.title}
            </h2>

            {/* Judgment Signal */}
            {judgmentSignal && (
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {judgmentSignal}
              </p>
            )}

            {/* Description */}
            {project.shortDescription && (
              <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
                {project.shortDescription}
              </p>
            )}

            {/* Impact Metric - Visually Secondary */}
            {primaryImpact && (
              <div className="mb-6 pt-4 border-t border-zinc-900/50">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-medium text-zinc-500">
                    {primaryImpact.value}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {primaryImpact.label}
                  </span>
                </div>
                {primaryImpact.context && (
                  <p className="text-xs text-zinc-700 mt-1">
                    {primaryImpact.context}
                  </p>
                )}
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
