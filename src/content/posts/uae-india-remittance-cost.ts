import type { LocalPost } from './types'

const RBI = 'https://rbi.org.in/Scripts/BS_ViewBulletin.aspx?Id=23260'

const post: LocalPost = {
  slug: 'uae-to-india-remittance-where-sender-loses-money',
  title: 'Sending money from the UAE to India: where the sender loses money',
  metaTitle: 'UAE to India remittance: where the sender loses money',
  description:
    'The fee is the part you see. The exchange-rate margin is the part you do not. A product view of what a UAE to India transfer costs, with RBI figures.',
  category: 'Payments',
  tags: ['remittance', 'UAE to India', 'cross-border payments', 'fintech', 'exchange rate', 'product design'],
  publishedAt: '2026-11-16',
  readingTime: 6,
  shortAnswer:
    'A sender loses money in two places: the fee, which is shown, and the exchange-rate margin, which usually is not. The Reserve Bank of India puts the average cost of sending $200 to India at 4.9%. For a product team, the fix is to show the amount the recipient will receive before the sender commits.',
  takeaway:
    'In remittance, the number that matters to the user is the amount received. A product that leads with that number, and holds to it, earns trust that a low headline fee does not.',
  related: { href: '/portfolio/remitflow', label: 'Concept case study: RemitFlow' },
  body: [
    { type: 'h2', text: 'How big is the UAE to India corridor?' },
    {
      type: 'p',
      text: `The UAE is the second-largest source of remittances to India. In the [Reserve Bank of India's remittances survey for 2023-24](${RBI}), the UAE accounted for 19.2% of India's inward remittances, behind the United States at 27.7%. Total inward remittances that year were US$118.7 billion.`,
    },
    {
      type: 'p',
      text: 'Much of this money is sent regularly, in modest amounts, to support a family. That makes cost and predictability matter more here than in most payment products.',
    },

    { type: 'h2', text: 'What does a transfer cost?' },
    {
      type: 'table',
      caption: 'Cost of sending US$200, from the RBI article',
      head: ['Measure', 'Cost'],
      rows: [
        ['Average cost of sending to India (2023)', '4.9%'],
        ['Global average (Q2 2024)', '6.65%'],
        ['UN Sustainable Development Goal target for 2030', '3%'],
      ],
    },
    {
      type: 'p',
      text: 'India is cheaper to send to than the world average, and still above the target. The same survey found that transfers under US$200 carried the highest weighted average cost of any size bracket. The people sending the least pay the most per dirham.',
    },

    { type: 'h2', text: 'Where does the money go?' },
    { type: 'p', text: 'A transfer has two prices.' },
    {
      type: 'ul',
      items: [
        '**The fee.** A fixed or percentage charge, shown at checkout.',
        '**The exchange-rate margin.** The gap between the market rate and the rate the provider gives you. It is built into the rate, so it never appears as a line item.',
      ],
    },
    {
      type: 'p',
      text: 'A provider can advertise zero fees and still earn on the margin. The sender sees "free" and the recipient gets fewer rupees.',
    },

    { type: 'h2', text: 'Why does the sender not notice?' },
    {
      type: 'p',
      text: 'Because the comparison is hard. To work out the true cost, a sender has to find the market rate, compare it with the offered rate, and add the fee. Few people do that on a phone, on a monthly errand.',
    },
    { type: 'p', text: 'The product shows the fee because it is small. It leaves out the total because it is not.' },

    { type: 'h2', text: 'What should a product do differently?' },
    {
      type: 'p',
      text: 'I explored this in a concept project called [RemitFlow](/portfolio/remitflow). Four decisions came out of it.',
    },
    {
      type: 'ol',
      items: [
        '**Lead with the amount received.** Show the rupees that will arrive before anything else.',
        '**Show the total cost as one number.** Fee and margin together, in dirhams.',
        '**Say when the money will arrive.** A stated time the product keeps is worth more than "instant" that sometimes is not.',
        '**Make the repeat transfer one step.** Most senders pay the same person again and again.',
      ],
    },
    {
      type: 'p',
      text: 'Each has a cost. Showing the margin makes the product look more expensive than a competitor that hides it. I think the trade is worth it for a repeat-use product, where trust compounds.',
    },
    { type: 'note', text: 'That last point is a hypothesis. RemitFlow is a concept prototype and I have not tested it with users.' },

    { type: 'h2', text: 'What is changing in this corridor?' },
    {
      type: 'p',
      text: 'Digital channels now carry most of the flow. The RBI survey found that about 73.5% of remittances handled by money transfer operators were received digitally in 2023-24, and 76.1% of remittances from the UAE were digital.',
    },
    {
      type: 'p',
      text: 'India’s NPCI International and the UAE’s Al Etihad Payments signed an agreement in October 2023 which, according to press reports at the time, aims at real-time, lower-cost cross-border remittances. I have not confirmed how much of that is live for person-to-person transfers today.',
    },
    {
      type: 'p',
      text: 'Faster rails will cut settlement time. They will not, alone, make the price visible. That part is a product decision.',
    },

    { type: 'h2', text: 'Sources' },
    {
      type: 'ul',
      items: [
        `[Reserve Bank of India Bulletin, March 2025: Changing Dynamics of India's Remittances, Insights from the Sixth Round of India's Remittances Survey](${RBI})`,
      ],
    },
  ],
}

export default post
