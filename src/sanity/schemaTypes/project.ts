import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    }),

    defineField({
      name: 'shortDescription',
      type: 'string',
    }),

    defineField({
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),

    defineField({
      name: 'context',
      type: 'richText',
    }),

    defineField({
      name: 'problem',
      type: 'richText',
    }),

    defineField({
      name: 'solution',
      type: 'richText',
    }),

    defineField({
      name: 'strategy',
      type: 'richText',
    }),

    defineField({
      name: 'learnings',
      type: 'richText',
    }),

    defineField({
      name: 'goals',
      type: 'array',
      of: [{ type: 'metric' }],
    }),

    defineField({
      name: 'impact',
      type: 'array',
      of: [{ type: 'metric' }],
    }),

    defineField({
      name: 'wireframes',
      type: 'array',
      title: 'Featured Wireframes',
      description: 'Curated wireframes to showcase in the case study',
      of: [{ type: 'wireframe' }],
    }),

    defineField({
      name: 'prototypeLink',
      type: 'url',
      title: 'Prototype Link',
      description: 'Link to interactive prototype (Figma, Framer, etc.)',
    }),

    defineField({
      name: 'relatedBlogs',
      type: 'array',
      title: 'Related Blog Posts',
      description: 'Blog posts that explore the thinking, frameworks, or concepts applied in this case study',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blog' }],
        },
      ],
    }),
  ],
})
