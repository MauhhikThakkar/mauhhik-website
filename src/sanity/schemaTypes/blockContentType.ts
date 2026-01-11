import { defineType } from 'sanity'

const blockContent = defineType({
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [{ type: 'block' }],
})

export default blockContent
