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
import DecisionSnapshot from "@/components/portfolio/DecisionSnapshot"
import CollapsibleImprovements from "@/components/portfolio/CollapsibleImprovements"
import CaseStudyBottomBar from "@/components/portfolio/CaseStudyBottomBar"

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
  intendedImpact?: string
  successCriteria?: string[]
  keyAssumptions?: string[]
  tradeoffs?: Array<{
    decision: string
    tradeoff: string
  }>
  whatThisDemonstrates?: string
  featuredWireframes?: Wireframe[]
  prototypeLink?: string
  relatedBlogs?: RelatedBlog[]
  previousProject?: NavProject
  nextProject?: NavProject
  improvements?: {
    technicalIteration?: string
    gtmRefinement?: string
    metricsEvolution?: string
  }
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
    <main className="bg-charcoal text-white min-h-screen">
      {/* Case Study Intro Block */}
      <section className="border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          {/* Breadcrumb Navigation */}
          <PortfolioBreadcrumb caseStudyTitle={project.title} />

          {/* Domain Tag */}
          {project.categories && project.categories.length > 0 && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1.5 bg-zinc-900/50 text-zinc-400 rounded-full text-sm font-medium border border-zinc-800/50 backdrop-blur-sm">
                {project.categories[0].title}
              </span>
            </div>
          )}

          {/* Title with Descriptor */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 leading-[1.1] tracking-tight">
            {project.title}
          </h1>
          {project.shortDescription && (
            <p className="text-lg text-zinc-400 mb-6 leading-relaxed max-w-3xl">
              {project.shortDescription}
            </p>
          )}

          {/* Role & Context Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            <span className="text-sm text-zinc-400">Product Strategy & Execution</span>
            <span className="text-zinc-600">•</span>
            <span className="text-sm text-zinc-500">Certification Project</span>
          </div>

          {/* Intro Paragraph - using first part of context if available */}
          {isValidPortableText(project.context) && (
            <div className="mb-12 max-w-3xl">
              <PortableText value={project.context.slice(0, 1)} />
            </div>
          )}

          {/* Context Card / Summary Block */}
          <div className="mb-12 bg-charcoal-light/50 border border-zinc-900 rounded-xl p-6 max-w-3xl">
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
            <ul className="space-y-2 text-zinc-300 leading-relaxed list-none pl-0 mb-4">
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
            <p className="text-zinc-400 text-sm leading-relaxed">
              This work reflects my approach to product strategy and execution under constraints. 
              The methodology and frameworks applied here are detailed in my{' '}
              <Link
                href="/resume"
                className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                professional resume
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Decision Snapshot Section */}
      <DecisionSnapshot
        problemContext={isValidPortableText(project.problem) ? project.problem : undefined}
        keyConstraints={project.keyAssumptions}
        strategicTradeoffs={project.tradeoffs}
        successMetrics={project.goals}
        outcome={project.intendedImpact}
        successCriteria={project.successCriteria}
      />

      {/* Resume Context Block */}
      <section className="border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8">
          <div className="bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 max-w-3xl">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Professional Context
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
              This case study demonstrates product strategy, hypothesis-driven discovery, and execution under constraints. 
              The frameworks and decision-making processes shown here reflect the experience outlined in my professional resume.
            </p>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <span>View professional resume</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Context */}
        {isValidPortableText(project.context) && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Context
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-3">
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
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Problem
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-3">
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
                  className="relative bg-charcoal-light/50 border border-zinc-900 rounded-2xl p-8 backdrop-blur-sm min-h-[200px] flex flex-col justify-center"
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
                Solution Design & Key Trade-offs
              </h2>
            </div>
            <div className="prose-custom text-zinc-300 text-lg leading-relaxed max-w-3xl">
              <PortableText value={project.solution} />
            </div>
          </section>
        )}

        {/* Featured Wireframes */}
        {((project.wireframes && project.wireframes.length > 0) || (project.featuredWireframes && project.featuredWireframes.length > 0)) && (
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
            {(() => {
              const wireframesToRender = project.wireframes || project.featuredWireframes || []
              return (
                <div className={`grid gap-8 mb-12 ${
                  wireframesToRender.length === 1 
                    ? 'grid-cols-1 max-w-2xl mx-auto' 
                    : 'grid-cols-1 md:grid-cols-2'
                }`}>
                  {wireframesToRender.map((wireframe, index) => {
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
                          className="group relative bg-charcoal-light/30 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-800 transition-all"
                        >
                          {/* Image - Full mobile screen visible */}
                          <div className="relative w-full bg-charcoal-light flex items-center justify-center p-8 min-h-[400px]">
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
              )
            })()}

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

        {/* Product Judgment Section */}
        {(project.intendedImpact || project.successCriteria || project.keyAssumptions || (project.tradeoffs && project.tradeoffs.length > 0) || project.whatThisDemonstrates) && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Product Judgment
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-4">
                Product Judgment
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">
                Design intent, evaluation criteria, and decision-making rationale
              </p>
            </div>

            <div className="space-y-6 max-w-4xl">
              {/* Intended Impact Card */}
              {project.intendedImpact && (
                <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-8 hover:border-zinc-800/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-800/50">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">Intended Impact</h3>
                      <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                        {project.intendedImpact}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Criteria Card */}
              {project.successCriteria && project.successCriteria.length > 0 && (
                <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-8 hover:border-zinc-800/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-800/50">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Success Criteria (If Shipped)</h3>
                      <ul className="space-y-2.5">
                        {project.successCriteria.map((criterion, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                            <span className="text-zinc-300 leading-relaxed">{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Assumptions Card */}
              {project.keyAssumptions && project.keyAssumptions.length > 0 && (
                <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-8 hover:border-zinc-800/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-800/50">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Key Assumptions</h3>
                      <ul className="space-y-2.5">
                        {project.keyAssumptions.map((assumption, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                            <span className="text-zinc-300 leading-relaxed">{assumption}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Trade-offs Card */}
              {project.tradeoffs && project.tradeoffs.length > 0 && (
                <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-8 hover:border-zinc-800/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-800/50">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Trade-offs Considered</h3>
                      <div className="space-y-4">
                        {project.tradeoffs.map((tradeoff, index) => (
                          <div key={index} className="border-l-2 border-zinc-800/80 pl-4 py-2">
                            <div className="font-medium text-white mb-1.5">{tradeoff.decision}</div>
                            <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{tradeoff.tradeoff}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* What This Demonstrates Card */}
              {project.whatThisDemonstrates && (
                <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-8 hover:border-zinc-800/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-800/50">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">What This Case Study Demonstrates</h3>
                      <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                        {project.whatThisDemonstrates}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Learnings */}
              {isValidPortableText(project.learnings) && (
                <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-8 hover:border-zinc-800/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-800/50">
                      <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">Key Learnings</h3>
                      <div className="prose-custom text-zinc-300 leading-relaxed">
                        <PortableText value={project.learnings} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PM Skills Demonstrated */}
              <div className="bg-charcoal-light/50 border border-zinc-900/80 rounded-xl p-8 hover:border-zinc-800/80 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-800/50">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">PM Skills Demonstrated</h3>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                        <span className="text-zinc-300 leading-relaxed">Problem framing under ambiguity</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                        <span className="text-zinc-300 leading-relaxed">Hypothesis-driven discovery and validation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                        <span className="text-zinc-300 leading-relaxed">Tradeoff evaluation across user needs, business goals, and technical constraints</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                        <span className="text-zinc-300 leading-relaxed">Stakeholder alignment and communication</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                        <span className="text-zinc-300 leading-relaxed">Prioritization under resource and timeline constraints</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-500 mt-2"></span>
                        <span className="text-zinc-300 leading-relaxed">Decision-making with incomplete information</span>
                      </li>
                    </ul>
                  </div>
                </div>
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
                  className="group block p-6 bg-charcoal-light/30 border border-zinc-900 rounded-xl hover:border-zinc-800 hover:bg-charcoal-light/50 transition-all duration-200"
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

        {/* What I Would Improve Today - Collapsible Section */}
        <CollapsibleImprovements improvements={project.improvements} />
      </div>

      {/* Resume CTA Section */}
      <section className="border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-zinc-500 text-sm mb-6">
              This case study demonstrates product thinking and execution that aligns with my professional experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                href="/resume"
                className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Resume
              </Link>
              <Link
                href="/portfolio"
                className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
              >
                View Other Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      {(project.previousProject || project.nextProject) && (
        <div className="border-t border-zinc-900">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Previous */}
              {project.previousProject ? (
                <Link
                  href={`/portfolio/${project.previousProject.slug}`}
                  className="group flex flex-col justify-between bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all"
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
                  className="group flex flex-col justify-between bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all text-right"
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

      {/* Bottom Spacing for Mobile Bottom Bar */}
      <div className="h-32 md:h-0"></div>
      
      {/* Mobile Bottom Action Bar */}
      <CaseStudyBottomBar />
    </main>
  )
}
