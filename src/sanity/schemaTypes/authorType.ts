import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  type: 'document',
  title: 'Author',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      type: 'text',
      title: 'Short Bio',
      description: 'Brief author bio (1-2 sentences)',
      rows: 2,
      validation: (Rule) => Rule.max(200).warning('Keep bio concise for attribution box'),
    }),
    defineField({
      name: 'portfolioLink',
      type: 'url',
      title: 'Portfolio/About Link',
      description: 'Link to author portfolio, about page, or profile',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'picture',
      type: 'image',
      title: 'Author Picture',
      description: 'Author profile picture (optional)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'bio',
      media: 'picture',
    },
  },
})
