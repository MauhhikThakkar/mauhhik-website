import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'The main title of the blog post',
      validation: (Rule) => Rule.required().max(120).warning('Keep titles under 120 characters for better SEO'),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'URL-friendly identifier (auto-generated from title)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'shortDescription',
      type: 'text',
      title: 'Short Description',
      description: 'Brief summary for previews and SEO meta descriptions (aim for 140-160 characters)',
      rows: 3,
      validation: (Rule) =>
        Rule.required()
          .min(80)
          .max(160)
          .warning('Keep between 80-160 characters for optimal SEO'),
    }),

    defineField({
      name: 'heroImage',
      type: 'image',
      title: 'Hero Image',
      description: 'Main image for the blog post (recommended: 1200x630px for social sharing)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the image for accessibility and SEO',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'content',
      type: 'richText',
      title: 'Content',
      description: 'Main blog post content with rich formatting',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tldr',
      type: 'text',
      title: 'TL;DR',
      description: 'One or two sentence key takeaway (what should readers remember?)',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: 'pmTakeaway',
      type: 'text',
      title: 'PM Takeaway (Optional)',
      description: 'How this insight applies to real-world product management (2-4 sentences)',
      rows: 3,
      validation: (Rule) => Rule.max(400).warning('Keep it focused - 2-4 sentences recommended.'),
    }),

    defineField({
      name: 'readingTime',
      type: 'number',
      title: 'Reading Time',
      description: 'Estimated reading time in minutes (auto-calculated based on ~200 words/min)',
      validation: (Rule) => Rule.required().min(1).max(60).integer(),
    }),

    defineField({
      name: 'category',
      type: 'reference',
      title: 'Category',
      description: 'Primary category for this post',
      to: [{ type: 'blogCategory' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      description: 'Keywords and topics (e.g., "product-market fit", "user research", "AI ethics")',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.max(10).warning('Consider using 3-7 tags for better organization'),
    }),

    defineField({
      name: 'relatedProjects',
      type: 'array',
      title: 'Related Case Studies',
      description: 'Link to relevant project case studies',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
      validation: (Rule) => Rule.max(3).warning('Limit to 3 related projects for focused recommendations'),
    }),

    defineField({
      name: 'ctas',
      type: 'object',
      title: 'Call-to-Action Blocks',
      description: 'Add CTAs for lead capture, product promotion, or content upgrades',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'inlineContent',
          type: 'reference',
          title: 'Inline CTA (Mid-Content)',
          description: 'Shows after ~50% of content (e.g., "Download the checklist")',
          to: [{ type: 'blogCTA' }],
        },
        {
          name: 'endOfPost',
          type: 'reference',
          title: 'End-of-Post CTA',
          description: 'Shows after article conclusion (e.g., newsletter signup, product pitch)',
          to: [{ type: 'blogCTA' }],
        },
        {
          name: 'customPosition',
          type: 'number',
          title: 'Custom Inline Position (%)',
          description: 'Override default 50% position (e.g., 25 = after 25% of content)',
          validation: (Rule) => Rule.min(0).max(100).integer(),
          initialValue: 50,
        },
      ],
    }),

    defineField({
      name: 'isFeatured',
      type: 'boolean',
      title: 'Featured Post',
      description: 'Show this post prominently on the blog homepage',
      initialValue: false,
    }),

    defineField({
      name: 'isEvergreen',
      type: 'boolean',
      title: 'Evergreen Content',
      description: 'Mark as timeless content (not date-sensitive)',
      initialValue: false,
    }),

    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published Date',
      description: 'When this post was or will be published',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    }),

    defineField({
      name: 'author',
      type: 'reference',
      title: 'Author',
      description: 'Post author (defaults to site owner)',
      to: [{ type: 'author' }],
      hidden: true, // Can enable if you add guest authors
    }),

    defineField({
      name: 'seo',
      type: 'object',
      title: 'SEO Settings',
      description: 'Advanced SEO options (optional overrides)',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
          description: 'Override default title for search engines',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          description: 'Override default description for search engines',
          rows: 2,
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'keywords',
          type: 'array',
          title: 'Focus Keywords',
          description: 'Target keywords for SEO (optional)',
          of: [{ type: 'string' }],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      media: 'heroImage',
      category: 'category.title',
      publishedAt: 'publishedAt',
      isFeatured: 'isFeatured',
    },
    prepare({ title, subtitle, media, category, publishedAt, isFeatured }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Draft'
      const featured = isFeatured ? '⭐ ' : ''
      return {
        title: `${featured}${title}`,
        subtitle: `${category || 'Uncategorized'} • ${date}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
