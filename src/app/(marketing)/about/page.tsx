import Image from "next/image"
import CareerTimeline from "@/components/about/CareerTimeline"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: 'About',
  description: 'Project manager at Waypoint Trading Solutions with 9+ years across retail, data analytics and IT delivery, moving into product management.',
  url: '/about',
  imageAlt: 'Mauhhik — About',
})

export default function AboutPage() {
  return (
    <main className="bg-charcoal text-white min-h-screen">
      {/* Intro */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="site-container relative pb-16 pt-32 sm:pt-40 md:pb-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_18rem] lg:gap-16">
            <div>
              <p className="eyebrow mb-5">About</p>
              <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
                I manage delivery in financial infrastructure, and I am moving into product.
              </h1>
              <div className="mt-8 max-w-2xl">
                  <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                    I am a project manager at Waypoint Trading Solutions, where I deliver Secure SD-WAN deployments for tier-1 global exchanges across 10+ countries. Requirements arrive incomplete, the constraints are real, and the cost of being wrong is high.
                  </p>
                  <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                    Across 9+ years I have run a retail business, analysed customer data and managed IT delivery for startups and fintech clients. The questions I keep asking are product questions: who is this for, what problem does it solve, and how will we know it worked. This site shows how I answer them.
                  </p>
              </div>
            </div>
            <Image
              src="/images/mauhhik-thakkar.jpg"
              alt="Mauhhik Thakkar"
              width={288}
              height={288}
              priority
              className="order-first h-28 w-28 rounded-2xl border border-line-strong object-cover lg:order-none lg:h-72 lg:w-72"
            />
          </div>
        </div>
      </section>

      {/* Dated career history. Hidden until entries are added in src/content/profile.ts */}
      <CareerTimeline />

      <section className="border-b border-line" aria-labelledby="pattern-heading">
        <div className="site-container py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-4">Background</p>
              <h2 id="pattern-heading" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                How I got here
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                <strong className="text-white">Business first, then data, then delivery.</strong>
              </p>
              <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                I started in sales and operations, then founded and ran a multibrand sports footwear store. From 2019 I spent three years in data analytics, doing customer segmentation and business analysis for clients in retail, finance and manufacturing.
              </p>
              <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                Since 2022 I have managed IT delivery: client projects in fintech, gaming and AI/ML, in-house product development at a software firm, a product-based startup, and now global network deployments for exchanges.
              </p>
              <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                Product management draws on all three: commercial sense, evidence from data and the discipline to ship. I completed the ICPM Product Management Certification and the IBM AI Product Manager certificate, and I build concept products to practise the decisions the role requires.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="philosophy-heading">
        <div className="site-container py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-4">Principles</p>
              <h2 id="philosophy-heading" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Operating philosophy
              </h2>
            </div>
            <div className="max-w-2xl">
              <div className="divide-y divide-line border-y border-line">
                <div className="py-6">
                  <h3 className="text-lg font-medium text-white">Decision Discipline</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
                    I make trade-offs explicit, discuss them openly, and choose intentionally based on constraints and goals. The goal isn&apos;t avoiding trade-offs; it&apos;s making them consciously and documenting the reasoning so future decisions can reference that context. I structure ambiguity rather than waiting for clarity—defaulting to explicit hypotheses, defined success criteria, and learning loops that validate or invalidate assumptions quickly.
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-white">Metrics Rigor</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
                    I use data to inform judgment, not replace it. Quantitative signals validate direction, but I don&apos;t wait for perfect data to make decisions. I establish clear success metrics upfront and build tight feedback loops with users and stakeholders. The discipline to change course when evidence demands it matters more than being right initially.
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-white">AI Leverage</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
                    I leverage AI tools (Cursor, Claude, ChatGPT, Perplexity, Gamma) to accelerate development while maintaining quality and strategic focus. AI-first execution means using AI to handle routine tasks, generate options, and validate assumptions—freeing cognitive capacity for judgment, trade-off evaluation, and strategic decision-making. The goal isn&apos;t replacing human judgment; it&apos;s amplifying it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="exploring-heading">
        <div className="site-container py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-4">Now</p>
              <h2 id="exploring-heading" className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                What I&apos;m exploring
              </h2>
            </div>
            <div className="max-w-2xl">
              <div className="divide-y divide-line border-y border-line">
                <div className="py-6">
                  <h3 className="text-lg font-medium text-white">AI-First Product Workflows</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
                    How do product workflows change when AI is a first-class tool, not an afterthought? I&apos;m exploring how AI can accelerate discovery, validation, and execution—while maintaining the rigor and judgment required in high-trust environments. The question isn&apos;t whether AI will change product management; it&apos;s how to integrate it thoughtfully.
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-white">PM + AI Integration</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
                    What does product management look like when AI handles routine tasks and humans focus on judgment? I&apos;m experimenting with AI-assisted problem framing, assumption validation, and trade-off evaluation. The goal is to amplify product judgment, not replace it—using AI to generate options and validate assumptions, while humans make the strategic decisions.
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-white">Strategic Experimentation</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">
                    How do you experiment strategically in high-trust environments where the cost of being wrong is high? I&apos;m exploring minimal viable experiments that validate assumptions without compromising trust or reliability. The challenge is balancing learning speed with risk management—testing hypotheses quickly while maintaining the rigor required in regulated or trust-heavy domains.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
