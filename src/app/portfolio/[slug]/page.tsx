import { notFound } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { PROJECT_BY_SLUG_QUERY, PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries"
import PortableText from "@/components/PortableText"

interface Metric {
  label: string
  value: string
  context?: string
}

interface Category {
  title: string
  slug: string
}

interface ProjectNav {
  title: string
  slug: string
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
  previousProject?: ProjectNav
  nextProject?: ProjectNav
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
      <section className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl">
            {/* Categories */}
            {project.categories && project.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.categories.map((category) => (
                  <span
                    key={category.slug}
                    className="px-3 py-1.5 bg-zinc-900 text-zinc-300 rounded-md text-sm font-medium border border-zinc-800 hover:border-zinc-700 transition"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {project.title}
            </h1>

            {/* Description */}
            {project.shortDescription && (
              <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed">
                {project.shortDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-6">
        {/* Context */}
        {project.context && (
          <section className="py-16 md:py-20 border-b border-zinc-800/50">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                  Context
                </h2>
              </div>
              <div className="prose-custom">
                <PortableText value={project.context} />
              </div>
            </div>
          </section>
        )}

        {/* Problem */}
        {project.problem && (
          <section className="py-16 md:py-20 border-b border-zinc-800/50">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-orange-500 to-transparent"></div>
                <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wider">
                  The Problem
                </h2>
              </div>
              <div className="prose-custom">
                <PortableText value={project.problem} />
              </div>
            </div>
          </section>
        )}

        {/* Goals */}
        {project.goals && project.goals.length > 0 && (
          <section className="py-16 md:py-20 border-b border-zinc-800/50">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-purple-500 to-transparent"></div>
                <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                  Goals & Success Metrics
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.goals.map((metric, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent rounded-2xl transition-all duration-300"></div>
                    <div className="relative">
                      <div className="text-4xl md:text-5xl font-bold text-white mb-3">
                        {metric.value}
                      </div>
                      <div className="text-zinc-300 font-medium text-lg mb-2">
                        {metric.label}
                      </div>
                      {metric.context && (
                        <div className="text-sm text-zinc-500">{metric.context}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Strategy */}
        {project.strategy && (
          <section className="py-16 md:py-20 border-b border-zinc-800/50">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
                <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
                  Strategy & Decisions
                </h2>
              </div>
              <div className="prose-custom">
                <PortableText value={project.strategy} />
              </div>
            </div>
          </section>
        )}

        {/* Solution */}
        {project.solution && (
          <section className="py-16 md:py-20 border-b border-zinc-800/50">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-emerald-500 to-transparent"></div>
                <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  The Solution
                </h2>
              </div>
              <div className="prose-custom">
                <PortableText value={project.solution} />
              </div>
            </div>
          </section>
        )}

        {/* Impact */}
        {project.impact && project.impact.length > 0 && (
          <section className="py-16 md:py-20 border-b border-zinc-800/50">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-green-500 to-transparent"></div>
                <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                  Impact & Results
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.impact.map((metric, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:to-transparent rounded-2xl transition-all duration-300"></div>
                    <div className="relative">
                      <div className="text-4xl md:text-5xl font-bold text-white mb-3">
                        {metric.value}
                      </div>
                      <div className="text-zinc-300 font-medium text-lg mb-2">
                        {metric.label}
                      </div>
                      {metric.context && (
                        <div className="text-sm text-zinc-500">{metric.context}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Learnings */}
        {project.learnings && (
          <section className="py-16 md:py-20">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-yellow-500 to-transparent"></div>
                <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                  Learnings & Reflections
                </h2>
              </div>
              <div className="prose-custom">
                <PortableText value={project.learnings} />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Navigation */}
      {(project.previousProject || project.nextProject) && (
        <section className="border-t border-zinc-800">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Previous Project */}
              <div>
                {project.previousProject ? (
                  <a
                    href={`/portfolio/${project.previousProject.slug}`}
                    className="group block p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 h-full"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <svg
                        className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:-translate-x-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span className="text-sm text-zinc-500 uppercase tracking-wider font-medium">
                        Previous
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-zinc-300 transition-colors">
                      {project.previousProject.title}
                    </h3>
                  </a>
                ) : (
                  <div className="h-full"></div>
                )}
              </div>

              {/* Next Project */}
              <div>
                {project.nextProject ? (
                  <a
                    href={`/portfolio/${project.nextProject.slug}`}
                    className="group block p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 h-full text-right"
                  >
                    <div className="flex items-center justify-end gap-3 mb-2">
                      <span className="text-sm text-zinc-500 uppercase tracking-wider font-medium">
                        Next
                      </span>
                      <svg
                        className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all"
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
                    <h3 className="text-xl font-semibold text-white group-hover:text-zinc-300 transition-colors">
                      {project.nextProject.title}
                    </h3>
                  </a>
                ) : (
                  <div className="h-full"></div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Spacing */}
      <div className="h-24"></div>
    </main>
  )
}
