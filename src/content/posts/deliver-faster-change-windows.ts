import type { LocalPost } from './types'

const post: LocalPost = {
  slug: 'deliver-data-centre-build-faster-limited-change-windows',
  title: 'How we delivered a data-centre build 30% faster without more time on site',
  metaTitle: 'Delivering a data-centre build 30% faster with limited change windows',
  description:
    'Installation was limited to a few hours each Saturday. Here is how re-sequencing the work, not adding people, delivered a multi-exchange build about 30% faster than planned.',
  category: 'Delivery',
  tags: ['project delivery', 'data centre', 'change windows', 'infrastructure', 'product thinking'],
  publishedAt: '2026-11-16',
  readingTime: 5,
  shortAnswer:
    'When on-site time is the bottleneck, do less work on site. On a multi-exchange infrastructure build with installation limited to short Saturday windows, we configured equipment before it shipped, paid for faster freight, and split the installation into small packages. The build was delivered about 30% faster than its agreed baseline.',
  takeaway:
    'Find the scarcest resource in the plan, then ask of every task: does this have to use it? Most schedules are built around the order work is usually done in, not around the constraint.',
  related: { href: '/portfolio/exchange-connectivity-delivery', label: 'Case study: multi-exchange connectivity build' },
  body: [
    { type: 'h2', text: 'What was the constraint?' },
    {
      type: 'p',
      text: 'The project was an infrastructure and market-data connectivity build for a financial-services client at a data centre in Southeast Asia. The client needed low-latency access to several Asian exchanges.',
    },
    {
      type: 'p',
      text: 'We had no team on site. Third-party field engineers did the physical work, and large installation activities were allowed only in approved change windows, typically four to five hours on a Saturday. That rule exists to protect services already running in the facility, and it is common in exchange environments.',
    },
    { type: 'p', text: 'So the real limit was not people or budget. It was a few hours a week of permitted time on site.' },

    { type: 'h2', text: 'Why did the original plan put the deadline at risk?' },
    {
      type: 'p',
      text: 'The first plan followed the usual order: ship the equipment, wait for it to arrive, install it, configure it, test it. Every step after shipping needed a change window.',
    },
    {
      type: 'p',
      text: 'Freight was disrupted at the time. Standard shipping was estimated at three to four weeks, against a usual estimate of about one. In that plan, a late shipment pushes every later step to the next free Saturday. One delay becomes several.',
    },

    { type: 'h2', text: 'What did we change?' },
    { type: 'p', text: 'Three decisions, each moving work away from the change window.' },
    {
      type: 'ul',
      items: [
        '**Configure before dispatch.** Network engineering completed suitable configuration while the equipment was still in the United States. Work that would have used on-site hours was done before the boxes were sealed.',
        '**Pay for express air freight.** The equipment arrived in about seven business days.',
        '**Install in small packages.** I split the build into dependency-based work packages and scheduled each one when its materials, engineers and access lined up, including alongside other planned work at the same facility.',
      ],
    },
    {
      type: 'p',
      text: 'From about the second week, rack space, power and paperwork ran in parallel with equipment preparation, not after it.',
    },
    {
      type: 'table',
      caption: 'The original sequence and the one we used',
      head: ['Decision', 'Original plan', 'What we did'],
      rows: [
        ['Configuration', 'On site, after arrival', 'Before dispatch'],
        ['Freight', 'Standard, est. 3 to 4 weeks', 'Express air, about 7 business days'],
        ['Installation', 'A few large change windows', 'Small packages, as access allowed'],
        ['Site readiness', 'After equipment arrives', 'In parallel, from week two'],
      ],
    },

    { type: 'h2', text: 'What did it cost?' },
    {
      type: 'p',
      text: 'Two things: a higher freight bill, and more coordination. Many small packages need more tracking than three big installation days, across two time zones and several teams.',
    },
    {
      type: 'p',
      text: 'This is the part people skip when they tell delivery stories. The faster result was bought, not found. Whether the price was worth it depends on what a late delivery would have cost the client and the business.',
    },

    { type: 'h2', text: 'What was the result?' },
    {
      type: 'p',
      text: 'The build was delivered about 30% faster than the baseline timeline agreed for the project, which covered implementation and client testing. This is one project measured against its own plan, not an average across many.',
    },

    { type: 'h2', text: 'What would I do differently?' },
    {
      type: 'p',
      text: 'I would assess alternative sequences at the start, not under schedule pressure. On day one I would sort every task into three groups:',
    },
    {
      type: 'ol',
      items: [
        'Can be finished before shipment.',
        'Can run in parallel with something else.',
        'Truly needs a dedicated on-site window.',
      ],
    },
    { type: 'p', text: 'Only the third group belongs in the scarce hours.' },

    { type: 'h2', text: 'How would a product owner look at this?' },
    {
      type: 'p',
      text: 'A project manager asks how to deliver this build on time. A product owner asks why every build is not delivered this way.',
    },
    {
      type: 'p',
      text: 'Pre-dispatch configuration, an inventory check, site-readiness criteria and modular installation packages could be standard parts of the service. I would judge that model on five measures, not on speed alone: delivery lead time, first-time acceptance, installation rework, implementation cost and time to billable service.',
    },
  ],
}

export default post
