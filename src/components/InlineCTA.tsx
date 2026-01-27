'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import EmailCapture from './EmailCapture'

interface InlineCTAProps {
  cta?: {
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

export default function InlineCTA({ cta }: InlineCTAProps) {
  const [shouldShow, setShouldShow] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const observerRef = useRef<IntersectionObserver | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cta || !cta.active) return

    // Find article element to calculate scroll progress
    const article = document.querySelector('article')
    if (!article) return

    const checkScrollProgress = () => {
      const articleTop = article.offsetTop
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Calculate scroll progress (0-1)
      const articleBottom = articleTop + articleHeight
      const scrollableDistance = articleBottom - articleTop - windowHeight
      
      if (scrollableDistance <= 0) {
        setShouldShow(true)
        return
      }

      const scrolled = scrollTop - articleTop
      const progress = scrolled / scrollableDistance

      // Show CTA after 40-50% scroll (using 45% as midpoint)
      if (progress >= 0.45 && !hasShown) {
        setShouldShow(true)
        setHasShown(true)
      }
    }

    // Initial check
    checkScrollProgress()

    // Use Intersection Observer for better performance
    if (containerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasShown) {
              // Check scroll progress when container comes into view
              checkScrollProgress()
            }
          })
        },
        {
          rootMargin: '-20% 0px', // Trigger when 20% from top
          threshold: 0,
        }
      )

      observerRef.current.observe(containerRef.current)
    }

    // Fallback: scroll listener
    window.addEventListener('scroll', checkScrollProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', checkScrollProgress)
      if (observerRef.current && containerRef.current) {
        observerRef.current.unobserve(containerRef.current)
      }
    }
  }, [cta, hasShown])

  // Don't render if no CTA or inactive
  if (!cta || !cta.active || !shouldShow) {
    return <div ref={containerRef} className="my-16" aria-hidden="true" />
  }

  // Animation variants
  // Properly typed to satisfy Framer Motion Variants type
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as const, // cubic-bezier array - valid Easing type
      },
    },
  }

  // Determine CTA variant based on type
  const isNewsletter = cta.ctaType === 'newsletter'
  const isProduct = cta.ctaType === 'product' || cta.ctaType === 'course'
  const isCaseStudy = !!cta.relatedProject

  // Newsletter/Subscribe variant
  if (isNewsletter) {
    return (
      <motion.div
        ref={containerRef}
        className="not-prose my-16 -mx-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Newsletter subscription"
      >
        <EmailCapture />
      </motion.div>
    )
  }

  // Product variant
  if (isProduct && cta.relatedProduct) {
    const product = cta.relatedProduct
    const imageUrl = product.heroImage?.asset?.url || cta.image?.asset?.url
    const isExternal = cta.buttonLink.startsWith('http')

    return (
      <motion.aside
        ref={containerRef}
        className="not-prose my-16 -mx-0 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Related product"
      >
        <div className="bg-charcoal-light/40 border border-zinc-800/50 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            {imageUrl && (
              <div className="flex-shrink-0 w-full md:w-32">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                  <Image
                    src={imageUrl}
                    alt={cta.image?.alt || product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 128px"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Related Resource
              </p>
              <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                {cta.headline || product.title}
              </h3>
              {cta.description && (
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {cta.description}
                </p>
              )}
              <div className="flex items-center gap-3">
                {isExternal ? (
                  <a
                    href={cta.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-charcoal"
                  >
                    <span>{cta.buttonText}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    href={cta.buttonLink}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-charcoal"
                  >
                    <span>{cta.buttonText}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
                {product.pricing && (
                  <span className="text-xs text-zinc-500">
                    {product.pricing.isFree ? 'Free' : `${product.pricing.currency || '$'}${product.pricing.price}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    )
  }

  // Case Study variant
  if (isCaseStudy && cta.relatedProject) {
    const project = cta.relatedProject
    const imageUrl = project.coverImage?.asset?.url || cta.image?.asset?.url

    return (
      <motion.aside
        ref={containerRef}
        className="not-prose my-16 -mx-0 max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label="Related case study"
      >
        <div className="bg-charcoal-light/40 border-l-4 border-zinc-700 rounded-r-lg p-6 md:p-8">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            How this applies in practice
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            {imageUrl && (
              <div className="flex-shrink-0 w-full md:w-40">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                  <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 160px"
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                {cta.headline || project.title}
              </h3>
              {(cta.description || project.shortDescription) && (
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  {cta.description || project.shortDescription}
                </p>
              )}
              <Link
                href={`/portfolio/${project.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-charcoal"
              >
                <span>{cta.buttonText || 'View case study'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </motion.aside>
    )
  }

  // Fallback: Generic CTA
  return (
    <motion.aside
      ref={containerRef}
      className="not-prose my-16 -mx-0 max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Call to action"
    >
      <div className="bg-charcoal-light/40 border border-zinc-800/50 rounded-xl p-6 md:p-8">
        <h3 className="text-lg font-semibold text-white mb-2">
          {cta.headline}
        </h3>
        {cta.description && (
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            {cta.description}
          </p>
        )}
        {cta.buttonLink.startsWith('http') ? (
          <a
            href={cta.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-charcoal"
          >
            <span>{cta.buttonText}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <Link
            href={cta.buttonLink}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-charcoal"
          >
            <span>{cta.buttonText}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </motion.aside>
  )
}
