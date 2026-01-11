import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'metric',
  title: 'Metric',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Label',
    }),
    defineField({
      name: 'value',
      type: 'string',
      title: 'Value',
    }),
    defineField({
      name: 'context',
      type: 'string',
      title: 'Context',
    }),
  ],
})
