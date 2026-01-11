import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'category',
  type: 'document',
  title: 'Category',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
  ],
})

