import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { BLOG_POSTS_QUERY, BLOG_CATEGORIES_QUERY } from "@/sanity/lib/blogQueries"
import { urlFor } from "@/sanity/lib/image"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

import Reveal from "@/components/Reveal"
import BlogCard from "@/components/BlogCard"

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
    const [posts, categories] = await Promise.all([
      client.fetch<BlogPost[]>(BLOG_POSTS_QUERY),
      client.fetch<BlogCategory[]>(BLOG_CATEGORIES_QUERY),
    ])

    // Filter out posts with missing required fields
    const validPosts = (posts || []).filter(post => 
      post.title && 
      post.slug && 
      post.shortDescription
    )

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
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
            Writing
          </h1>
          <p className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-3xl mb-4">
            I write to clarify how modern products are built — especially where AI, uncertainty, and human judgment intersect.
          </p>
          <p className="text-xl sm:text-2xl text-zinc-400 leading-relaxed max-w-3xl">
            Thoughts on product, strategy, and building things that matter.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      {categories && categories.length > 0 && (
        <section className="border-b border-zinc-900/50">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
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
          <section className="border-b border-zinc-900/50">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 md:py-20">
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
          <section className="border-b border-zinc-900/50 py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
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
            <div className="max-w-6xl mx-auto px-6 sm:px-8">
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
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg mb-4">No blog posts found.</p>
              <p className="text-zinc-600 text-sm">
                Make sure your blog posts in Sanity have all required fields: title, slug, short description, and category.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Spacing */}
      <div className="h-32"></div>
    </main>
    )
  } catch {
    // Silently handle errors in production, show user-friendly message
    return (
      <main className="bg-black text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
          <h1 className="text-4xl font-bold mb-4">Error Loading Blog</h1>
          <p className="text-zinc-400">There was an error loading the blog posts. Please try again later.</p>
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
  title: 'Writing | Product Thinking & Strategy',
  description: 'I write to clarify how modern products are built — especially where AI, uncertainty, and human judgment intersect. Thoughts on product management, strategy, and building things that matter.',
  url: '/blog',
  imageAlt: 'Mauhhik — Writing',
})
