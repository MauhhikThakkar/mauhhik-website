import { defineType, defineField } from 'sanity'

/**
 * Digital Product Schema (V1)
 * 
 * Minimal schema for digital products.
 * No checkout logic - schema only.
 * 
 * Future versions may add:
 * - Pricing tiers
 * - Purchase links
 * - Delivery methods
 * - Analytics tracking
 */
export default defineType({
  name: 'productV1',
  title: 'Digital Product (V1)',
  type: 'document',
  description: 'Minimal digital product schema for courses, guides, templates, and tools',

  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Product name (e.g., "Product Strategy Playbook")',
      validation: (Rule) => Rule.required().max(100),
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
      description: 'SEO-friendly summary (1-2 sentences, 120-160 characters optimal)',
      rows: 2,
      validation: (Rule) => Rule.required().max(200).warning('Keep under 200 characters for best SEO results'),
    }),

    defineField({
      name: 'longDescription',
      type: 'richText',
      title: 'Long Description',
      description: 'Full product description with formatting (portable text)',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      description: 'Current state of the product',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Live', value: 'live' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'price',
      type: 'number',
      title: 'Price',
      description: 'Product price (optional for now - no checkout logic yet)',
      validation: (Rule) => Rule.min(0).precision(2),
    }),

    defineField({
      name: 'ctaText',
      type: 'string',
      title: 'CTA Text',
      description: 'Call-to-action button text (e.g., "Get Access", "Download Now")',
      initialValue: 'Get Access',
      validation: (Rule) => Rule.max(30).warning('Keep CTA text short and action-oriented'),
    }),

    defineField({
      name: 'relatedBlogPosts',
      type: 'array',
      title: 'Related Blog Posts',
      description: 'Link to relevant blog posts that provide context or deeper insights',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blog' }],
        },
      ],
      validation: (Rule) => Rule.max(5).warning('Limit to 3-5 related posts for focus'),
    }),
  ],

  orderings: [
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      status: 'status',
      price: 'price',
      shortDescription: 'shortDescription',
    },
    prepare({ title, status, price, shortDescription }) {
      const statusEmoji =
        status === 'live' ? '🟢' : status === 'archived' ? '⚫' : '⚪'
      const priceDisplay = price ? `$${price.toFixed(2)}` : 'Free'
      
      return {
        title: `${statusEmoji} ${title}`,
        subtitle: `${status || 'draft'} • ${priceDisplay} • ${shortDescription || 'No description'}`,
      }
    },
  },
})
