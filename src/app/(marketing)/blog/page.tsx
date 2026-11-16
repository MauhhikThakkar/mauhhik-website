import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { BLOG_POSTS_QUERY, BLOG_CATEGORIES_QUERY } from "@/sanity/lib/blogQueries"
import { urlFor } from "@/sanity/lib/image"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

import Reveal from "@/components/Reveal"
import BlogCard from "@/components/BlogCard"
import { LOCAL_POSTS } from "@/content/posts"

interface BlogCategory {
  _id: string
  title: string
  slug: string
  color?: string
}

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
  category?: {
    title: string
    slug: string
    color?: string
  }
  readingTime: number
  publishedAt: string
  isFeatured: boolean
  tags?: string[]
}

export default async function BlogPage() {
  try {
    // Posts from Sanity. If the CMS cannot be reached, the posts written in code still show.
    let posts: BlogPost[] = []
    let categories: BlogCategory[] = []
    try {
      ;[posts, categories] = await Promise.all([
        client.fetch<BlogPost[]>(BLOG_POSTS_QUERY),
        client.fetch<BlogCategory[]>(BLOG_CATEGORIES_QUERY),
      ])
    } catch (error) {
      console.error('Blog: could not fetch Sanity posts', error)
    }

    // Posts written in code (src/content/posts)
    const localPosts: BlogPost[] = LOCAL_POSTS.map((post) => ({
      _id: `local-${post.slug}`,
      title: post.title,
      slug: post.slug,
      shortDescription: post.description,
      category: { title: post.category, slug: post.category.toLowerCase() },
      readingTime: post.readingTime,
      publishedAt: post.publishedAt,
      isFeatured: false,
      tags: post.tags,
    }))
    const localSlugs = new Set(localPosts.map((post) => post.slug))

    // Filter out posts with missing required fields
    const validPosts = [
      ...localPosts,
      ...(posts || []).filter(post => 
        post.title && 
        post.slug && 
        post.shortDescription &&
        !localSlugs.has(post.slug)
      ),
    ]

    // Separate posts into groups
    const featuredPosts = validPosts.filter(post => post.isFeatured).slice(0, 2)
    const nonFeaturedPosts = validPosts.filter(post => !post.isFeatured || !featuredPosts.includes(post))
    
    // Latest posts (most recent, excluding featured, limit to 6)
    const latestPosts = [...nonFeaturedPosts]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 6)
    
    // Remaining posts for category grouping
    const remainingPosts = nonFeaturedPosts.filter(post => !latestPosts.includes(post))
    
    // Group remaining posts by category
    const postsByCategory = categories.reduce((acc, category) => {
      const categoryPosts = remainingPosts.filter(
        post => post.category?.slug === category.slug
      )
      if (categoryPosts.length > 0) {
        acc[category.slug] = {
          category,
          posts: categoryPosts.sort(
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          ),
        }
      }
      return acc
    }, {} as Record<string, { category: BlogCategory; posts: BlogPost[] }>)

    return (
    <main className="bg-charcoal text-white min-h-screen">
      {/* Intro */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="site-container relative pb-14 pt-32 sm:pt-40 md:pb-16">
          <p className="eyebrow mb-5">Writing</p>
          <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Notes on delivery, payments and moving from project to product.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            What I learn from delivering infrastructure for global exchanges, and how I apply it to product decisions.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      {categories && categories.length > 0 && (
        <section className="border-b border-line">
          <div className="site-container py-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="px-4 py-2 rounded-full text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                All
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/blog?category=${category.slug}`}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
                  style={category.color ? { borderColor: category.color + '40' } : {}}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <Reveal>
          <section className="border-b border-line">
            <div className="site-container py-16 md:py-20">
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-10">
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => {
                const imageUrl = post.heroImage?.asset
                  ? urlFor(post.heroImage).width(800).height(600).fit('max').url()
                  : null

                return (
                  <BlogCard
                    key={post._id}
                    post={post}
                    imageUrl={imageUrl}
                    imageAlt={post.heroImage?.alt}
                    variant="featured"
                  />
                )
              })}
            </div>
          </div>
        </section>
        </Reveal>
      )}

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <Reveal>
          <section className="border-b border-line py-16 md:py-20">
            <div className="site-container">
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-10">
                Latest
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => {
                const imageUrl = post.heroImage?.asset
                  ? urlFor(post.heroImage).width(600).height(400).fit('max').url()
                  : null

                return (
                  <BlogCard
                    key={post._id}
                    post={post}
                    imageUrl={imageUrl}
                    imageAlt={post.heroImage?.alt}
                    variant="standard"
                  />
                )
              })}
            </div>
          </div>
        </section>
        </Reveal>
      )}

      {/* Category-Based Grouping */}
      {Object.keys(postsByCategory).length > 0 && (
        <Reveal>
          <section className="py-16 md:py-20">
            <div className="site-container">
              {Object.values(postsByCategory).map(({ category, posts }, index) => (
                <Reveal key={category._id} delay={index * 0.1} className="mb-16 last:mb-0">
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {category.title}
                  </h2>
                  <span className="text-sm text-zinc-500">({posts.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => {
                    const imageUrl = post.heroImage?.asset
                      ? urlFor(post.heroImage).width(600).height(400).fit('max').url()
                      : null

                    return (
                      <BlogCard
                        key={post._id}
                        post={post}
                        imageUrl={imageUrl}
                        imageAlt={post.heroImage?.alt}
                        variant="standard"
                      />
                    )
                  })}
                </div>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Empty State */}
      {validPosts.length === 0 && (
        <section className="py-20">
          <div className="site-container">
            <p className="text-zinc-400 text-lg">The first posts are being written. Check back soon.</p>
          </div>
        </section>
      )}

      {/* Bottom Spacing */}
      <div className="h-16"></div>
    </main>
    )
  } catch {
    // Silently handle errors in production, show user-friendly message
    return (
      <main className="bg-charcoal text-white min-h-screen">
        <div className="site-container py-20">
          <h1 className="text-3xl font-semibold mb-4 pt-16">Writing</h1>
          <p className="text-zinc-400">Posts could not be loaded just now. Please try again shortly.</p>
        </div>
      </main>
    )
  }
}

// ISR: Revalidate blog listing every hour
// Blog posts may be added/updated frequently, so 1 hour ensures fresh content
// while maintaining good performance through caching
export const revalidate = 3600

export const metadata = generateSEOMetadata({
  title: 'Writing',
  description: 'Notes by Mauhhik Thakkar on delivering infrastructure for global exchanges, payments, and moving from project to product management.',
  url: '/blog',
  imageAlt: 'Mauhhik — Writing',
})
