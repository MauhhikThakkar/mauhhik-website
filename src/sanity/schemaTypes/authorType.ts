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
    }),
  ],
})
