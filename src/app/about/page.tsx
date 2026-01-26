import Link from "next/link"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"
import Navbar from "@/components/Navbar"
import Reveal from "@/components/Reveal"

export const metadata = generateSEOMetadata({
  title: 'About',
  description: 'Product Manager working at the intersection of AI, systems thinking, and execution. Building products that solve real problems.',
  url: '/about',
  imageAlt: 'Mauhhik — About',
})

export default function AboutPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="border-b border-zinc-900">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
            About
          </h1>
        </div>
      </section>

      {/* Content */}
      <Reveal>
        <section className="border-b border-zinc-900">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <div className="text-zinc-300 text-[19px] leading-[1.7]">
              
              {/* How I Approach Product Decisions */}
              <Reveal delay={0.1}>
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    How I Approach Product Decisions
                  </h2>
                  
                  <p className="leading-relaxed mb-4">
                    Product decisions require clear problem framing before solution design. I start by mapping the system—understanding how decisions create downstream effects, where constraints exist, and what assumptions must hold for a solution to work. This systems view prevents solving symptoms instead of root causes.
                  </p>

                  <p className="leading-relaxed mb-4">
                    I structure ambiguity rather than waiting for clarity. In ambiguous situations, I default to explicit hypotheses, defined success criteria, and learning loops that validate or invalidate assumptions quickly. The discipline to change course when evidence demands it matters more than being right initially.
                  </p>

                  <p className="leading-relaxed">
                    Trade-offs are inevitable. I make them explicit, discuss them openly, and choose intentionally based on constraints and goals. The goal isn&apos;t avoiding trade-offs; it&apos;s making them consciously and documenting the reasoning so future decisions can reference that context.
                  </p>
                </div>
              </Reveal>

              {/* What Kinds of Problems I Work Best On */}
              <Reveal delay={0.2}>
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    What Kinds of Problems I Work Best On
                  </h2>
                  
                  <p className="leading-relaxed mb-4">
                    I work best on problems where requirements are incomplete, technology is evolving, and user needs emerge through use rather than being predefined. These are problems that require judgment, not just execution.
                  </p>

                  <p className="leading-relaxed mb-4">
                    Enterprise platforms and fintech products demand careful consideration of trust, compliance, and risk. AI products require balancing capability with reliability, speed with accuracy. These domains reward systematic thinking and explicit assumption validation.
                  </p>

                  <p className="leading-relaxed">
                    I&apos;m most effective when ambiguity is expected, when constraints are real and non-negotiable, and when the problem space benefits from structured thinking rather than rapid iteration alone. Problems where the cost of being wrong is high, and where product judgment matters as much as execution speed.
                  </p>
                </div>
              </Reveal>

              {/* How I Balance User Needs, Business Constraints, and Risk */}
              <Reveal delay={0.3}>
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    How I Balance User Needs, Business Constraints, and Risk
                  </h2>
                  
                  <p className="leading-relaxed mb-4">
                    User needs, business constraints, and risk exist in tension. The goal isn&apos;t optimizing for one dimension, but finding solutions that satisfy all three within acceptable bounds. This requires explicit prioritization and clear reasoning about what&apos;s non-negotiable versus what&apos;s flexible.
                  </p>

                  <p className="leading-relaxed mb-4">
                    I use data to inform judgment, not replace it. Quantitative signals validate direction, but I don&apos;t wait for perfect data to make decisions. In regulated or trust-heavy environments, risk considerations often constrain the solution space before user needs or business goals are fully explored. I account for this early, not as an afterthought.
                  </p>

                  <p className="leading-relaxed">
                    The balance shifts based on context. In fintech, regulatory compliance is non-negotiable. In enterprise software, trust and reliability often outweigh feature velocity. In AI products, accuracy and reliability matter more than novelty. I adjust the weighting based on domain constraints, not generic frameworks.
                  </p>
                </div>
              </Reveal>

              {/* What My Case Studies Represent */}
              <Reveal delay={0.4}>
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    What My Case Studies Represent
                  </h2>
                  
                  <p className="leading-relaxed mb-4">
                    My case studies include both certification-based projects and real-world product work. The certification projects demonstrate structured thinking under constraints—how I approach problems when requirements are incomplete, when assumptions must be validated, and when trade-offs need explicit evaluation.
                  </p>

                  <p className="leading-relaxed mb-4">
                    These projects show product judgment, not just execution. They demonstrate how I frame problems, evaluate options, and make decisions when outcomes are uncertain. The certification context provided rigor—forcing articulation of reasoning, explicit assumption validation, and clear trade-off evaluation.
                  </p>

                  <p className="leading-relaxed">
                    The real-world work demonstrates execution—taking product strategy and translating it into delivered software. Together, they show both thinking and doing: the ability to reason through ambiguity and the ability to ship products that users interact with. Both are necessary for effective product management.
                  </p>
                </div>
              </Reveal>

              {/* Let's Connect */}
              <Reveal delay={0.5}>
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
                        href="mailto:hello@mauhhik.dev"
                        className="text-zinc-300 hover:text-white transition-colors underline underline-offset-4"
                      >
                        Email
                      </a>
                      <span className="text-zinc-600">•</span>
                      <a
                        href="https://twitter.com/mauhhik"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-300 hover:text-white transition-colors underline underline-offset-4"
                      >
                        Twitter
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
              </Reveal>

            </div>
          </div>
        </section>
      </Reveal>

      {/* Bottom Spacing */}
      <div className="h-32"></div>
    </main>
  )
}
