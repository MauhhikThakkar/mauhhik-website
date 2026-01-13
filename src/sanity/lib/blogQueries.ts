/**
 * GROQ Queries for Blog Posts
 * 
 * IMPORTANT: Query filters explained:
 * - _type == "blog" : Matches the blog schema document type
 * - defined(slug.current) : Only returns posts with a valid slug (excludes drafts without slugs)
 * - NO publishedAt filter : Shows ALL posts regardless of date (past/future)
 * - Drafts are INCLUDED unless they lack a slug
 * 
 * If you want to exclude future posts, add: && publishedAt <= now()
 * If you want to exclude drafts explicitly, add: && !(_id in path("drafts.**"))
 */

// Get all published blog posts with featured status
export const BLOG_POSTS_QUERY = `
  *[_type == "blog" && defined(slug.current)] 
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    heroImage {
      alt,
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    },
    "category": category->{ 
      title,
      "slug": slug.current,
      color
    },
    readingTime,
    publishedAt,
    isFeatured,
    tags
  }
`

// Get single blog post by slug
export const BLOG_POST_BY_SLUG_QUERY = `
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    heroImage {
      alt,
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      }
    },
    content[] {
      ...,
      _type == "image" => {
        _type,
        _key,
        alt,
        asset->{
          _id,
          url,
          metadata {
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
      }
    },
    tldr,
    pmTakeaway,
    readingTime,
    "category": category->{ 
      title,
      "slug": slug.current,
      color
    },
    tags,
    relatedProjects[]-> {
      title,
      "slug": slug.current,
      shortDescription
    },
    publishedAt,
    "author": author->{ name },
    ctas {
      customPosition,
      "inlineContent": inlineContent->{
        _id,
        headline,
        description,
        buttonText,
        buttonLink,
        ctaType,
        style,
        active,
        image {
          alt,
          asset->{ _id, url }
        },
        "relatedProduct": relatedProduct->{
          title,
          "slug": slug.current,
          heroImage { asset->{ url } },
          pricing { isFree, price, currency }
        }
      },
      "endOfPost": endOfPost->{
        _id,
        headline,
        description,
        buttonText,
        buttonLink,
        ctaType,
        style,
        active,
        image {
          alt,
          asset->{ _id, url }
        },
        "relatedProduct": relatedProduct->{
          title,
          "slug": slug.current,
          heroImage { asset->{ url } },
          pricing { isFree, price, currency }
        }
      }
    },
    seo
  }
`

// Get all blog post slugs for static generation
export const BLOG_SLUGS_QUERY = `
  *[_type == "blog" && defined(slug.current)] {
    "slug": slug.current
  }
`

// Get all blog categories
export const BLOG_CATEGORIES_QUERY = `
  *[_type == "blogCategory"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    color
  }
`

// Get featured blog posts (max 3)
export const FEATURED_BLOG_POSTS_QUERY = `
  *[_type == "blog" && isFeatured == true && defined(slug.current)] 
  | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    heroImage {
      alt,
      asset->{ _id, url }
    },
    "category": category->{ title, "slug": slug.current, color },
    readingTime,
    publishedAt
  }
`
