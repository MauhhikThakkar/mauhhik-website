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

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 md:py-32">
          {/* Categories */}
          {project.categories && project.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.categories.map((category) => (
                <span
                  key={category.slug}
                  className="inline-flex items-center px-3 py-1.5 bg-zinc-900/50 text-zinc-400 rounded-full text-xs font-medium border border-zinc-800/50 backdrop-blur-sm"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-[1.1] tracking-tight">
            {project.title}
          </h1>

          {/* Description */}
          {project.shortDescription && (
            <p className="text-xl sm:text-2xl text-zinc-400 leading-relaxed max-w-3xl">
              {project.shortDescription}
            </p>
          )}
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        {/* Context */}
        {project.context && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                01 — Context
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
        {project.problem && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                02 — Problem
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
                03 — Goals
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                Success metrics
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {project.goals.map((metric, index) => (
                <div
                  key={index}
                  className="relative bg-zinc-950/50 border border-zinc-900 rounded-2xl p-8 backdrop-blur-sm"
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
        {project.strategy && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                04 — Strategy
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
        {project.solution && (
          <section className="py-24 md:py-32 border-b border-zinc-900/50">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                05 — Solution
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
                06 — Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                Measured outcomes
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {project.impact.map((metric, index) => (
                <div
                  key={index}
                  className="relative bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm"
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
                07 — Wireframes
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                Featured designs
              </h2>
            </div>

            {/* Wireframes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {project.wireframes.map((wireframe, index) => {
                if (!wireframe.image?.asset) return null

                try {
                  const imageUrl = urlFor(wireframe.image)
                    .width(800)
                    .height(600)
                    .url()

                  return (
                    <div
                      key={index}
                      className="group relative bg-zinc-950/30 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-800 transition-all"
                    >
                      {/* Image */}
                      <div className="relative w-full aspect-[4/3] bg-zinc-950">
                        <Image
                          src={imageUrl}
                          alt={wireframe.image.alt || wireframe.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
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
        {project.learnings && (
          <section className="py-24 md:py-32">
            <div className="mb-16">
              <span className="inline-block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-6">
                08 — Learnings
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
