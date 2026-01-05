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
