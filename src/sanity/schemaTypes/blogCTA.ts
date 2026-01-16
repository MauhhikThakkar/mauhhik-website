import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogCTA',
  title: 'Blog CTA Block',
  type: 'document',
  description: 'Reusable call-to-action blocks for blog posts',

  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'CTA Title (Internal)',
      description: 'For organization in Sanity (e.g., "Newsletter Signup - Generic")',
      validation: (Rule) => Rule.required().max(60),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Unique identifier for this CTA',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'ctaType',
      type: 'string',
      title: 'CTA Type',
      description: 'Determines styling and behavior',
      options: {
        list: [
          { title: 'Content Upgrade', value: 'content-upgrade' },
          { title: 'Newsletter Signup', value: 'newsletter' },
          { title: 'Product Promotion', value: 'product' },
          { title: 'Course Promotion', value: 'course' },
          { title: 'Free Resource', value: 'free-resource' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'content-upgrade',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
      description: 'Main attention-grabbing text (e.g., "Want the checklist?")',
      validation: (Rule) => Rule.required().max(80),
    }),

    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Supporting text explaining the offer (1-2 sentences)',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: 'buttonText',
      type: 'string',
      title: 'Button Text',
      description: 'CTA button label (e.g., "Download Now", "Subscribe")',
      initialValue: 'Get Access',
      validation: (Rule) => Rule.required().max(30),
    }),

    defineField({
      name: 'buttonLink',
      type: 'url',
      title: 'Button Link',
      description: 'Where the button goes (external link, form, product page)',
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ['http', 'https', 'mailto'],
        }),
    }),

    defineField({
      name: 'relatedProduct',
      type: 'reference',
      to: [{ type: 'productV1' }],
      title: 'Related Product (Optional)',
      description: 'Link to a product document for automatic price/image display and "coming soon" status',
    }),

    defineField({
      name: 'relatedProject',
      type: 'reference',
      to: [{ type: 'project' }],
      title: 'Related Case Study (Optional)',
      description: 'Link to a case study/project for editorial context',
    }),

    defineField({
      name: 'image',
      type: 'image',
      title: 'CTA Image (Optional)',
      description: 'Visual element (product mockup, icon, preview)',
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
      name: 'style',
      type: 'string',
      title: 'Visual Style',
      description: 'How this CTA should appear',
      options: {
        list: [
          { title: 'Card (Default)', value: 'card' },
          { title: 'Banner', value: 'banner' },
          { title: 'Minimal', value: 'minimal' },
          { title: 'Feature Box', value: 'feature' },
        ],
        layout: 'radio',
      },
      initialValue: 'card',
    }),

    defineField({
      name: 'position',
      type: 'string',
      title: 'Default Position',
      description: 'Suggested placement (can be overridden per post)',
      options: {
        list: [
          { title: 'Inline (Mid-Content)', value: 'inline' },
          { title: 'End of Post', value: 'end' },
          { title: 'Sidebar (Future)', value: 'sidebar' },
        ],
        layout: 'radio',
      },
      initialValue: 'end',
    }),

    defineField({
      name: 'showOnMobile',
      type: 'boolean',
      title: 'Show on Mobile',
      description: 'Display this CTA on mobile devices',
      initialValue: true,
    }),

    defineField({
      name: 'priority',
      type: 'number',
      title: 'Priority',
      description: 'Higher numbers appear first if multiple CTAs exist',
      initialValue: 0,
      validation: (Rule) => Rule.integer().min(0).max(100),
    }),

    defineField({
      name: 'active',
      type: 'boolean',
      title: 'Active',
      description: 'Enable/disable this CTA globally',
      initialValue: true,
    }),

    defineField({
      name: 'metadata',
      type: 'object',
      title: 'Tracking & Metadata',
      description: 'Analytics and performance tracking',
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        {
          name: 'trackingId',
          type: 'string',
          title: 'Tracking ID',
          description: 'For analytics (e.g., Google Analytics event ID)',
        },
        {
          name: 'conversionGoal',
          type: 'string',
          title: 'Conversion Goal',
          description: 'What action defines success (e.g., "email-signup", "product-click")',
        },
        {
          name: 'notes',
          type: 'text',
          title: 'Internal Notes',
          rows: 2,
          description: 'Context for your team (not displayed publicly)',
        },
      ],
    }),
  ],

  orderings: [
    {
      title: 'Priority (High to Low)',
      name: 'priorityDesc',
      by: [{ field: 'priority', direction: 'desc' }],
    },
    {
      title: 'CTA Type',
      name: 'ctaType',
      by: [{ field: 'ctaType', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'headline',
      subtitle: 'ctaType',
      description: 'description',
      active: 'active',
      priority: 'priority',
      media: 'image',
    },
    prepare({ title, subtitle, description, active, priority, media }) {
      const statusIcon = active ? '🟢' : '⚫'
      const priorityBadge = priority > 0 ? ` [P${priority}]` : ''
      const typeLabel = subtitle
        ? subtitle
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : 'CTA'

      return {
        title: `${statusIcon} ${title}${priorityBadge}`,
        subtitle: `${typeLabel} • ${description || 'No description'}`,
        media,
      }
    },
  },
})
