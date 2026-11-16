import type { LocalPost } from './types'

const Y = 'Yes'
const N = 'No'

const post: LocalPost = {
  slug: 'project-manager-to-product-owner-uae-singapore-job-postings',
  title: 'Project manager to product owner in the UAE and Singapore: what 18 job postings ask for',
  metaTitle: 'Project manager to product owner in the UAE and Singapore: what postings ask for',
  description:
    'I tallied 18 product owner and product manager postings in Dubai and Singapore. All 18 ask for stakeholder management. Eight accept people without a product title.',
  category: 'Career',
  tags: ['product owner', 'product manager', 'UAE jobs', 'Singapore jobs', 'career change', 'project manager'],
  publishedAt: '2026-11-16',
  readingTime: 6,
  shortAnswer:
    'In 18 product postings from Dubai and Singapore, all 18 asked for stakeholder management and 17 for backlog or roadmap prioritisation, which project managers already do. Sixteen asked for knowledge of a specific domain. Ten required previous experience in a product role; the other eight accepted adjacent backgrounds.',
  takeaway:
    'Apply where your delivery domain is the requirement and the posting accepts adjacent experience. In this sample that was 8 of 18 roles, and 7 of those were in Singapore.',
  related: { href: '/portfolio', label: 'My delivery and product case studies' },
  body: [
    { type: 'h2', text: 'How did I collect the data?' },
    {
      type: 'p',
      text: 'On 16 November 2026 I searched Indeed for product owner, technical product owner and payments product manager roles in Dubai and Singapore. I kept the postings that were product roles in those locations, 9 in each, and recorded whether each one asked for eight things. I used an AI assistant to help collect and tally the postings. The full tally is at the end.',
    },
    {
      type: 'note',
      text: 'Eighteen postings is a small sample from one job site on one day. It shows a pattern, not the market.',
    },

    { type: 'h2', text: 'What do the postings ask for?' },
    {
      type: 'table',
      caption: 'Postings that mention each requirement, out of 18',
      head: ['Requirement', 'Postings'],
      rows: [
        ['Stakeholder management across functions', '18'],
        ['Backlog or roadmap prioritisation', '17'],
        ['Knowledge of a specific domain, such as payments, banking or exchanges', '16'],
        ['Defining and tracking success metrics', '13'],
        ['Agile or Scrum delivery, named explicitly', '11'],
        ['Writing user stories, acceptance criteria or specifications', '10'],
        ['Previous experience in a product role, as a stated requirement', '10'],
        ['User research or discovery', '7'],
      ],
    },

    { type: 'h2', text: 'What does a project manager already have?' },
    { type: 'p', text: 'The two most common requirements are a project manager’s daily work.' },
    {
      type: 'p',
      text: '**Stakeholder management.** Every posting asks for it. On one delivery I coordinate engineering, sales, product, a head office in another time zone and third-party field engineers.',
    },
    {
      type: 'p',
      text: '**Prioritisation and delivery discipline.** Seventeen postings ask for backlog or roadmap prioritisation, and 11 name Agile or Scrum. Sequencing work against dependencies and risk is the job I do now.',
    },
    {
      type: 'p',
      text: '**Domain knowledge.** Sixteen postings want it. This is where a delivery background is an asset: several postings said domain experience was mandatory, not preferred.',
    },

    { type: 'h2', text: 'What is missing, and how am I closing it?' },
    { type: 'p', text: 'Three requirements are things a delivery role does not hand you.' },
    {
      type: 'ul',
      items: [
        '**Success metrics (13 postings).** Delivery is measured on time and quality. Product is measured on what changed for the user. I now add an outcome measure to every delivery write-up.',
        '**Writing specifications (10 postings).** User stories and acceptance criteria. I did this on a fintech product at a software firm, and I practise it in concept case studies.',
        '**Discovery (7 postings).** The least requested, and the hardest to show. My evidence is [in-person interviews with bank managers for a lending product](/portfolio/bank-loan-assessment-mvp).',
      ],
    },
    {
      type: 'p',
      text: 'I am also preparing for the Scrum.org PSPO I assessment. Only 3 of the 18 postings mentioned a product certification, so I treat it as a foundation, not a ticket.',
    },

    { type: 'h2', text: 'Do you need a product title to apply?' },
    {
      type: 'p',
      text: 'Ten postings required previous experience as a product owner or product manager. The other eight accepted adjacent backgrounds, in their own words: technical program management, business analysis, engineering, implementation, or "related IT roles".',
    },
    {
      type: 'p',
      text: 'So 8 of the 18 were open to a project manager on paper. A posting that lists delivery or business analysis as acceptable experience is telling you who it will interview.',
    },

    { type: 'h2', text: 'Did Dubai and Singapore differ?' },
    {
      type: 'p',
      text: 'In this sample, yes. Eight of the 9 Dubai postings required a previous product title. Only 2 of the 9 Singapore postings did; the rest accepted adjacent experience.',
    },
    {
      type: 'p',
      text: 'Nine postings per city is too few to call this a rule. It is a reason to read Singapore postings closely, and to look in Dubai for the roles that put domain knowledge first.',
    },

    { type: 'h2', text: 'What would I tell another project manager?' },
    {
      type: 'ol',
      items: [
        'Count before you conclude. Eighteen postings read closely told me more than hundreds skimmed.',
        'Filter for postings that accept adjacent backgrounds. They exist, and they say so.',
        'Write up one real delivery as a case study, with the trade-off and the result.',
        'Lead with your domain. It was requested almost as often as prioritisation.',
      ],
    },

    { type: 'h2', text: 'The full tally' },
    {
      type: 'p',
      text: 'Columns: prioritisation (Pri), stakeholder management (Stk), Agile or Scrum named (Agl), domain knowledge (Dom), writing specifications (Spc), success metrics (Met), discovery (Dis), previous product title required (Ttl). Postings were live on Indeed on 16 November 2026 and may since have closed.',
    },
    {
      type: 'table',
      head: ['Posting', 'City', 'Pri', 'Stk', 'Agl', 'Dom', 'Spc', 'Met', 'Dis', 'Ttl'],
      rows: [
        ['Senior Product Owner, SBS', 'Dubai', Y, Y, N, Y, Y, Y, Y, Y],
        ['Product Owner, UNIQPAY', 'Dubai', Y, Y, Y, Y, Y, Y, Y, Y],
        ['Technical Product Manager, PaymentGenes', 'Dubai', Y, Y, Y, Y, Y, N, Y, Y],
        ['Technical Product Owner, Emirates Group', 'Dubai', Y, Y, Y, Y, Y, Y, N, Y],
        ['Technical Product Manager, Emirates Group', 'Dubai', Y, Y, Y, Y, N, Y, N, Y],
        ['Product Owner, Psdigital', 'Dubai', Y, Y, Y, N, Y, N, N, Y],
        ['AI Product Owner, Fuse Energy', 'Dubai', Y, Y, N, N, N, Y, N, N],
        ['Product Manager, eCommerce Payments, SynraPay', 'Dubai', Y, Y, Y, Y, Y, Y, N, Y],
        ['Senior Product Manager, Sokin', 'Dubai', Y, Y, N, Y, N, Y, Y, Y],
        ['Product Owner, Razer Pay', 'Singapore', Y, Y, Y, Y, Y, Y, Y, N],
        ['Product Owner cum Delivery Manager, Smart IMS', 'Singapore', Y, Y, Y, Y, Y, N, N, N],
        ['VP, Technical Product Owner, SGX', 'Singapore', Y, Y, N, Y, Y, Y, Y, N],
        ['Technical Product Owner, Resmed', 'Singapore', Y, Y, Y, Y, N, Y, N, N],
        ['Senior Technical Product Owner, Bluemont', 'Singapore', Y, Y, Y, Y, N, N, N, N],
        ['Senior Product Owner, Yara', 'Singapore', Y, Y, Y, Y, Y, Y, N, Y],
        ['Sr Product Manager, Payments, Fiserv', 'Singapore', N, Y, N, Y, N, Y, N, N],
        ['Senior Payments Product Manager, ALMR', 'Singapore', Y, Y, N, Y, N, Y, Y, Y],
        ['Liquidity Product Manager, JPMorganChase', 'Singapore', Y, Y, N, Y, N, N, N, N],
      ],
    },
    {
      type: 'note',
      text: 'Some marks are judgement calls. I counted "own the roadmap" as prioritisation, and did not count "gather merchant feedback" as discovery.',
    },
  ],
}

export default post
