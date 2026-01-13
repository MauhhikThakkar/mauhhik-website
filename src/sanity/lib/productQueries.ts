/**
 * GROQ Queries for Digital Products (V1)
 */

// Get all product slugs for static generation
export const PRODUCT_SLUGS_QUERY = `
  *[_type == "productV1" && defined(slug.current)] {
    "slug": slug.current
  }
`

// Get single product by slug
export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "productV1" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    longDescription,
    status,
    price,
    ctaText,
    "relatedBlogPosts": relatedBlogPosts[]->{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      heroImage {
        alt,
        asset->{
          _id,
          url
        }
      }
    }
  }
`

// Get all live products (for listing page, if needed)
export const LIVE_PRODUCTS_QUERY = `
  *[_type == "productV1" && status == "live" && defined(slug.current)] 
  | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    status,
    price,
    ctaText
  }
`
