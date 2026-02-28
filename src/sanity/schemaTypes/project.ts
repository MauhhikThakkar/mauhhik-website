import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
    }),

    defineField({
      name: 'shortDescription',
      type: 'string',
    }),

    defineField({
      name: 'featured',
      type: 'boolean',
      title: 'Flagship / Featured',
      description: 'When true, this project appears only in the flagship section and is excluded from the general grid.',
      initialValue: false,
    }),

    defineField({
      name: 'categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),

    defineField({
      name: 'context',
      type: 'richText',
    }),

    defineField({
      name: 'problem',
      type: 'richText',
    }),

    defineField({
      name: 'solution',
      type: 'richText',
    }),

    defineField({
      name: 'strategy',
      type: 'richText',
    }),

    defineField({
      name: 'learnings',
      type: 'richText',
    }),

    defineField({
      name: 'goals',
      type: 'array',
      of: [{ type: 'metric' }],
    }),

    defineField({
      name: 'impact',
      type: 'array',
      of: [{ type: 'metric' }],
      description: '⚠️ Deprecated — do not use for certification-based projects. Use intendedImpact and successCriteria instead.',
      deprecated: {
        reason: 'This field implies real-world outcomes. For certification projects, use the new "Credibility & Judgment" fields below.',
      },
      hidden: false, // Keep visible for existing content but clearly marked as deprecated
    }),

    defineField({
      name: 'wireframes',
      type: 'array',
      title: 'Featured Wireframes',
      description: 'Curated wireframes to showcase in the case study',
      of: [{ type: 'wireframe' }],
    }),

    defineField({
      name: 'featuredWireframes',
      type: 'array',
      title: 'Featured Wireframes',
      description: 'Curated wireframes to showcase in the case study (legacy field name - use wireframes for new content)',
      of: [{ type: 'wireframe' }],
    }),

    defineField({
      name: 'prototypeLink',
      type: 'url',
      title: 'Prototype Link',
      description: 'Link to interactive prototype (Figma, Framer, etc.)',
    }),

    // Case Study Template Fields (reusable structure)
    defineField({
      name: 'targetUsers',
      type: 'richText',
      title: 'Target Users (ICP)',
      description: 'Ideal Customer Profile — who is this product for?',
    }),

    defineField({
      name: 'marketOpportunity',
      type: 'richText',
      title: 'Market Opportunity',
      description: 'Size of the opportunity and why now',
    }),

    defineField({
      name: 'productVision',
      type: 'richText',
      title: 'Product Vision & System Design',
      description: 'High-level vision and system design approach',
    }),

    defineField({
      name: 'architectureWorkflow',
      type: 'array',
      title: 'Architecture / Workflow Model',
      description: 'Structured visual blocks for flow, architecture, or process',
      of: [
        {
          type: 'object',
          name: 'workflowBlock',
          title: 'Workflow Block',
          fields: [
            { name: 'title', type: 'string', title: 'Block Title' },
            { name: 'description', type: 'text', title: 'Description', rows: 3 },
          ],
          preview: {
            select: { title: 'title' },
            prepare: ({ title }) => ({ title: title || 'Untitled block' }),
          },
        },
      ],
    }),

    defineField({
      name: 'mvpScope',
      type: 'richText',
      title: 'MVP Scope',
      description: 'What was in scope for the minimum viable product',
    }),

    defineField({
      name: 'monetizationStrategy',
      type: 'richText',
      title: 'Monetization Strategy',
      description: 'Revenue model and pricing approach',
    }),

    defineField({
      name: 'northStarMetric',
      type: 'string',
      title: 'North Star Metric',
      description: 'Primary success metric (e.g. "Daily active users")',
    }),

    defineField({
      name: 'relatedBlogs',
      type: 'array',
      title: 'Related Blog Posts',
      description: 'Blog posts that explore the thinking, frameworks, or concepts applied in this case study',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blog' }],
        },
      ],
    }),

    // Credibility & Judgment Fields
    // These fields emphasize intent, assumptions, trade-offs, and judgment
    // rather than real-world results or metrics
    defineField({
      name: 'intendedImpact',
      type: 'text',
      title: 'Intended Impact',
      description: 'What change this project was designed to create. Express intent, not real-world results. For certification projects, focus on the problem this solution was designed to address.',
      rows: 4,
      fieldset: 'credibilityAndJudgment',
    }),

    defineField({
      name: 'successCriteria',
      type: 'array',
      title: 'Success Criteria (If Shipped)',
      description: 'How success would be evaluated if this product were shipped in the real world. List specific signals or indicators that would be monitored (e.g., "response-time distribution", "escalation accuracy"). Do not include actual metrics or numbers.',
      of: [{ type: 'string' }],
      fieldset: 'credibilityAndJudgment',
    }),

    defineField({
      name: 'keyAssumptions',
      type: 'array',
      title: 'Key Assumptions',
      description: 'Hypotheses this solution depends on. These are assumptions, not facts. Explicitly state what would need to be validated in a real-world context (e.g., "ticket metadata quality is consistent across channels").',
      of: [{ type: 'string' }],
      fieldset: 'credibilityAndJudgment',
    }),

    defineField({
      name: 'tradeoffs',
      type: 'array',
      title: 'Trade-offs Considered',
      description: 'Key decisions made, including what was intentionally deprioritized. Show judgment by explaining why certain choices were made over others.',
      of: [
        {
          type: 'object',
          name: 'tradeoff',
          title: 'Trade-off',
          fields: [
            {
              name: 'decision',
              type: 'string',
              title: 'Decision',
              description: 'The decision or choice that was made',
            },
            {
              name: 'tradeoff',
              type: 'text',
              title: 'Trade-off',
              description: 'What was intentionally deprioritized or the reasoning behind this choice',
              rows: 3,
            },
          ],
          preview: {
            select: {
              title: 'decision',
              subtitle: 'tradeoff',
            },
          },
        },
      ],
      fieldset: 'credibilityAndJudgment',
    }),

    defineField({
      name: 'whatThisDemonstrates',
      type: 'text',
      title: 'What This Case Study Demonstrates',
      description: 'What this project shows about PM judgment, thinking, and decision-making. Focus on structured problem-solving, ethical restraint, and ability to operate under ambiguity.',
      rows: 4,
      fieldset: 'credibilityAndJudgment',
    }),

    defineField({
      name: 'improvements',
      type: 'object',
      title: 'What I Would Improve Today',
      description: 'Collapsible section for retrospective improvements',
      fields: [
        { name: 'technicalIteration', type: 'text', title: 'Technical Iteration', rows: 3 },
        { name: 'gtmRefinement', type: 'text', title: 'GTM Refinement', rows: 3 },
        { name: 'metricsEvolution', type: 'text', title: 'Metrics Evolution', rows: 3 },
      ],
    }),

    // Strategic Reflection & Next Iteration
    defineField({
      name: 'risksIdentified',
      type: 'array',
      title: 'Risks Identified',
      description: 'Key risks and uncertainties in the product approach',
      of: [{ type: 'string' }],
      fieldset: 'strategicReflection',
    }),

    defineField({
      name: 'v2Roadmap',
      type: 'array',
      title: 'What I Would Build Next (V2 Roadmap)',
      description: 'Prioritized next iteration items',
      of: [{ type: 'string' }],
      fieldset: 'strategicReflection',
    }),

    defineField({
      name: 'monetizationExpansion',
      type: 'text',
      title: 'Monetization Expansion Strategy',
      description: 'How revenue model would evolve beyond MVP',
      rows: 4,
      fieldset: 'strategicReflection',
    }),
  ],

  fieldsets: [
    {
      name: 'strategicReflection',
      title: 'Strategic Reflection & Next Iteration',
      description: 'Executive-level reflection on assumptions, trade-offs, risks, and future direction.',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
    {
      name: 'credibilityAndJudgment',
      title: 'Credibility & Judgment',
      description: 'These fields emphasize product thinking and decision quality. Use these for certification projects or when you want to demonstrate judgment without claiming real-world outcomes.',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
})
