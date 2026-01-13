import Image from 'next/image'
import Link from 'next/link'

interface BlogCTAProps {
  headline: string
  description?: string
  buttonText: string
  buttonLink: string
  ctaType: 'content-upgrade' | 'newsletter' | 'product' | 'course' | 'free-resource' | 'custom'
  style: 'card' | 'banner' | 'minimal' | 'feature'
  image?: {
    url: string
    alt?: string
  }
  relatedProduct?: {
    title: string
    slug: string
    heroImage?: {
      asset: { url: string }
    }
    pricing: {
      isFree: boolean
      price: number
      currency: string
    }
  }
  className?: string
}

export default function BlogCTA({
  headline,
  description,
  buttonText,
  buttonLink,
  ctaType,
  style,
  image,
  relatedProduct,
  className = '',
}: BlogCTAProps) {
  // Determine visual styling based on style and ctaType
  const getStyleClasses = () => {
    const baseClasses = 'not-prose my-16 -mx-0'

    switch (style) {
      case 'banner':
        return `${baseClasses} bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-8 md:p-10`

      case 'minimal':
        return `${baseClasses} border-l-4 border-zinc-700 pl-8 py-6`

      case 'feature':
        return `${baseClasses} bg-zinc-950/50 border-2 border-zinc-800 rounded-3xl p-10 backdrop-blur-sm`

      case 'card':
      default:
        return `${baseClasses} bg-zinc-950/30 border border-zinc-900 rounded-2xl p-8 md:p-10`
    }
  }

  // Determine accent color based on CTA type
  const getAccentColor = () => {
    switch (ctaType) {
      case 'product':
      case 'course':
        return 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      case 'newsletter':
        return 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
      case 'free-resource':
      case 'content-upgrade':
        return 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
      case 'custom':
      default:
        return 'from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700'
    }
  }

  // Get icon based on CTA type
  const getIcon = () => {
    switch (ctaType) {
      case 'newsletter':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )
      case 'content-upgrade':
      case 'free-resource':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )
      case 'product':
      case 'course':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        )
      default:
        return null
    }
  }

  // Determine if link is external
  const isExternal = buttonLink.startsWith('http')

  // Use product image if available, otherwise use CTA image
  const displayImage = relatedProduct?.heroImage?.asset?.url || image?.url

  return (
    <div className={`${getStyleClasses()} ${className}`}>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Image Section (if exists) */}
        {displayImage && (
          <div className="flex-shrink-0 w-full md:w-1/3">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <Image
                src={displayImage}
                alt={image?.alt || relatedProduct?.title || 'CTA visual'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className={`flex-1 ${displayImage ? 'text-left' : 'text-center md:text-left'}`}>
          {/* Type Badge (optional, for feature style) */}
          {style === 'feature' && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900 border border-zinc-800 rounded-full mb-4">
              {ctaType.replace('-', ' ')}
            </span>
          )}

          {/* Headline */}
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
            {headline}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-base md:text-lg text-zinc-400 mb-6 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          {/* Product Price (if product CTA) */}
          {relatedProduct && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-zinc-500">
                {relatedProduct.pricing.isFree ? (
                  <span className="text-emerald-400 font-semibold">Free</span>
                ) : (
                  <span className="text-white font-semibold">
                    {relatedProduct.pricing.currency} {relatedProduct.pricing.price}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* CTA Button */}
          {isExternal ? (
            <a
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${getAccentColor()} text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl`}
            >
              <span>{buttonText}</span>
              {getIcon()}
            </a>
          ) : (
            <Link
              href={buttonLink}
              className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${getAccentColor()} text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-xl`}
            >
              <span>{buttonText}</span>
              {getIcon()}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
