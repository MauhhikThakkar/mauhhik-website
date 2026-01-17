import { client } from '@/sanity/lib/client'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import PortfolioHeader from '@/components/portfolio/PortfolioHeader'
import PortfolioCard from '@/components/portfolio/PortfolioCard'

// Enhanced query for portfolio index page
const PORTFOLIO_INDEX_QUERY = `
  *[_type == "project"]
  | order(_createdAt desc) {
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
    }
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
}

async function getProjects(): Promise<PortfolioProject[]> {
  return await client.fetch(PORTFOLIO_INDEX_QUERY)
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
              {projects.map((project, index) => (
                <PortfolioCard
                  key={project._id}
                  project={project}
                  index={index}
                />
              ))}
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
