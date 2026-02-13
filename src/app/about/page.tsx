import Link from "next/link"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: 'About',
  description: 'I build products in high-trust environments where clarity and judgment matter. Product Manager with experience across FinTech, SaaS, and AI-native execution.',
  url: '/about',
  imageAlt: 'Mauhhik — About',
})

export default function AboutPage() {
  return (
    <main className="bg-charcoal text-white min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
            About
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="border-b border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          <div className="text-zinc-300 text-[19px] leading-[1.7]">
            
            {/* Opening Thesis */}
            <div className="mb-16">
              <p className="text-2xl md:text-3xl font-semibold text-white mb-6 leading-relaxed">
                I build products in high-trust environments where clarity and judgment matter.
              </p>
              
              <p className="leading-relaxed mb-4">
                This isn&apos;t about features or velocity. It&apos;s about making decisions when requirements are incomplete, when constraints are real, and when the cost of being wrong is high. In fintech, enterprise platforms, and AI products, product judgment matters as much as execution speed.
              </p>

              <p className="leading-relaxed">
                I structure ambiguity rather than waiting for clarity. I make trade-offs explicit, validate assumptions systematically, and adjust course when evidence demands it. The discipline to reason through uncertainty—and the ability to ship products that work—are both necessary for effective product management.
              </p>
            </div>

            {/* Career Pattern */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                Career Pattern
              </h2>
              
              <p className="leading-relaxed mb-4">
                <strong className="text-white">FinTech → SaaS → AI-native execution.</strong> What connects the dots?
              </p>

              <p className="leading-relaxed mb-4">
                Each domain demands different skills, but they share a common requirement: operating in environments where trust, reliability, and judgment matter more than novelty. In fintech, regulatory compliance and risk management constrain the solution space. In enterprise SaaS, trust and reliability often outweigh feature velocity. In AI products, accuracy and reliability matter more than capability alone.
              </p>

              <p className="leading-relaxed mb-4">
                The pattern isn&apos;t about domain expertise—it&apos;s about product judgment under constraints. How do you make decisions when requirements are incomplete? How do you validate assumptions when data is limited? How do you balance user needs, business constraints, and risk when they exist in tension?
              </p>

              <p className="leading-relaxed">
                The answer: structured thinking, explicit trade-off evaluation, and systematic assumption validation. These skills transfer across domains because they&apos;re about reasoning through uncertainty, not domain-specific knowledge.
              </p>
            </div>

            {/* Operating Philosophy */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                Operating Philosophy
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                    Decision Discipline
                  </h3>
                  <p className="leading-relaxed">
                    I make trade-offs explicit, discuss them openly, and choose intentionally based on constraints and goals. The goal isn&apos;t avoiding trade-offs; it&apos;s making them consciously and documenting the reasoning so future decisions can reference that context. I structure ambiguity rather than waiting for clarity—defaulting to explicit hypotheses, defined success criteria, and learning loops that validate or invalidate assumptions quickly.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                    Metrics Rigor
                  </h3>
                  <p className="leading-relaxed">
                    I use data to inform judgment, not replace it. Quantitative signals validate direction, but I don&apos;t wait for perfect data to make decisions. I establish clear success metrics upfront and build tight feedback loops with users and stakeholders. The discipline to change course when evidence demands it matters more than being right initially.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                    AI Leverage
                  </h3>
                  <p className="leading-relaxed">
                    I leverage AI tools (Cursor, Claude, ChatGPT, Perplexity, Gamma) to accelerate development while maintaining quality and strategic focus. AI-first execution means using AI to handle routine tasks, generate options, and validate assumptions—freeing cognitive capacity for judgment, trade-off evaluation, and strategic decision-making. The goal isn&apos;t replacing human judgment; it&apos;s amplifying it.
                  </p>
                </div>
              </div>
            </div>

            {/* What I'm Exploring Now */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                What I&apos;m Exploring Now
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                    AI-First Product Workflows
                  </h3>
                  <p className="leading-relaxed">
                    How do product workflows change when AI is a first-class tool, not an afterthought? I&apos;m exploring how AI can accelerate discovery, validation, and execution—while maintaining the rigor and judgment required in high-trust environments. The question isn&apos;t whether AI will change product management; it&apos;s how to integrate it thoughtfully.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                    PM + AI Integration
                  </h3>
                  <p className="leading-relaxed">
                    What does product management look like when AI handles routine tasks and humans focus on judgment? I&apos;m experimenting with AI-assisted problem framing, assumption validation, and trade-off evaluation. The goal is to amplify product judgment, not replace it—using AI to generate options and validate assumptions, while humans make the strategic decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">
                    Strategic Experimentation
                  </h3>
                  <p className="leading-relaxed">
                    How do you experiment strategically in high-trust environments where the cost of being wrong is high? I&apos;m exploring minimal viable experiments that validate assumptions without compromising trust or reliability. The challenge is balancing learning speed with risk management—testing hypotheses quickly while maintaining the rigor required in regulated or trust-heavy domains.
                  </p>
                </div>
              </div>
            </div>

            {/* Let's Connect */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                Let&apos;s Connect
              </h2>
              
              <p className="leading-relaxed mb-6">
                I&apos;m available for PM roles and open to conversations about product strategy, decision-making under ambiguity, or building systems in complex domains. The best way to reach me is through email.
              </p>

              <div className="pt-8 border-t border-zinc-900">
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:hello@mauhhik.com"
                    className="text-zinc-300 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Email
                  </a>
                  <span className="text-zinc-600">•</span>
                  <a
                    href="https://www.linkedin.com/in/mauhhikthakkar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-white transition-colors underline underline-offset-4"
                  >
                    LinkedIn
                  </a>
                  <span className="text-zinc-600">•</span>
                  <Link
                    href="/blog"
                    className="text-zinc-300 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Writing
                  </Link>
                  <span className="text-zinc-600">•</span>
                  <Link
                    href="/portfolio"
                    className="text-zinc-300 hover:text-white transition-colors underline underline-offset-4"
                  >
                    Portfolio
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-32"></div>
    </main>
  )
}
