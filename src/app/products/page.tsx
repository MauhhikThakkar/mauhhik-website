import Link from 'next/link'
import { client } from "@/sanity/lib/client"
import { LIVE_PRODUCTS_QUERY } from '@/sanity/lib/productQueries'
import Reveal from '@/components/Reveal'

interface Product {
  _id: string
  title: string
  slug: string
  shortDescription: string
  status: 'draft' | 'live' | 'archived'
  price?: number
  ctaText?: string
}

export default async function ProductsPage() {
  const products = await client.fetch<Product[]>(LIVE_PRODUCTS_QUERY)

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
            Products
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-400 leading-relaxed max-w-3xl">
            Digital products, guides, and resources for product managers and builders.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <Reveal>
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  <article className="relative bg-zinc-950/30 border border-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/50 hover:-translate-y-1">
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 leading-[1.3] group-hover:text-zinc-200 transition-colors line-clamp-2">
                        {product.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 flex-1 break-words mb-4">
                        {product.shortDescription}
                      </p>

                      {/* Price / CTA */}
                      <div className="mt-auto pt-4 border-t border-zinc-900">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-500">
                            {product.price ? `$${product.price.toFixed(2)}` : 'Free'}
                          </span>
                          <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                            {product.ctaText || 'Learn more'} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-500 text-lg mb-4">No products available yet.</p>
              <p className="text-zinc-600 text-sm">
                Check back soon for digital products, guides, and resources.
              </p>
            </div>
          )}
        </div>
      </section>
      </Reveal>

      {/* Bottom Spacing */}
      <div className="h-32"></div>
    </main>
  )
}

export const metadata = {
  title: 'Products | Digital Resources & Guides',
  description: 'Digital products, guides, and resources for product managers and builders.',
}
