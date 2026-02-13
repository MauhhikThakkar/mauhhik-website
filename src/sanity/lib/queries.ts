/**
 * GROQ Queries for Sanity CMS
 * Centralized queries for consistent data fetching across the app
 */

// Basic projection for project list (without richText)
export const PROJECTS_QUERY = `
  *[_type == "project"]
  | order(_createdAt asc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    tags,
    coverImage,
    liveUrl,
    githubUrl
  }
`

// Lightweight query for metadata generation (only essential fields)
export const PROJECT_METADATA_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    coverImage {
      alt,
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    }
  }
`

// Complete projection for single project with richText image resolution
export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    shortDescription,
    coverImage {
      alt,
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    },
    "categories": categories[]->{ 
      title, 
      "slug": slug.current 
    },
    context[] {
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
    problem[] {
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
    solution[] {
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
    strategy[] {
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
    learnings[] {
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
    intendedImpact,
    successCriteria,
    keyAssumptions,
    tradeoffs[] {
      decision,
      tradeoff
    },
    whatThisDemonstrates,
    improvements {
      technicalIteration,
      gtmRefinement,
      metricsEvolution
    },
    goals[] {
      label,
      value,
      context
    },
    impact[] {
      label,
      value,
      context
    },
    wireframes[] {
      title,
      caption,
      image {
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
    featuredWireframes[] {
      title,
      caption,
      image {
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
    prototypeLink,
    "relatedBlogs": relatedBlogs[]->{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      readingTime,
      publishedAt,
      category->{
        title,
        "slug": slug.current,
        color
      }
    },
    "previousProject": *[_type == "project" && _createdAt < ^._createdAt] | order(_createdAt desc)[0] {
      title,
      "slug": slug.current
    },
    "nextProject": *[_type == "project" && _createdAt > ^._createdAt] | order(_createdAt asc)[0] {
      title,
      "slug": slug.current
    }
  }
`

// Query to get all project slugs (for static generation)
export const PROJECT_SLUGS_QUERY = `
  *[_type == "project" && defined(slug.current)][] {
    "slug": slug.current
  }
`
