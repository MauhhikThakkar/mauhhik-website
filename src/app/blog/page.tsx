import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { client } from "@/sanity/lib/client"
import { BLOG_POSTS_QUERY, BLOG_CATEGORIES_QUERY } from "@/sanity/lib/blogQueries"
import { urlFor } from "@/sanity/lib/image"

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

    // DEBUG: Enhanced logging to diagnose routing/caching issues
    console.log('===== BLOG PAGE DEBUG =====')
    console.log('📍 Pathname: /blog (should NOT be hash-based)')
    console.log('📊 Total posts from Sanity:', posts?.length || 0)
    console.log('📝 Post details:', posts?.map(p => ({
      title: p.title,
      slug: p.slug,
      hasDescription: !!p.shortDescription,
      hasCategory: !!p.category,
      publishedAt: p.publishedAt,
      _id: p._id,
    })))
    console.log('🔍 GROQ Query Type: _type == "blog" && defined(slug.current)')
    console.log('🕒 Timestamp:', new Date().toISOString())
    console.log('============================')

    // Filter out posts with missing required fields
    const validPosts = (posts || []).filter(post => 
      post.title && 
      post.slug && 
      post.shortDescription
    )

    console.log('✅ Valid posts after filter:', validPosts.length)
    if (validPosts.length === 0 && posts && posts.length > 0) {
      console.warn('⚠️  Posts were filtered out. Check for missing fields:')
      posts.forEach(p => {
        if (!p.title || !p.slug || !p.shortDescription) {
          console.warn(`  - Post "${p.title || 'Untitled'}" missing:`, {
            hasTitle: !!p.title,
            hasSlug: !!p.slug,
            hasDescription: !!p.shortDescription,
          })
        }
      })
    }

    const featuredPosts = validPosts.filter(post => post.isFeatured).slice(0, 2)
    const regularPosts = validPosts.filter(post => !post.isFeatured || !featuredPosts.includes(post))

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
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    <article className="relative bg-zinc-950/30 border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 h-full hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/50 hover:-translate-y-1">
                      {/* Featured Image */}
                      {imageUrl && (
                        <div className="relative w-full aspect-[16/9] bg-zinc-950">
                          <Image
                            src={imageUrl}
                            alt={post.heroImage?.alt || post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        {/* Category & Meta */}
                        <div className="flex items-center gap-3 mb-4 text-sm">
                          {post.category && (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: post.category.color ? post.category.color + '20' : '#27272a',
                                color: post.category.color || '#a1a1aa',
                                borderWidth: '1px',
                                borderColor: post.category.color ? post.category.color + '40' : '#3f3f46',
                              }}
                            >
                              {post.category.title}
                            </span>
                          )}
                          <span className="text-zinc-600">•</span>
                          <time className="text-zinc-500">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                          <span className="text-zinc-600">•</span>
                          <span className="text-zinc-500">{post.readingTime} min read</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-white mb-3 leading-[1.3] group-hover:text-zinc-200 transition-colors">
                          {post.title}
                        </h3>

                        {/* Description */}
                        <p className="text-zinc-400 leading-relaxed line-clamp-2 break-words">
                          {post.shortDescription}
                        </p>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-10">
            All Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => {
              const imageUrl = post.heroImage?.asset
                ? urlFor(post.heroImage).width(600).height(400).fit('max').url()
                : null

              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="relative bg-zinc-950/30 border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/50 hover:-translate-y-1">
                    {/* Image */}
                    {imageUrl && (
                      <div className="relative w-full aspect-[16/9] bg-zinc-950">
                        <Image
                          src={imageUrl}
                          alt={post.heroImage?.alt || post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Category & Meta */}
                      <div className="flex items-center gap-2 mb-3 text-xs flex-wrap">
                        {post.category && (
                          <span
                            className="px-2.5 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: post.category.color ? post.category.color + '20' : '#27272a',
                              color: post.category.color || '#a1a1aa',
                              borderWidth: '1px',
                              borderColor: post.category.color ? post.category.color + '40' : '#3f3f46',
                            }}
                          >
                            {post.category.title}
                          </span>
                        )}
                        <span className="text-zinc-600">•</span>
                        <time className="text-zinc-500">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500">{post.readingTime} min</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2 leading-[1.3] group-hover:text-zinc-200 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 flex-1 break-words">
                        {post.shortDescription}
                      </p>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>

          {/* Empty State */}
          {regularPosts.length === 0 && featuredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg mb-4">No blog posts found.</p>
              <p className="text-zinc-600 text-sm">
                Make sure your blog posts in Sanity have all required fields: title, slug, short description, and category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-32"></div>
    </main>
    )
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return (
      <main className="bg-black text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
          <h1 className="text-4xl font-bold mb-4">Error Loading Blog</h1>
          <p className="text-zinc-400">There was an error loading the blog posts. Please check the console for details.</p>
        </div>
      </main>
    )
  }
}

// Force revalidation every request (for debugging)
export const revalidate = 0

export const metadata = {
  title: 'Blog | Product Writing & Strategy',
  description: 'Thoughts on product management, strategy, and building things that matter.',
}
