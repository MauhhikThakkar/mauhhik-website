import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import { PROJECT_BY_SLUG_QUERY, PROJECT_SLUGS_QUERY, PROJECT_METADATA_QUERY } from "@/sanity/lib/queries"
import PortableText from "@/components/PortableText"
import { urlFor } from "@/sanity/lib/image"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import PortfolioBreadcrumb from "@/components/portfolio/PortfolioBreadcrumb"

// Type guard to check if value is a valid Portable Text array
function isValidPortableText(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

interface Metric {
  label: string
  value: string
  context?: string
}

interface Category {
  title: string
  slug: string
}

interface NavProject {
  title: string
  slug: string
}

interface WireframeImage {
  asset: {
    _id: string
    url: string
  }
  alt?: string
}

interface Wireframe {
  title: string
  caption?: string
  image: WireframeImage
}

interface RelatedBlog {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  readingTime?: number
  publishedAt?: string
  category?: {
    title: string
    slug: string
    color?: string
  }
}

interface Project {
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
  categories?: Category[]
  context?: unknown
  problem?: unknown
  solution?: unknown
  strategy?: unknown
  learnings?: unknown
  goals?: Metric[]
  impact?: Metric[]
  wireframes?: Wireframe[]
  prototypeLink?: string
  relatedBlogs?: RelatedBlog[]
  previousProject?: NavProject
  nextProject?: NavProject
}

export async function generateStaticParams() {
  const projects = await client.fetch(PROJECT_SLUGS_QUERY)
  return projects.map((project: { slug: string }) => ({
    slug: project.slug,
  }))
}

// ISR: Revalidate portfolio case studies every 24 hours
// Case studies are more stable content that changes infrequently (updates, new metrics)
// 24 hours provides good balance between freshness and performance
export const revalidate = 86400

// Generate metadata for portfolio case study pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await client.fetch<Project | null>(PROJECT_METADATA_QUERY, {
    slug,
  })

  // If project doesn't exist, return default metadata
  // Next.js will handle 404 via notFound() in the page component
  if (!project) {
    return generateSEOMetadata({
      title: 'Portfolio Case Study',
      description: 'A detailed case study of a product project.',
      url: `/portfolio/${slug}`,
    })
  }

  // Build OpenGraph image URL from cover image or default
  const ogImage = project.coverImage?.asset
    ? urlFor(project.coverImage).width(1200).height(630).fit('max').url()
    : undefined // Will use default from generateSEOMetadata

  return generateSEOMetadata({
    title: `${project.title} | Portfolio`,
    description: project.shortDescription || `A case study of ${project.title} — exploring the problem, solution, and impact.`,
    image: ogImage,
    imageAlt: project.coverImage?.alt || project.title,
    url: `/portfolio/${project.slug}`,
    type: 'website',
  })
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project: Project | null = await client.fetch(PROJECT_BY_SLUG_QUERY, {
    slug,
  })

  if (!project) {
    notFound()
  }

  // Calculate section numbers dynamically
  let sectionNumber = 0
  const getSectionNumber = () => {
    sectionNumber++
    return String(sectionNumber).padStart(2, '0')
  }

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Case Study Intro Block */}
      <section className="border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          {/* Breadcrumb Navigation */}
          <PortfolioBreadcrumb caseStudyTitle={project.title} />

          {/* Title with Descriptor */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 leading-[1.1] tracking-tight">
            {project.title}
          </h1>
          {project.shortDescription && (
            <p className="text-lg text-zinc-400 mb-12 leading-relaxed max-w-3xl">
              {project.shortDescription}
            </p>
          )}

          {/* Intro Paragraph - using first part of context if available */}
          {isValidPortableText(project.context) && (
            <div className="mb-12 max-w-3xl">
              <PortableText value={project.context.slice(0, 1)} />
            </div>
          )}

          {/* Context Card / Summary Block */}
          <div className="mb-12 bg-zinc-950/50 border border-zinc-900 rounded-xl p-6 max-w-3xl">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {project.categories && project.categories.length > 0 && (
                <div>
                  <dt className="text-zinc-500 mb-1 font-medium">Domain:</dt>
                  <dd className="text-white">{project.categories.map(c => c.title).join(', ')}</dd>
                </div>
              )}
              <div>
                <dt className="text-zinc-500 mb-1 font-medium">My Role:</dt>
                <dd className="text-white">Product Manager</dd>
              </div>
              {project.goals && project.goals.length > 0 && (
                <div>
                  <dt className="text-zinc-500 mb-1 font-medium">Primary Goal:</dt>
                  <dd className="text-white">{project.goals[0].label}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Problem Statement */}
          {isValidPortableText(project.problem) && (
            <div className="mb-12 max-w-3xl">
              <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">Problem Statement</h2>
              <div className="text-zinc-300 leading-relaxed">
                <PortableText value={project.problem.slice(0, 1)} />
              </div>
            </div>
          )}

          {/* What I Was Responsible For */}
          <div className="mb-8 max-w-3xl">
            <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">What I Was Responsible For</h2>
            <ul className="space-y-2 text-zinc-300 leading-relaxed list-none pl-0">
              <li className="flex items-start gap-3">
                <span className="text-zinc-600 mt-1">•</span>
                <span>Discovery and user research</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-600 mt-1">•</span>
                <span>Product strategy and prioritization</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-600 mt-1">•</span>
                <span>Validation and hypothesis testing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-600 mt-1">•</span>
                <span>Delivery planning and execution</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Context */}
        {isValidPortableText(project.context) && (
          <section className="py-20 md:py-28 border-b border-zinc-900/50">
            <div className="mb-14">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5">
                {getSectionNumber()} — Context
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                Setting the stage
              </h2>
            </div>
            <div className="prose-custom text-zinc-300 text-lg leading-relaxed max-w-3xl">
              <PortableText value={project.context} />
            </div>
          </section>
        )}

        {/* Problem */}
        {isValidPortableText(project.problem) && (
          <section className="py-20 md:py-28 border-b border-zinc-900/50">
            <div className="mb-14">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5">
                {getSectionNumber()} — Problem
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                The challenge we faced
              </h2>
            </div>
            <div className="prose-custom text-zinc-300 text-lg leading-relaxed max-w-3xl">
              <PortableText value={project.problem} />
            </div>
          </section>
        )}

        {/* Goals */}
        {project.goals && project.goals.length > 0 && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Goals
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                Success metrics
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {project.goals.map((metric, index) => (
                <div
                  key={index}
                  className="relative bg-zinc-950/50 border border-zinc-900 rounded-2xl p-8 backdrop-blur-sm min-h-[200px] flex flex-col justify-center"
                >
                  <div className="text-5xl font-bold text-white mb-4 tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-base text-zinc-300 font-medium mb-2">
                    {metric.label}
                  </div>
                  {metric.context && (
                    <div className="text-sm text-zinc-500 leading-relaxed">
                      {metric.context}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Strategy */}
        {isValidPortableText(project.strategy) && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Strategy
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                Our approach
              </h2>
            </div>
            <div className="prose-custom text-zinc-300 text-lg leading-relaxed max-w-3xl">
              <PortableText value={project.strategy} />
            </div>
          </section>
        )}

        {/* Solution */}
        {isValidPortableText(project.solution) && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Solution
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                What we built
              </h2>
            </div>
            <div className="prose-custom text-zinc-300 text-lg leading-relaxed max-w-3xl">
              <PortableText value={project.solution} />
            </div>
          </section>
        )}

        {/* Featured Wireframes */}
        {project.wireframes && project.wireframes.length > 0 && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Wireframes
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                Featured designs
              </h2>
            </div>

            {/* Wireframes Grid */}
            <div className={`grid gap-8 mb-12 ${
              project.wireframes.length === 1 
                ? 'grid-cols-1 max-w-2xl mx-auto' 
                : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {project.wireframes.map((wireframe, index) => {
                if (!wireframe.image?.asset) return null

                try {
                  // Get full image without cropping - only set max width
                  const imageUrl = urlFor(wireframe.image)
                    .width(800)
                    .fit('max')
                    .url()

                  return (
                    <div
                      key={index}
                      className="group relative bg-zinc-950/30 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-800 transition-all"
                    >
                      {/* Image - Full mobile screen visible */}
                      <div className="relative w-full bg-zinc-950 flex items-center justify-center p-8 min-h-[400px]">
                        <div className="relative w-full max-w-sm mx-auto h-full">
                          <Image
                            src={imageUrl}
                            alt={wireframe.image.alt || wireframe.title}
                            width={800}
                            height={1200}
                            className="object-contain w-full h-auto max-h-[600px]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {wireframe.title}
                        </h3>
                        {wireframe.caption && (
                          <p className="text-sm text-zinc-400 leading-relaxed">
                            {wireframe.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                } catch {
                  // Silently fail wireframe rendering - return null to skip broken wireframes
                  return null
                }
              })}
            </div>

            {/* Prototype Link CTA */}
            {project.prototypeLink && (
              <div className="flex justify-center">
                <a
                  href={project.prototypeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-medium rounded-lg border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <span>View Interactive Prototype</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </section>
        )}

        {/* Outcomes & Learnings */}
        {(isValidPortableText(project.learnings) || (project.impact && project.impact.length > 0)) && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Outcomes & Learnings
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-12">
                Outcomes & Learnings
              </h2>
            </div>

            <div className="space-y-16 max-w-3xl">
              {/* Outcomes */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6 tracking-tight">Outcomes</h3>
                {isValidPortableText(project.learnings) ? (
                  <div className="prose-custom text-zinc-300 leading-relaxed">
                    <PortableText value={project.learnings} />
                  </div>
                ) : (
                  <ul className="space-y-3 text-zinc-300 leading-relaxed list-none pl-0">
                    {project.impact && project.impact.length > 0 ? (
                      project.impact.map((metric, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-zinc-600 mt-1">•</span>
                          <span>{metric.label}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-3">
                          <span className="text-zinc-600 mt-1">•</span>
                          <span>Clarified product direction and user needs</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-zinc-600 mt-1">•</span>
                          <span>Validated core assumptions through discovery</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-zinc-600 mt-1">•</span>
                          <span>De-risked technical and product uncertainty</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-zinc-600 mt-1">•</span>
                          <span>Informed prioritization and tradeoff decisions</span>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </div>

              {/* Key Learnings */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6 tracking-tight">Key Learnings</h3>
                <ul className="space-y-3 text-zinc-300 leading-relaxed list-none pl-0">
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>I underestimated the importance of early stakeholder alignment on constraints</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>I over-indexed on initial assumptions and changed approach once real user feedback emerged</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>Discovery revealed user needs differed from initial problem framing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>This reinforced my belief that validation before execution reduces downstream rework</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>Product thinking evolved from feature-focused to outcome-focused problem solving</span>
                  </li>
                </ul>
              </div>

              {/* PM Skills Demonstrated */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6 tracking-tight">PM Skills Demonstrated</h3>
                <ul className="space-y-3 text-zinc-300 leading-relaxed list-none pl-0">
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>Problem framing under ambiguity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>Hypothesis-driven discovery and validation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>Tradeoff evaluation across user needs, business goals, and technical constraints</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>Stakeholder alignment and communication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>Prioritization under resource and timeline constraints</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-zinc-600 mt-1">•</span>
                    <span>Decision-making with incomplete information</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Related Blog Posts */}
        {project.relatedBlogs && project.relatedBlogs.length > 0 && (
          <section className="py-24 md:py-32">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 leading-tight">
                How this thinking shows up in practice
              </h2>
              <p className="text-base text-zinc-400 leading-relaxed max-w-2xl">
                Related writing that explores the frameworks, concepts, or approaches applied in this case study.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.relatedBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  className="group block p-6 bg-zinc-950/30 border border-zinc-900 rounded-xl hover:border-zinc-800 hover:bg-zinc-950/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    {blog.category && (
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
                        style={{
                          backgroundColor: blog.category.color ? blog.category.color + '20' : '#27272a',
                          color: blog.category.color || '#a1a1aa',
                          borderWidth: '1px',
                          borderColor: blog.category.color ? blog.category.color + '40' : '#3f3f46',
                        }}
                      >
                        {blog.category.title}
                      </span>
                    )}
                    {blog.readingTime && (
                      <span className="text-xs text-zinc-500 flex-shrink-0">
                        {blog.readingTime} min
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-zinc-100 transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  {blog.shortDescription && (
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-3">
                      {blog.shortDescription}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    <span>Read article</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Navigation */}
      {(project.previousProject || project.nextProject) && (
        <div className="border-t border-zinc-900">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Previous */}
              {project.previousProject ? (
                <Link
                  href={`/portfolio/${project.previousProject.slug}`}
                  className="group flex flex-col justify-between bg-zinc-950/30 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all"
                >
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    ← Previous
                  </span>
                  <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {project.previousProject.title}
                  </span>
                </Link>
              ) : (
                <div></div>
              )}

              {/* Next */}
              {project.nextProject && (
                <Link
                  href={`/portfolio/${project.nextProject.slug}`}
                  className="group flex flex-col justify-between bg-zinc-950/30 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all text-right"
                >
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                    Next →
                  </span>
                  <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {project.nextProject.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Spacing */}
      <div className="h-32"></div>
    </main>
  )
}
