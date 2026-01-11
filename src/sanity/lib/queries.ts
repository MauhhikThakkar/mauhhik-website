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

// Complete projection for single project with richText image resolution
export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    shortDescription,
    "categories": categories[]->{ 
      title, 
      "slug": slug.current 
    },
    context[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    problem[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    solution[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    strategy[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    },
    learnings[] {
      ...,
      _type == "image" => {
        ...,
        asset->
      }
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
