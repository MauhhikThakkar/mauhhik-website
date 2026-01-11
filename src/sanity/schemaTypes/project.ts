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
  ],
})
