import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { client } from "@/sanity/lib/client"
import { PROJECT_BY_SLUG_QUERY, PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries"
import PortableText from "@/components/PortableText"
import { urlFor } from "@/sanity/lib/image"

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
  categories?: Category[]
  context?: any
  problem?: any
  solution?: any
  strategy?: any
  learnings?: any
  goals?: Metric[]
  impact?: Metric[]
  wireframes?: Wireframe[]
  prototypeLink?: string
  relatedBlogs?: RelatedBlog[]
  previousProject?: NavProject
  nextProject?: NavProject
}

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const projects = await client.fetch(PROJECT_SLUGS_QUERY)
  return projects.map((project: { slug: string }) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: Props) {
  const project: Project | null = await client.fetch(PROJECT_BY_SLUG_QUERY, {
    slug: params.slug,
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
      {/* Hero Section */}
      <section className="border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          {/* Categories */}
          {project.categories && project.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.categories.map((category) => (
                <span
                  key={category.slug}
                  className="inline-flex items-center px-3 py-1.5 bg-zinc-900/50 text-zinc-400 rounded-full text-sm font-medium border border-zinc-800/50 backdrop-blur-sm"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
            {project.title}
          </h1>

          {/* Description */}
          {project.shortDescription && (
            <p className="text-xl sm:text-2xl text-zinc-300 leading-[1.6] max-w-3xl font-normal">
              {project.shortDescription}
            </p>
          )}
        </div>
      </section>

      {/* At a Glance Summary */}
      {((project.goals && project.goals.length > 0) || (project.impact && project.impact.length > 0)) && (
        <section className="border-b border-zinc-900/50">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-20">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-10">
              At a Glance
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Goals Summary */}
              {project.goals && project.goals.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-4">
                    Goals
                  </div>
                  <div className="space-y-4">
                    {project.goals.slice(0, 3).map((metric, index) => (
                      <div key={index} className="flex items-baseline gap-3">
                        <div className="flex-shrink-0 w-1 h-1 rounded-full bg-zinc-700 mt-2"></div>
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {metric.value}
                          </div>
                          <div className="text-sm text-zinc-400 leading-snug">
                            {metric.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact Summary */}
              {project.impact && project.impact.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-4">
                    Impact
                  </div>
                  <div className="space-y-4">
                    {project.impact.slice(0, 3).map((metric, index) => (
                      <div key={index} className="flex items-baseline gap-3">
                        <div className="flex-shrink-0 w-1 h-1 rounded-full bg-emerald-500/50 mt-2"></div>
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {metric.value}
                          </div>
                          <div className="text-sm text-zinc-400 leading-snug">
                            {metric.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Context */}
        {project.context && Array.isArray(project.context) && project.context.length > 0 && (
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
        {project.problem && Array.isArray(project.problem) && project.problem.length > 0 && (
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
        {project.strategy && Array.isArray(project.strategy) && project.strategy.length > 0 && (
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
        {project.solution && Array.isArray(project.solution) && project.solution.length > 0 && (
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

        {/* Impact */}
        {project.impact && project.impact.length > 0 && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                Measured outcomes
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {project.impact.map((metric, index) => (
                <div
                  key={index}
                  className="relative bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm min-h-[200px] flex flex-col justify-center"
                >
                  <div className="absolute -top-px -right-px w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-2xl blur-xl"></div>
                  <div className="relative">
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
                </div>
              ))}
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
                } catch (error) {
                  console.error("Failed to render wireframe:", error)
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

        {/* Learnings */}
        {project.learnings && Array.isArray(project.learnings) && project.learnings.length > 0 && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                {getSectionNumber()} — Learnings
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                What we learned
              </h2>
            </div>
            <div className="prose-custom text-zinc-300 text-lg leading-relaxed max-w-3xl">
              <PortableText value={project.learnings} />
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
