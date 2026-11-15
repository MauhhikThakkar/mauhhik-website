import Image from "next/image"
import CareerTimeline from "@/components/about/CareerTimeline"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: 'About',
  description: 'Project manager with experience across FinTech, SaaS, and AI-native execution, moving into product management. I work in high-trust environments where clarity and judgment matter.',
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
                I build products in high-trust environments where clarity and judgment matter.
              </h1>
              <div className="mt-8 max-w-2xl">
                  <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                    This isn&apos;t about features or velocity. It&apos;s about making decisions when requirements are incomplete, when constraints are real, and when the cost of being wrong is high. In fintech, enterprise platforms, and AI products, product judgment matters as much as execution speed.
                  </p>
                  <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                    I structure ambiguity rather than waiting for clarity. I make trade-offs explicit, validate assumptions systematically, and adjust course when evidence demands it. The discipline to reason through uncertainty—and the ability to ship products that work—are both necessary for effective product management.
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
                Career pattern
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                <strong className="text-white">FinTech → SaaS → AI-native execution.</strong> What connects the dots?
              </p>
              <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                Each domain demands different skills, but they share a common requirement: operating in environments where trust, reliability, and judgment matter more than novelty. In fintech, regulatory compliance and risk management constrain the solution space. In enterprise SaaS, trust and reliability often outweigh feature velocity. In AI products, accuracy and reliability matter more than capability alone.
              </p>
              <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                The pattern isn&apos;t about domain expertise—it&apos;s about product judgment under constraints. How do you make decisions when requirements are incomplete? How do you validate assumptions when data is limited? How do you balance user needs, business constraints, and risk when they exist in tension?
              </p>
              <p className="text-[17px] leading-[1.75] text-zinc-300 [&:not(:first-child)]:mt-5">
                The answer: structured thinking, explicit trade-off evaluation, and systematic assumption validation. These skills transfer across domains because they&apos;re about reasoning through uncertainty, not domain-specific knowledge.
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
