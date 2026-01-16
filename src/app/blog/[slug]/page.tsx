import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { client } from "@/sanity/lib/client"
import { BLOG_POST_BY_SLUG_QUERY, BLOG_SLUGS_QUERY } from "@/sanity/lib/blogQueries"
import PortableText from "@/components/PortableText"
import EmailCapture from "@/components/EmailCapture"
import ReadingProgress from "@/components/ReadingProgress"
import AuthorAttribution from "@/components/AuthorAttribution"
import { urlFor } from "@/sanity/lib/image"
import { SITE_URL, SITE_NAME } from "@/lib/constants"

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
  content: any
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
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await client.fetch(BLOG_SLUGS_QUERY)
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

// Force revalidation every request (for debugging)
export const revalidate = 0

export default async function BlogPostPage({ params }: Props) {
  console.log('===== BLOG POST DEBUG =====')
  console.log('Fetching slug:', params.slug)
  
  const post: BlogPost | null = await client.fetch(BLOG_POST_BY_SLUG_QUERY, {
    slug: params.slug,
  })

  console.log('Post found:', !!post)
  if (post) {
    console.log('Post title:', post.title)
    console.log('Post ID:', post._id)
  }
  console.log('===========================')

  if (!post) {
    notFound()
  }

  const imageUrl = post.heroImage?.asset
    ? urlFor(post.heroImage).width(1200).height(675).fit('max').url()
    : null

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Reading Progress Indicator */}
      <ReadingProgress />

      {/* Hero Section */}
      <article>
        <header className="border-b border-zinc-900">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-20 pb-12 md:pt-24 md:pb-16">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
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
              Back to Blog
            </Link>

            {/* Category */}
            {post.category && (
              <div className="mb-6">
                <span
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: post.category.color ? post.category.color + '20' : '#27272a',
                    color: post.category.color || '#a1a1aa',
                    borderWidth: '1px',
                    borderColor: post.category.color ? post.category.color + '40' : '#3f3f46',
                  }}
                >
                  {post.category.title}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight max-w-4xl">
              {post.title}
            </h1>

            {/* Author Attribution (Compact) */}
            {post.author && <AuthorAttribution author={post.author} variant="compact" />}

            {/* Meta */}
            <div className="flex items-center gap-4 text-base text-zinc-400 mb-8">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
              <span className="text-zinc-700">•</span>
              <span>{post.readingTime} min read</span>
            </div>

            {/* Description */}
            <p className="text-xl sm:text-2xl text-zinc-300 leading-[1.5] font-normal max-w-3xl">
              {post.shortDescription}
            </p>
          </div>
        </header>

        {/* TL;DR - Prominent */}
        {post.tldr && (
          <div className="border-b border-zinc-900/50 bg-zinc-950/30">
            <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                    TL;DR
                  </span>
                </div>
                <p className="text-lg text-zinc-200 leading-relaxed font-medium">
                  {post.tldr}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Hero Image */}
        {imageUrl && (
          <div className="border-b border-zinc-900">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 md:py-16">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-950">
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
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          <div className="prose-custom text-zinc-300 text-[19px] leading-[1.7] max-w-2xl mx-auto">
            <PortableText value={post.content} />
          </div>

          {/* PM Takeaway - Optional Section */}
          {post.pmTakeaway && (
            <div className="mt-20 max-w-2xl mx-auto">
              <div className="border-l-4 border-blue-500/30 bg-blue-950/10 rounded-r-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-blue-300 uppercase tracking-wider">
                    How I apply this as a Product Manager
                  </h3>
                </div>
                <p className="text-lg text-zinc-200 leading-relaxed">
                  {post.pmTakeaway}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-20 pt-12 border-t border-zinc-900 max-w-2xl mx-auto">
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

          {/* Email Capture */}
          <EmailCapture />

          {/* Author Attribution */}
          <AuthorAttribution author={post.author} />
        </div>

        {/* Related Projects */}
        {post.relatedProjects && post.relatedProjects.length > 0 && (
          <div className="border-t border-zinc-900 bg-zinc-950/20">
            <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 md:py-24">
              <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Related Case Studies</h2>
                <p className="text-base text-zinc-400 leading-relaxed">
                  Related work where I've applied this thinking
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {post.relatedProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/portfolio/${project.slug}`}
                    className="group block p-8 bg-zinc-950/50 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-950/70 hover:shadow-lg hover:shadow-zinc-900/30 hover:-translate-y-1 transition-all duration-300"
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

export async function generateMetadata({ params }: Props) {
  const post: BlogPost | null = await client.fetch(BLOG_POST_BY_SLUG_QUERY, {
    slug: params.slug,
  })

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  // Build OpenGraph image URL from hero image or default
  const ogImage = post.heroImage?.asset
    ? urlFor(post.heroImage).width(1200).height(630).fit('max').url()
    : `${SITE_URL}/og-image.jpg`

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.shortDescription

  return {
    title: `${title} | Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : [SITE_NAME],
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.heroImage?.alt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
      creator: '@mauhhik',
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
  }
}
