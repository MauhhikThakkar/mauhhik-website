import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { client } from "@/sanity/lib/client"
import { PRODUCT_BY_SLUG_QUERY, PRODUCT_SLUGS_QUERY } from '@/sanity/lib/productQueries'
import PortableText from '@/components/PortableText'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { urlFor } from '@/sanity/lib/image'

// Type guard to safely check if value is valid Portable Text (array)
// This narrows 'unknown' to 'unknown[]' so TypeScript knows it's renderable
function isValidPortableText(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

interface Product {
  _id: string
  title: string
  slug: string
  shortDescription: string
  longDescription: unknown
  status: 'draft' | 'live' | 'archived'
  price?: number
  ctaText?: string
  heroImage?: {
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
  relatedBlogPosts?: Array<{
    _id: string
    title: string
    slug: string
    shortDescription: string
    heroImage?: {
      alt?: string
      asset: {
        _id: string
        url: string
      }
    }
  }>
}

export async function generateStaticParams() {
  const products = await client.fetch(PRODUCT_SLUGS_QUERY)
  return products.map((product: { slug: string }) => ({
    slug: product.slug,
  }))
}

// ISR: Revalidate products every 24 hours
// Products are relatively stable (pricing, descriptions change infrequently)
// 24 hours ensures updates appear within a day while maximizing cache performance
export const revalidate = 86400

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product: Product | null = await client.fetch(PRODUCT_BY_SLUG_QUERY, {
    slug,
  })

  if (!product || product.status !== 'live') {
    notFound()
  }

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-20 pb-16 md:pt-24 md:pb-20">
          {/* Back Link */}
          <Link
            href="/products"
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
            Back to Products
          </Link>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.05] tracking-tight">
            {product.title}
          </h1>

          {/* Promise / Short Description */}
          <p className="text-xl sm:text-2xl text-zinc-300 leading-[1.5] font-normal max-w-3xl">
            {product.shortDescription}
          </p>
        </div>
      </section>

      {/* Long Description / What It's For */}
      {/* Type guard ensures longDescription is a valid Portable Text array before rendering */}
      {isValidPortableText(product.longDescription) && (
        <section className="border-b border-zinc-900/50">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                What it&apos;s for
              </h2>
            </div>
            <div className="prose-custom text-zinc-300 text-[19px] leading-[1.7] max-w-2xl">
              <PortableText value={product.longDescription} />
            </div>
          </div>
        </section>
      )}

      {/* Who It's For */}
      <section className="border-b border-zinc-900/50">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Who it&apos;s for
          </h2>
          <div className="max-w-2xl">
            <p className="text-lg text-zinc-400 leading-relaxed">
              This product is designed for product managers, founders, and builders who want to
              apply proven frameworks and methodologies to their work. Whether you&apos;re early in your
              career or leading product strategy, you&apos;ll find practical insights you can use immediately.
            </p>
            <p className="text-lg text-zinc-400 leading-relaxed mt-6">
              {/* Placeholder - can be replaced with actual "who it's for" content from schema in future */}
            </p>
          </div>
        </div>
      </section>

      {/* Related Writing */}
      {product.relatedBlogPosts && product.relatedBlogPosts.length > 0 && (
        <section className="border-b border-zinc-900/50 bg-zinc-950/20">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Related writing
              </h2>
              <p className="text-base text-zinc-400 leading-relaxed">
                Articles and posts that provide deeper context on this topic
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.relatedBlogPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group block p-6 bg-zinc-950/50 border border-zinc-800 rounded-xl hover:border-zinc-700 hover:bg-zinc-950/70 hover:shadow-lg hover:shadow-zinc-900/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-zinc-100 transition-colors">
                    {post.title}
                  </h3>
                  {post.shortDescription && (
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {post.shortDescription}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    <span>Read article</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Coming Soon */}
      <section className="py-16 md:py-24 border-t border-zinc-900/50">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-950/50 text-zinc-300 rounded-xl border border-zinc-800">
            <svg
              className="w-5 h-5 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-base font-medium">
              {product.ctaText || 'Get Access'} — Coming soon
            </span>
          </div>
          {product.price && (
            <p className="mt-4 text-sm text-zinc-500">
              Price: ${product.price.toFixed(2)}
            </p>
          )}
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-32"></div>
    </main>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product: Product | null = await client.fetch(PRODUCT_BY_SLUG_QUERY, {
    slug,
  })

  // If product doesn't exist, return default metadata
  // Next.js will handle 404 via notFound() in the page component
  if (!product) {
    return generateSEOMetadata({
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
      url: `/products/${slug}`,
    })
  }

  // Build OpenGraph image URL from hero image or default
  const ogImage = product.heroImage?.asset
    ? urlFor(product.heroImage).width(1200).height(630).fit('max').url()
    : undefined // Will use default from generateSEOMetadata

  return generateSEOMetadata({
    title: `${product.title} | Products`,
    description: product.shortDescription,
    image: ogImage,
    imageAlt: product.heroImage?.alt || product.title,
    url: `/products/${product.slug}`,
    type: 'website',
  })
}
