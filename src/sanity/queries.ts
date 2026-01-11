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

export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    "categories": categories[]->{ title, slug },
    context,
    problem,
    solution,
    strategy,
    learnings,
    goals[] {
      label,
      value,
      context
    },
    impact[] {
      label,
      value,
      context
    }
  }
`

export const PROJECT_SLUGS_QUERY = `
  *[_type == "project" && defined(slug.current)][] {
    "slug": slug.current
  }
`