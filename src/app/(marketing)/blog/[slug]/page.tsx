import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { client } from "@/sanity/lib/client"
import { BLOG_POST_BY_SLUG_QUERY, BLOG_SLUGS_QUERY } from "@/sanity/lib/blogQueries"
import PortableText from "@/components/PortableText"
import ReadingProgress from "@/components/ReadingProgress"
import AuthorAttribution from "@/components/AuthorAttribution"
import InlineCTA from "@/components/InlineCTA"
import { urlFor } from "@/sanity/lib/image"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import JsonLd, { breadcrumbSchema } from "@/components/site/JsonLd"
import { PERSON_ID } from "@/components/PersonSchema"
import { SITE_URL } from "@/lib/constants"

interface BlogPost {
  _id: string
  title: string
  slug: string
  shortDescription: string
  heroImage?: {
    alt: string
    asset: {
      _id: string
      url: string
    }
  }
  content: unknown
  tldr?: string
  pmTakeaway?: string
  readingTime: number
  category?: {
    title: string
    slug: string
    color?: string
  }
  tags?: string[]
  relatedProjects?: Array<{
    title: string
    slug: string
    shortDescription?: string
  }>
  publishedAt: string
  author?: {
    name: string
    role?: string
    bio?: string
    portfolioLink?: string
    picture?: {
      alt?: string
      asset: {
        _id: string
        url: string
        metadata?: {
          dimensions?: {
            width: number
            height: number
            aspectRatio: number
          }
        }
      }
    }
  }
  ctas?: {
    customPosition?: number
    inlineContent?: {
      _id: string
      headline: string
      description?: string
      buttonText: string
      buttonLink: string
      ctaType: 'content-upgrade' | 'newsletter' | 'product' | 'course' | 'free-resource' | 'custom'
      style: 'card' | 'banner' | 'minimal' | 'feature'
      active?: boolean
      image?: {
        alt?: string
        asset: {
          _id: string
          url: string
        }
      }
      relatedProduct?: {
        title: string
        slug: string
        heroImage?: {
          asset: {
            url: string
          }
        }
        pricing?: {
          isFree: boolean
          price?: number
          currency?: string
        }
      }
      relatedProject?: {
        title: string
        slug: string
        shortDescription?: string
        coverImage?: {
          asset: {
            url: string
          }
        }
      }
    }
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export async function generateStaticParams() {
  const posts = await client.fetch(BLOG_SLUGS_QUERY)
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

// ISR: Revalidate blog posts every hour
// Individual posts may be edited (typos, updates), so 1 hour ensures changes appear
// while maintaining performance. Longer posts benefit from longer cache times.
export const revalidate = 3600

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post: BlogPost | null = await client.fetch(BLOG_POST_BY_SLUG_QUERY, {
    slug,
  })

  if (!post) {
    notFound()
  }

  const imageUrl = post.heroImage?.asset
    ? urlFor(post.heroImage).width(1200).height(675).fit('max').url()
    : null

  return (
    <main className="bg-charcoal text-white min-h-screen">
      {/* Structured data: tells search engines and AI assistants who wrote this and when */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.shortDescription,
          datePublished: post.publishedAt,
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          url: `${SITE_URL}/blog/${post.slug}`,
          ...(imageUrl && { image: imageUrl }),
          ...(post.tags && post.tags.length > 0 && { keywords: post.tags.join(', ') }),
          author: { '@type': 'Person', '@id': PERSON_ID, name: 'Mauhhik Thakkar', url: `${SITE_URL}/about` },
          publisher: { '@id': PERSON_ID },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: SITE_URL },
          { name: 'Writing', url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ])}
      />

      {/* Reading Progress Indicator */}
      <ReadingProgress />

      {/* Hero Section */}
      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-32 sm:px-8 sm:pt-40 md:pb-16">
            <Link href="/blog" className="text-link text-sm">
              All writing
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              {post.category && <span className="text-accent">{post.category.title}</span>}
              {post.category && <span aria-hidden="true">·</span>}
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </div>

            <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-300 sm:text-xl">
              {post.shortDescription}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Image
                src="/images/mauhhik-thakkar.jpg"
                alt="Mauhhik Thakkar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border border-line-strong object-cover"
              />
              <div className="text-sm">
                <Link href="/about" className="font-medium text-white hover:underline">
                  Mauhhik Thakkar
                </Link>
                <p className="text-zinc-500">Project manager, moving into product</p>
              </div>
            </div>
          </div>
        </header>

        {/* Short answer: the direct answer first, for readers and for search and AI summaries */}
        {post.tldr && (
          <div className="border-b border-line bg-charcoal-dark/60">
            <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
              <p className="eyebrow mb-3 text-accent">Short answer</p>
              <p className="text-lg leading-relaxed text-zinc-100">{post.tldr}</p>
            </div>
          </div>
        )}

        {/* Hero Image */}
        {imageUrl && (
          <div className="border-b border-line">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 md:py-16">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-charcoal-light">
                <Image
                  src={imageUrl}
                  alt={post.heroImage?.alt || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 md:py-20">
          <div className="prose-custom mx-auto max-w-2xl text-[18px] leading-[1.75] text-zinc-300">
            <PortableText value={post.content} article />
          </div>

          {/* Inline CTA - Appears after 40-50% scroll */}
          {post.ctas?.inlineContent && (
            <InlineCTA cta={post.ctas.inlineContent} />
          )}

          {/* Key takeaway */}
          {post.pmTakeaway && (
            <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-accent/25 bg-accent-muted p-6 sm:p-8">
              <p className="eyebrow mb-3 text-accent">Key takeaway</p>
              <p className="text-lg leading-relaxed text-zinc-100">{post.pmTakeaway}</p>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-20 pt-12 border-t border-line max-w-2xl mx-auto">
              <div className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-zinc-900/50 text-zinc-300 rounded-full text-sm font-medium border border-zinc-800/50 hover:bg-zinc-900 hover:border-zinc-700 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Follow and contact */}
          <div className="card mx-auto mt-16 max-w-2xl p-6 sm:p-8">
            <p className="eyebrow mb-3">Keep reading</p>
            <p className="text-base leading-relaxed text-zinc-300">
              I send new posts through my newsletter, The PM Transition. If you are hiring for a
              product role in the UAE or Singapore, I would like to hear from you.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://thepmtransition.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Subscribe on Substack
              </a>
              <a href="mailto:hello@mauhhik.com" className="btn-secondary">
                Email me
              </a>
            </div>
          </div>

          {/* Author Attribution */}
          <AuthorAttribution author={post.author} />
        </div>

        {/* Related Projects */}
        {post.relatedProjects && post.relatedProjects.length > 0 && (
          <div className="border-t border-line bg-charcoal-light/20">
            <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 md:py-24">
              <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Related Case Studies</h2>
                <p className="text-base text-zinc-400 leading-relaxed">
                  Work that connects to this post
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {post.relatedProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/portfolio/${project.slug}`}
                    className="group block p-8 bg-charcoal-light/50 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-charcoal-light/70 hover:shadow-lg hover:shadow-zinc-900/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-zinc-100 transition-colors">
                      {project.title}
                    </h3>
                    {project.shortDescription && (
                      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                        {project.shortDescription}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                      <span>View case study</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Bottom Spacing */}
      <div className="h-32"></div>
    </main>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post: BlogPost | null = await client.fetch(BLOG_POST_BY_SLUG_QUERY, {
    slug,
  })

  if (!post) {
    return generateSEOMetadata({
      title: 'Post Not Found',
      url: `/blog/${slug}`,
    })
  }

  // Build OpenGraph image URL from hero image or default
  const ogImage = post.heroImage?.asset
    ? urlFor(post.heroImage).width(1200).height(630).fit('max').url()
    : undefined // Will use default from generateSEOMetadata

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.shortDescription

  return generateSEOMetadata({
    title: `${title} | Blog`,
    description,
    image: ogImage,
    imageAlt: post.heroImage?.alt || post.title,
    url: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    authors: post.author?.name ? [post.author.name] : undefined,
    tags: post.tags,
  })
}
