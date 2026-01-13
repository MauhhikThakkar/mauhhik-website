import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Digital Product',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Product Name',
      description: 'Clear, specific name (e.g., "Product Strategy Playbook" not "Strategy Guide")',
      validation: (Rule) => Rule.required().max(80),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'URL-friendly identifier',
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
      description: 'One or two sentence value proposition (what problem does this solve?)',
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
    }),

    defineField({
      name: 'detailedDescription',
      type: 'richText',
      title: 'Detailed Description',
      description: 'Full product description: what it is, who it\'s for, why it exists, what you\'ll learn',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'heroImage',
      type: 'image',
      title: 'Hero Image',
      description: 'Product cover or preview (recommended: 1200x900px)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the image for accessibility',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'productType',
      type: 'string',
      title: 'Product Type',
      description: 'What kind of digital product is this?',
      options: {
        list: [
          { title: 'Guide', value: 'guide' },
          { title: 'Template', value: 'template' },
          { title: 'Course', value: 'course' },
          { title: 'Toolkit', value: 'toolkit' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'pricing',
      type: 'object',
      title: 'Pricing',
      description: 'Product pricing details',
      fields: [
        {
          name: 'isFree',
          type: 'boolean',
          title: 'Free Product',
          description: 'Mark as free (will override price)',
          initialValue: false,
        },
        {
          name: 'price',
          type: 'number',
          title: 'Price',
          description: 'Product price (set to 0 if free)',
          validation: (Rule) =>
            Rule.required()
              .min(0)
              .precision(2)
              .custom((price, context) => {
                const isFree = (context.parent as any)?.isFree
                if (isFree && price !== 0) {
                  return 'Price must be 0 for free products'
                }
                if (!isFree && price === 0) {
                  return 'Consider marking this as a free product'
                }
                return true
              }),
        },
        {
          name: 'currency',
          type: 'string',
          title: 'Currency',
          description: 'Three-letter currency code',
          initialValue: 'USD',
          options: {
            list: [
              { title: 'USD ($)', value: 'USD' },
              { title: 'EUR (€)', value: 'EUR' },
              { title: 'GBP (£)', value: 'GBP' },
              { title: 'AED (د.إ)', value: 'AED' },
            ],
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'originalPrice',
          type: 'number',
          title: 'Original Price (Optional)',
          description: 'Show strikethrough pricing (e.g., for launch discounts)',
          validation: (Rule) => Rule.min(0).precision(2),
        },
      ],
    }),

    defineField({
      name: 'purchaseLink',
      type: 'url',
      title: 'Purchase Link',
      description: 'Gumroad, Stripe, or payment platform URL',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'includedItems',
      type: 'array',
      title: 'What\'s Included',
      description: 'Specific deliverables (e.g., "50-page PDF", "Figma template", "Video walkthroughs")',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.min(1)
          .max(12)
          .warning('List 3-8 key items for clarity'),
    }),

    defineField({
      name: 'idealFor',
      type: 'array',
      title: 'Ideal For',
      description: 'Who should buy this? (e.g., "Early-stage PMs", "UX Researchers transitioning to product")',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.max(6).warning('Limit to 3-5 target personas for focus'),
    }),

    defineField({
      name: 'learningOutcomes',
      type: 'array',
      title: 'Learning Outcomes',
      description: 'What will buyers be able to do after using this? (Skills, frameworks, decisions)',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.max(8).warning('Focus on 3-6 key outcomes'),
    }),

    defineField({
      name: 'previewSamples',
      type: 'array',
      title: 'Preview Samples',
      description: 'Sample pages, screenshots, or preview assets to build trust',
      of: [
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    defineField({
      name: 'testimonials',
      type: 'array',
      title: 'Testimonials',
      description: 'Social proof from customers (optional)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'quote',
              type: 'text',
              title: 'Quote',
              rows: 3,
              validation: (Rule) => Rule.required().max(300),
            },
            {
              name: 'author',
              type: 'string',
              title: 'Author Name',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'role',
              type: 'string',
              title: 'Role/Company',
              description: 'e.g., "Senior PM at Amazon"',
            },
            {
              name: 'avatar',
              type: 'image',
              title: 'Avatar',
            },
          ],
          preview: {
            select: {
              title: 'author',
              subtitle: 'role',
              media: 'avatar',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),

    defineField({
      name: 'relatedBlogs',
      type: 'array',
      title: 'Related Blog Posts',
      description: 'Link to relevant articles that provide context or additional value',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blog' }],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    defineField({
      name: 'relatedProjects',
      type: 'array',
      title: 'Related Case Studies',
      description: 'Link to projects that show this methodology in action',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
      validation: (Rule) => Rule.max(2),
    }),

    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Featured Product',
      description: 'Highlight on products page or homepage',
      initialValue: false,
    }),

    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      description: 'Product availability status',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Live', value: 'live' },
          { title: 'Coming Soon', value: 'coming-soon' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'launchDate',
      type: 'datetime',
      title: 'Launch Date',
      description: 'When this product was or will be available',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
    }),

    defineField({
      name: 'metadata',
      type: 'object',
      title: 'Metadata & Tracking',
      description: 'Internal tracking and future functionality',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'sku',
          type: 'string',
          title: 'SKU',
          description: 'Internal product identifier',
        },
        {
          name: 'totalSales',
          type: 'number',
          title: 'Total Sales',
          description: 'Track total sales (can be updated manually or via automation)',
          initialValue: 0,
          readOnly: true,
        },
        {
          name: 'downloadCount',
          type: 'number',
          title: 'Download Count',
          description: 'Track downloads for free products',
          initialValue: 0,
          readOnly: true,
        },
        {
          name: 'bundleEligible',
          type: 'boolean',
          title: 'Bundle Eligible',
          description: 'Can this product be included in bundles?',
          initialValue: true,
        },
        {
          name: 'tags',
          type: 'array',
          title: 'Internal Tags',
          description: 'For filtering and organization',
          of: [{ type: 'string' }],
        },
      ],
    }),

    defineField({
      name: 'seo',
      type: 'object',
      title: 'SEO Settings',
      description: 'Search engine optimization',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Meta Description',
          rows: 2,
          validation: (Rule) => Rule.max(160),
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
      media: 'heroImage',
      productType: 'productType',
      price: 'pricing.price',
      isFree: 'pricing.isFree',
      currency: 'pricing.currency',
      status: 'status',
      featured: 'featured',
    },
    prepare({ title, subtitle, media, productType, price, isFree, currency, status, featured }) {
      const type = productType ? productType.charAt(0).toUpperCase() + productType.slice(1) : 'Product'
      const priceDisplay = isFree ? 'Free' : `${currency} ${price}`
      const statusIcon = status === 'live' ? '🟢' : status === 'draft' ? '⚪' : status === 'coming-soon' ? '🟡' : '⚫'
      const featuredIcon = featured ? '⭐ ' : ''
      
      return {
        title: `${featuredIcon}${title}`,
        subtitle: `${statusIcon} ${type} • ${priceDisplay}`,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Status',
      name: 'statusOrder',
      by: [
        { field: 'status', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'launchDate', direction: 'desc' },
      ],
    },
    {
      title: 'Price, Low to High',
      name: 'priceAsc',
      by: [{ field: 'pricing.price', direction: 'asc' }],
    },
    {
      title: 'Price, High to Low',
      name: 'priceDesc',
      by: [{ field: 'pricing.price', direction: 'desc' }],
    },
  ],
})
