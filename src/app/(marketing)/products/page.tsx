import { client } from "@/sanity/lib/client"
import { LIVE_PRODUCTS_QUERY } from '@/sanity/lib/productQueries'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import Reveal from '@/components/Reveal'
import ProductCard from '@/components/ProductCard'

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
    <main className="bg-charcoal text-white min-h-screen">
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
                <ProductCard key={product._id} product={product} />
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

export const metadata = generateSEOMetadata({
  title: 'Products | Digital Resources & Guides',
  description: 'Digital products, guides, and resources for product managers and builders.',
  url: '/products',
  imageAlt: 'Mauhhik — Products',
})
