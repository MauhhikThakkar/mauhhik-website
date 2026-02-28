import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { client } from "@/sanity/lib/client"
import {
  PROJECT_BY_SLUG_QUERY,
  PROJECT_SLUGS_QUERY,
  PROJECT_METADATA_QUERY,
} from "@/sanity/lib/queries"
import PortableText from "@/components/PortableText"
import { urlFor } from "@/sanity/lib/image"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import PortfolioBreadcrumb from "@/components/portfolio/PortfolioBreadcrumb"
import CaseStudyBottomBar from "@/components/portfolio/CaseStudyBottomBar"
import CollapsibleImprovements from "@/components/portfolio/CollapsibleImprovements"

// Type guard for Portable Text
function isValidPortableText(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

/** Stable, unique key for category (handles slug as string or { current }) */
function getCategoryKey(cat: Category, index: number): string {
  const slugVal =
    typeof cat.slug === "string"
      ? cat.slug
      : (cat.slug as { current?: string })?.current
  return slugVal ?? cat._id ?? `category-${index}`
}

/** Sanity category: slug may be string (from slug.current) or object */
interface Category {
  title: string
  slug: string | { current?: string }
  _id?: string
}

interface Metric {
  label: string
  value: string
  context?: string
}

interface WireframeImage {
  asset: { _id: string; url: string }
  alt?: string
}

interface Wireframe {
  title: string
  caption?: string
  image: WireframeImage
}

interface WorkflowBlock {
  title?: string
  description?: string
}

interface RelatedBlog {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  readingTime?: number
  publishedAt?: string
  category?: { title: string; slug: string; color?: string }
}

interface NavProject {
  title: string
  slug: string
}

interface Project {
  _id: string
  title: string
  slug: string
  shortDescription?: string
  coverImage?: {
    alt?: string
    asset?: { _id: string; url: string }
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
  featuredWireframes?: Wireframe[]
  prototypeLink?: string
  targetUsers?: unknown
  marketOpportunity?: unknown
  productVision?: unknown
  architectureWorkflow?: WorkflowBlock[]
  mvpScope?: unknown
  monetizationStrategy?: unknown
  northStarMetric?: string
  intendedImpact?: string
  successCriteria?: string[]
  keyAssumptions?: string[]
  tradeoffs?: Array<{ decision: string; tradeoff: string }>
  whatThisDemonstrates?: string
  relatedBlogs?: RelatedBlog[]
  previousProject?: NavProject
  nextProject?: NavProject
  improvements?: {
    technicalIteration?: string
    gtmRefinement?: string
    metricsEvolution?: string
  }
  risksIdentified?: string[]
  v2Roadmap?: string[]
  monetizationExpansion?: string
}

const CONTAINER_CLASS = "max-w-4xl mx-auto px-6 sm:px-8"
const SECTION_SPACING = "py-16 md:py-20"
const SECTION_BORDER = "border-b border-zinc-900/50"
const SECTION_LABEL_CLASS =
  "text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4"
const SECTION_TITLE_CLASS =
  "text-2xl md:text-3xl font-semibold text-white leading-tight mb-6"
const PROSE_CLASS =
  "prose-custom text-zinc-300 text-lg leading-relaxed max-w-3xl"

function SectionWrapper({
  children,
  altBg = false,
}: {
  children: React.ReactNode
  altBg?: boolean
}) {
  return (
    <section
      className={`${SECTION_SPACING} ${SECTION_BORDER} ${
        altBg ? "bg-charcoal-light/20" : ""
      }`}
    >
      <div className={CONTAINER_CLASS}>{children}</div>
    </section>
  )
}

export async function generateStaticParams() {
  const projects = await client.fetch(PROJECT_SLUGS_QUERY)
  return projects.map((project: { slug: string }) => ({ slug: project.slug }))
}

export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await client.fetch<Project | null>(PROJECT_METADATA_QUERY, {
    slug,
  })

  if (!project) {
    return generateSEOMetadata({
      title: "Portfolio Case Study",
      description: "A detailed case study of a product project.",
      url: `/portfolio/${slug}`,
    })
  }

  const ogImage = project.coverImage?.asset
    ? urlFor(project.coverImage).width(1200).height(630).fit("max").url()
    : undefined

  return generateSEOMetadata({
    title: `${project.title} | Portfolio`,
    description:
      project.shortDescription ||
      `A case study of ${project.title} — exploring the problem, solution, and impact.`,
    image: ogImage,
    imageAlt: project.coverImage?.alt || project.title,
    url: `/portfolio/${project.slug}`,
    type: "website",
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

  const wireframes =
    project.wireframes?.length
      ? project.wireframes
      : project.featuredWireframes

  return (
    <main className="bg-charcoal text-white min-h-screen">
      {/* 1. Hero Section */}
      <section className="border-b border-zinc-900">
        <div className={CONTAINER_CLASS}>
          <div className="py-16 md:py-24">
            <PortfolioBreadcrumb caseStudyTitle={project.title} />

            {project.categories?.length ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {project.categories.map((cat, index) => (
                  <span
                    key={getCategoryKey(cat, index)}
                    className="inline-flex items-center px-3 py-1.5 bg-zinc-900/50 text-zinc-400 rounded-full text-sm font-medium border border-zinc-800/50"
                  >
                    {cat.title}
                  </span>
                ))}
              </div>
            ) : null}

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1.1] tracking-tight">
              {project.title}
            </h1>

            {project.shortDescription && (
              <p className="text-xl text-zinc-400 mb-10 leading-relaxed max-w-3xl">
                {project.shortDescription}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {project.prototypeLink && (
                <a
                  href={project.prototypeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Live Prototype
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
              )}
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-zinc-300 font-medium rounded-lg hover:border-zinc-600 hover:text-white transition-colors"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Executive Context */}
      {isValidPortableText(project.context) && (
        <SectionWrapper altBg>
          <span className={SECTION_LABEL_CLASS}>Executive Context</span>
          <h2 className={SECTION_TITLE_CLASS}>Context</h2>
          <div className="rounded-xl border border-zinc-900 bg-charcoal-light/30 p-6 md:p-8">
            <div className={PROSE_CLASS}>
              <PortableText value={project.context} />
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* 3. Problem */}
      {isValidPortableText(project.problem) && (
        <SectionWrapper>
          <span className={SECTION_LABEL_CLASS}>Problem</span>
          <h2 className={SECTION_TITLE_CLASS}>The Problem</h2>
          <div className={PROSE_CLASS}>
            <PortableText value={project.problem} />
          </div>
        </SectionWrapper>
      )}

      {/* 4. Solution */}
      {isValidPortableText(project.solution) && (
        <SectionWrapper altBg>
          <span className={SECTION_LABEL_CLASS}>Solution</span>
          <h2 className={SECTION_TITLE_CLASS}>Solution</h2>
          <div className={`${PROSE_CLASS} [&_ul]:space-y-2 [&_li]:flex [&_li]:items-start [&_li]:gap-3`}>
            <PortableText value={project.solution} />
          </div>
        </SectionWrapper>
      )}

      {/* 5. Target Users */}
      {isValidPortableText(project.targetUsers) && (
        <SectionWrapper>
          <span className={SECTION_LABEL_CLASS}>Target Users</span>
          <h2 className={SECTION_TITLE_CLASS}>Ideal Customer Profile</h2>
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 p-6 md:p-8 ring-1 ring-white/5">
            <div className={PROSE_CLASS}>
              <PortableText value={project.targetUsers} />
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* 6. Strategy */}
      {isValidPortableText(project.strategy) && (
        <SectionWrapper altBg>
          <span className={SECTION_LABEL_CLASS}>Strategy</span>
          <h2 className={SECTION_TITLE_CLASS}>Strategy</h2>
          <div className="space-y-6">
            <div className={`${PROSE_CLASS} [&_p]:text-zinc-300 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3 first:[&_h3]:mt-0`}>
              <PortableText value={project.strategy} />
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* 7. Learnings */}
      {isValidPortableText(project.learnings) && (
        <SectionWrapper>
          <span className={SECTION_LABEL_CLASS}>Learnings</span>
          <h2 className={SECTION_TITLE_CLASS}>What I Learned</h2>
          <div className="rounded-xl border border-zinc-900 bg-charcoal-light/30 p-6 md:p-8">
            <div className={`${PROSE_CLASS} [&_ul]:space-y-3 [&_li]:flex [&_li]:items-start [&_li]:gap-3 [&_li]:text-zinc-300`}>
              <PortableText value={project.learnings} />
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* 8. Goals */}
      {project.goals?.length ? (
        <SectionWrapper altBg>
          <span className={SECTION_LABEL_CLASS}>Goals</span>
          <h2 className={SECTION_TITLE_CLASS}>Goals & Success Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.goals.map((metric, index) => (
              <div
                key={`goal-${index}-${metric.label ?? metric.value ?? ""}`}
                className="rounded-xl border border-zinc-900 bg-charcoal-light/40 p-6"
              >
                <div className="text-2xl font-bold text-white mb-2">
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-zinc-300">
                  {metric.label}
                </div>
                {metric.context && (
                  <div className="text-sm text-zinc-500 mt-1 leading-relaxed">
                    {metric.context}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionWrapper>
      ) : null}

      {/* Market Opportunity */}
      {isValidPortableText(project.marketOpportunity) && (
        <SectionWrapper>
          <span className={SECTION_LABEL_CLASS}>Market Opportunity</span>
          <h2 className={SECTION_TITLE_CLASS}>The Opportunity</h2>
          <div className={PROSE_CLASS}>
            <PortableText value={project.marketOpportunity} />
          </div>
        </SectionWrapper>
      )}

      {/* Product Vision & System Design (optional) */}
      {isValidPortableText(project.productVision) && (
        <SectionWrapper altBg>
          <span className={SECTION_LABEL_CLASS}>Product Vision</span>
          <h2 className={SECTION_TITLE_CLASS}>
            Product Vision & System Design
          </h2>
          <div className={PROSE_CLASS}>
            <PortableText value={project.productVision} />
          </div>
        </SectionWrapper>
      )}

      {/* Architecture / Workflow Model */}
      {project.architectureWorkflow?.length ? (
          <SectionWrapper>
            <span className={SECTION_LABEL_CLASS}>Architecture</span>
            <h2 className={SECTION_TITLE_CLASS}>
              Architecture / Workflow Model
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {project.architectureWorkflow.map((block, index) => (
                <div
                  key={`workflow-${index}-${block.title ?? ""}`}
                  className="bg-charcoal-light/50 border border-zinc-900 rounded-xl p-6"
                >
                  {block.title && (
                    <h3 className="text-lg font-semibold text-white mb-3">
                      {block.title}
                    </h3>
                  )}
                  {block.description && (
                    <p className="text-zinc-400 leading-relaxed whitespace-pre-line">
                      {block.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </SectionWrapper>
        ) : null}

      {/* Wireframes */}
      {wireframes?.length ? (
        <SectionWrapper altBg>
          <span className={SECTION_LABEL_CLASS}>Design</span>
            <h2 className={SECTION_TITLE_CLASS}>Featured Designs</h2>
            <div
              className={`grid gap-8 ${
                wireframes.length === 1
                  ? "grid-cols-1 max-w-2xl"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {wireframes.map((wf, index) => {
                if (!wf.image?.asset) return null
                try {
                  const imageUrl = urlFor(wf.image)
                    .width(800)
                    .fit("max")
                    .url()
                  return (
                    <div
                      key={`wireframe-${index}-${wf.title ?? ""}`}
                      className="bg-charcoal-light/30 border border-zinc-900 rounded-xl overflow-hidden"
                    >
                      <div className="p-8 min-h-[300px] flex items-center justify-center">
                        <Image
                          src={imageUrl}
                          alt={wf.image.alt || wf.title}
                          width={800}
                          height={600}
                          className="object-contain w-full h-auto"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="p-6 border-t border-zinc-900">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {wf.title}
                        </h3>
                        {wf.caption && (
                          <p className="text-sm text-zinc-400">{wf.caption}</p>
                        )}
                      </div>
                    </div>
                  )
                } catch {
                  return null
                }
              })}
            </div>
            {project.prototypeLink && (
              <div className="mt-8">
                <a
                  href={project.prototypeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  View Interactive Prototype
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
        </SectionWrapper>
      ) : null}

      {/* MVP Scope */}
      {isValidPortableText(project.mvpScope) && (
        <SectionWrapper>
          <span className={SECTION_LABEL_CLASS}>Scope</span>
          <h2 className={SECTION_TITLE_CLASS}>MVP Scope</h2>
          <div className={PROSE_CLASS}>
            <PortableText value={project.mvpScope} />
          </div>
        </SectionWrapper>
      )}

      {/* Monetization Strategy */}
      {isValidPortableText(project.monetizationStrategy) && (
        <SectionWrapper altBg>
          <span className={SECTION_LABEL_CLASS}>Business Model</span>
          <h2 className={SECTION_TITLE_CLASS}>Monetization Strategy</h2>
          <div className={PROSE_CLASS}>
            <PortableText value={project.monetizationStrategy} />
          </div>
        </SectionWrapper>
      )}

      {/* Success Metrics (North Star only; goals in section 8) */}
      {project.northStarMetric && (
        <SectionWrapper altBg>
          <span className={SECTION_LABEL_CLASS}>Metrics</span>
          <h2 className={SECTION_TITLE_CLASS}>North Star Metric</h2>
          <div className="rounded-xl border border-zinc-900 bg-charcoal-light/40 p-6">
            <div className="text-xl font-semibold text-white">
              {project.northStarMetric}
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* Strategic Reflection & Next Iteration */}
      {(project.keyAssumptions?.length ||
        project.tradeoffs?.length ||
        project.risksIdentified?.length ||
        project.v2Roadmap?.length ||
        project.monetizationExpansion) && (
        <SectionWrapper>
          <span className={SECTION_LABEL_CLASS}>Strategic Reflection</span>
            <h2 className={SECTION_TITLE_CLASS}>
              Strategic Reflection & Next Iteration
            </h2>

            <div className="space-y-10 max-w-3xl">
              {/* 1. Key Assumptions Made */}
              {project.keyAssumptions?.length ? (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Key Assumptions Made
                  </h3>
                  <ul className="space-y-2">
                    {project.keyAssumptions.map((item, i) => (
                      <li
                        key={`assumption-${i}-${String(item).slice(0, 40)}`}
                        className="flex items-start gap-3 text-zinc-300 text-base leading-relaxed"
                      >
                        <span className="text-zinc-600 mt-1 flex-shrink-0">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* 2. Major Product Trade-offs */}
              {project.tradeoffs?.length ? (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Major Product Trade-offs
                  </h3>
                  <ul className="space-y-3">
                    {project.tradeoffs.map((t, i) => (
                      <li
                        key={`tradeoff-${i}-${t.decision ?? ""}`}
                        className="flex items-start gap-3 text-zinc-300 text-base leading-relaxed"
                      >
                        <span className="text-zinc-600 mt-1 flex-shrink-0">
                          •
                        </span>
                        <span>
                          <span className="font-medium text-white">
                            {t.decision}
                          </span>
                          {t.tradeoff && (
                            <>
                              {" — "}
                              <span className="text-zinc-400">{t.tradeoff}</span>
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* 3. Risks Identified */}
              {project.risksIdentified?.length ? (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                      Risks Identified
                    </h3>
                    <ul className="space-y-2">
                      {project.risksIdentified.map((item, i) => (
                        <li
                          key={`risk-${i}-${String(item).slice(0, 40)}`}
                          className="flex items-start gap-3 text-zinc-300 text-base leading-relaxed"
                        >
                          <span className="text-zinc-600 mt-1 flex-shrink-0">
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

              {/* 4. What I Would Build Next (V2 Roadmap) */}
              {project.v2Roadmap?.length ? (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    What I Would Build Next (V2 Roadmap)
                  </h3>
                  <ul className="space-y-2">
                    {project.v2Roadmap.map((item, i) => (
                      <li
                        key={`v2-${i}-${String(item).slice(0, 40)}`}
                        className="flex items-start gap-3 text-zinc-300 text-base leading-relaxed"
                      >
                        <span className="text-zinc-600 mt-1 flex-shrink-0">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* 5. Monetization Expansion Strategy */}
              {project.monetizationExpansion && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Monetization Expansion Strategy
                  </h3>
                  <p className="text-zinc-300 text-base leading-relaxed whitespace-pre-line">
                    {project.monetizationExpansion}
                  </p>
                </div>
              )}
            </div>
        </SectionWrapper>
      )}

      {/* What I Would Improve Today (optional collapsible) */}
      <CollapsibleImprovements improvements={project.improvements} />

      {/* Resume CTA */}
      <section className="border-t border-zinc-900">
        <div className={CONTAINER_CLASS}>
          <div className="py-16 md:py-20 text-center">
            <p className="text-zinc-500 text-sm mb-6 max-w-xl mx-auto">
              This case study demonstrates product thinking and execution that
              aligns with my professional experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
        <section className="border-t border-zinc-900">
          <div className={CONTAINER_CLASS}>
            <div className="py-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.previousProject ? (
                <Link
                  href={`/portfolio/${project.previousProject.slug}`}
                  className="group flex flex-col justify-between bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all"
                >
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    ← Previous
                  </span>
                  <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {project.previousProject.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {project.nextProject && (
                <Link
                  href={`/portfolio/${project.nextProject.slug}`}
                  className="group flex flex-col justify-between bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 hover:border-zinc-800 transition-all text-right"
                >
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Next →
                  </span>
                  <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {project.nextProject.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="h-32 md:h-0" />
      <CaseStudyBottomBar />
    </main>
  )
}
