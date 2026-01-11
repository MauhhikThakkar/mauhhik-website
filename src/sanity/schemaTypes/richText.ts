import { defineType } from 'sanity'

export default defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [
    { type: 'block' },
    {
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        },
      ],
    },
  ],
})
