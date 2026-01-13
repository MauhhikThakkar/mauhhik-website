/**
 * BLOG CTA INTEGRATION EXAMPLE
 * 
 * This file shows how to integrate the Blog CTA system into your blog post page.
 * Copy the relevant sections into your src/app/blog/[slug]/page.tsx
 */

import BlogCTA from '@/components/BlogCTA'
import PortableText from '@/components/PortableText'

// ============================================
// EXAMPLE 1: Simple End-of-Post CTA
// ============================================
export function BlogPostSimple({ post }: { post: BlogPost }) {
  return (
    <article>
      {/* Article content */}
      <PortableText value={post.content} />

      {/* End-of-post CTA */}
      {post.ctas?.endOfPost && post.ctas.endOfPost.active && (
        <BlogCTA
          headline={post.ctas.endOfPost.headline}
          description={post.ctas.endOfPost.description}
          buttonText={post.ctas.endOfPost.buttonText}
          buttonLink={post.ctas.endOfPost.buttonLink}
          ctaType={post.ctas.endOfPost.ctaType}
          style={post.ctas.endOfPost.style}
          image={
            post.ctas.endOfPost.image?.asset
              ? {
                  url: post.ctas.endOfPost.image.asset.url,
                  alt: post.ctas.endOfPost.image.alt,
                }
              : undefined
          }
          relatedProduct={post.ctas.endOfPost.relatedProduct}
        />
      )}

      {/* Related projects */}
      {post.relatedProjects && post.relatedProjects.length > 0 && (
        <RelatedProjects projects={post.relatedProjects} />
      )}
    </article>
  )
}

// ============================================
// EXAMPLE 2: Inline + End-of-Post CTAs
// ============================================
export function BlogPostWithInlineCTA({ post }: { post: BlogPost }) {
  // Split content at custom position (default 50%)
  const contentBlocks = post.content || []
  const inlinePosition = post.ctas?.customPosition || 50
  const splitIndex = Math.floor(contentBlocks.length * (inlinePosition / 100))

  const firstHalf = contentBlocks.slice(0, splitIndex)
  const secondHalf = contentBlocks.slice(splitIndex)

  return (
    <article>
      {/* First half of content */}
      <PortableText value={firstHalf} />

      {/* Inline CTA (mid-content) */}
      {post.ctas?.inlineContent && post.ctas.inlineContent.active && (
        <BlogCTA
          headline={post.ctas.inlineContent.headline}
          description={post.ctas.inlineContent.description}
          buttonText={post.ctas.inlineContent.buttonText}
          buttonLink={post.ctas.inlineContent.buttonLink}
          ctaType={post.ctas.inlineContent.ctaType}
          style={post.ctas.inlineContent.style}
          image={
            post.ctas.inlineContent.image?.asset
              ? {
                  url: post.ctas.inlineContent.image.asset.url,
                  alt: post.ctas.inlineContent.image.alt,
                }
              : undefined
          }
          relatedProduct={post.ctas.inlineContent.relatedProduct}
        />
      )}

      {/* Second half of content */}
      <PortableText value={secondHalf} />

      {/* End-of-post CTA */}
      {post.ctas?.endOfPost && post.ctas.endOfPost.active && (
        <BlogCTA
          headline={post.ctas.endOfPost.headline}
          description={post.ctas.endOfPost.description}
          buttonText={post.ctas.endOfPost.buttonText}
          buttonLink={post.ctas.endOfPost.buttonLink}
          ctaType={post.ctas.endOfPost.ctaType}
          style={post.ctas.endOfPost.style}
          image={
            post.ctas.endOfPost.image?.asset
              ? {
                  url: post.ctas.endOfPost.image.asset.url,
                  alt: post.ctas.endOfPost.image.alt,
                }
              : undefined
          }
          relatedProduct={post.ctas.endOfPost.relatedProduct}
        />
      )}
    </article>
  )
}

// ============================================
// EXAMPLE 3: Helper Function (Recommended)
// ============================================

/**
 * Helper to render a CTA from Sanity data
 */
function renderCTA(ctaData: any) {
  if (!ctaData || !ctaData.active) return null

  return (
    <BlogCTA
      headline={ctaData.headline}
      description={ctaData.description}
      buttonText={ctaData.buttonText}
      buttonLink={ctaData.buttonLink}
      ctaType={ctaData.ctaType}
      style={ctaData.style}
      image={
        ctaData.image?.asset
          ? {
              url: ctaData.image.asset.url,
              alt: ctaData.image.alt,
            }
          : undefined
      }
      relatedProduct={ctaData.relatedProduct}
    />
  )
}

export function BlogPostWithHelper({ post }: { post: BlogPost }) {
  const contentBlocks = post.content || []
  const inlinePosition = post.ctas?.customPosition || 50
  const splitIndex = Math.floor(contentBlocks.length * (inlinePosition / 100))

  return (
    <article>
      {/* First half */}
      <PortableText value={contentBlocks.slice(0, splitIndex)} />

      {/* Inline CTA */}
      {renderCTA(post.ctas?.inlineContent)}

      {/* Second half */}
      <PortableText value={contentBlocks.slice(splitIndex)} />

      {/* End-of-post CTA */}
      {renderCTA(post.ctas?.endOfPost)}
    </article>
  )
}

// ============================================
// EXAMPLE 4: With Analytics Tracking
// ============================================
export function BlogPostWithTracking({ post }: { post: BlogPost }) {
  const trackCTAClick = (cta: any) => {
    // Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'cta_click', {
        cta_id: cta._id,
        cta_type: cta.ctaType,
        cta_headline: cta.headline,
        page_slug: post.slug,
      })
    }

    // Custom analytics
    console.log('CTA clicked:', {
      id: cta._id,
      type: cta.ctaType,
      post: post.slug,
    })
  }

  return (
    <article>
      <PortableText value={post.content} />

      {post.ctas?.endOfPost && post.ctas.endOfPost.active && (
        <div onClick={() => trackCTAClick(post.ctas.endOfPost)}>
          <BlogCTA
            headline={post.ctas.endOfPost.headline}
            description={post.ctas.endOfPost.description}
            buttonText={post.ctas.endOfPost.buttonText}
            buttonLink={post.ctas.endOfPost.buttonLink}
            ctaType={post.ctas.endOfPost.ctaType}
            style={post.ctas.endOfPost.style}
            image={
              post.ctas.endOfPost.image?.asset
                ? {
                    url: post.ctas.endOfPost.image.asset.url,
                    alt: post.ctas.endOfPost.image.alt,
                  }
                : undefined
            }
            relatedProduct={post.ctas.endOfPost.relatedProduct}
          />
        </div>
      )}
    </article>
  )
}

// ============================================
// TYPE DEFINITIONS
// ============================================
interface BlogPost {
  slug: string
  content: any[]
  ctas?: {
    customPosition?: number
    inlineContent?: CTAData
    endOfPost?: CTAData
  }
  relatedProjects?: Array<{
    title: string
    slug: string
    shortDescription: string
  }>
}

interface CTAData {
  _id: string
  headline: string
  description?: string
  buttonText: string
  buttonLink: string
  ctaType: 'content-upgrade' | 'newsletter' | 'product' | 'course' | 'free-resource' | 'custom'
  style: 'card' | 'banner' | 'minimal' | 'feature'
  active: boolean
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  relatedProduct?: {
    title: string
    slug: string
    heroImage?: {
      asset: {
        url: string
      }
    }
    pricing: {
      isFree: boolean
      price: number
      currency: string
    }
  }
}

// ============================================
// USAGE NOTES
// ============================================

/*

1. SIMPLE IMPLEMENTATION (Recommended for most cases):
   - Use Example 1 for end-of-post CTA only
   - Use Example 3 with helper function for cleaner code

2. ADVANCED IMPLEMENTATION:
   - Use Example 2 for inline + end-of-post CTAs
   - Use Example 4 if you need analytics tracking

3. POSITIONING:
   - Default inline position: 50%
   - Override per post: customPosition field
   - Calculate: splitIndex = contentBlocks.length * (position / 100)

4. CONDITIONAL RENDERING:
   - Always check: ctaData && ctaData.active
   - CTAs are optional: post.ctas?.endOfPost
   - Handle missing images gracefully

5. MOBILE OPTIMIZATION:
   - BlogCTA component handles responsive layout
   - Test on mobile devices
   - Consider disabling inline CTAs for short posts on mobile

6. PERFORMANCE:
   - Images lazy load by default
   - CTA data fetched with blog post (no extra queries)
   - Component renders only if CTA is active

7. SEO:
   - CTAs are part of article content
   - No negative SEO impact
   - External links have rel="noopener noreferrer"

*/
