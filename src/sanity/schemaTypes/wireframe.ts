import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'wireframe',
  title: 'Wireframe',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Screen or feature name',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Wireframe Image',
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
    defineField({
      name: 'caption',
      type: 'text',
      title: 'Caption',
      description: 'Brief description of this wireframe',
      rows: 2,
    }),
  ],
})
