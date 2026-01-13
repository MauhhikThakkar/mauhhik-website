import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Category Name',
      description: 'e.g., Product Strategy, UX Research, AI & ML',
      validation: (Rule) => Rule.required().max(50),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Brief description for category pages (optional)',
      rows: 2,
    }),

    defineField({
      name: 'color',
      type: 'string',
      title: 'Color',
      description: 'Hex color for category badges (e.g., #3b82f6)',
      validation: (Rule) =>
        Rule.regex(/^#[0-9A-Fa-f]{6}$/, {
          name: 'hex color',
          invert: false,
        }).error('Must be a valid hex color (e.g., #3b82f6)'),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
