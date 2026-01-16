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
          <p className="text-xl sm:text-2xl text-zinc-400 leading-relaxed">
            Product Manager working at the intersection of AI, systems thinking, and execution.
          </p>
        </div>
      </section>

      {/* Content */}
      <Reveal>
        <section className="border-b border-zinc-900">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <div className="text-zinc-300 text-[19px] leading-[1.7]">
              
              {/* Short Intro */}
              <Reveal delay={0.1}>
                <div className="mb-16">
              <p className="leading-relaxed mb-4">
                I build products that solve real problems. Not features for features' sake, but systems that create measurable impact.
              </p>
              <p className="leading-relaxed">
                My work sits at the intersection of three things: understanding how AI changes what's possible, thinking in systems rather than silos, and executing with clarity in uncertain environments.
              </p>
            </div>
            </Reveal>

            {/* What I Believe */}
            <Reveal delay={0.2}>
              <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                What I believe about building products
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Systems over features
                  </h3>
                  <p className="leading-relaxed">
                    Products are systems, not collections of features. Every decision creates downstream effects. I map those connections before building, not after.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    AI amplifies judgment, doesn't replace it
                  </h3>
                  <p className="leading-relaxed">
                    The best AI products aren't about automation—they're about augmenting human judgment where it matters most. I focus on the seams: where AI handles scale, and humans handle nuance.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Uncertainty is the default state
                  </h3>
                  <p className="leading-relaxed">
                    Most product decisions happen with incomplete information. I build frameworks for making good decisions anyway: clear hypotheses, fast learning loops, and the discipline to change course when evidence demands it.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Impact over activity
                  </h3>
                  <p className="leading-relaxed">
                    Shipping isn't the goal. Solving problems is. I measure success by outcomes that matter to users and the business, not by velocity or feature count.
                  </p>
                </div>
              </div>
            </div>
            </Reveal>

            {/* What I'm Working On Now */}
            <Reveal delay={0.3}>
              <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                What I'm working on now
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Building AI-first products
                  </h3>
                  <p className="leading-relaxed">
                    Exploring how AI changes product architecture, user experience, and business models. Not just adding AI features, but rethinking what's possible when intelligence is a first-class capability.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Systems thinking for product teams
                  </h3>
                  <p className="leading-relaxed">
                    Developing frameworks and practices that help teams see the whole system—not just their slice. How do you make decisions that compound? How do you avoid local optimizations that hurt the whole?
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Execution in ambiguity
                  </h3>
                  <p className="leading-relaxed">
                    Learning how to move fast when the path isn't clear. Building products in spaces where requirements shift, technology evolves, and user needs emerge rather than being predefined.
                  </p>
                </div>
              </div>
            </div>
            </Reveal>

            {/* What This Site Is For */}
            <Reveal delay={0.4}>
              <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                What this site is for
              </h2>
              
              <p className="leading-relaxed mb-4">
                This is where I think out loud about product management, AI, and building things that matter.
              </p>
              
              <p className="leading-relaxed mb-4">
                You'll find case studies of products I've built, thoughts on product strategy, and frameworks I use to navigate uncertainty. The goal isn't to impress—it's to share what I've learned in a way that might be useful to others.
              </p>
              
              <p className="leading-relaxed">
                If you're building products at the intersection of AI and human judgment, or if you're trying to make better decisions in complex systems, some of this might resonate.
              </p>
            </div>
            </Reveal>

            {/* How to Connect */}
            <Reveal delay={0.5}>
              <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                How to connect or collaborate
              </h2>
              
              <p className="leading-relaxed mb-6">
                I'm open to conversations about product strategy, AI product development, or building systems that scale. Here's how to reach out:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    For product discussions
                  </h3>
                  <p className="leading-relaxed">
                    If you're working on something interesting at the intersection of AI and product, or if you're navigating similar challenges, I'd love to hear about it. Reach out via email or Twitter.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    For collaboration
                  </h3>
                  <p className="leading-relaxed">
                    I'm particularly interested in projects that combine AI capabilities with strong product thinking, or that require systems-level problem solving. If you're building something in that space, let's talk.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    For speaking or writing
                  </h3>
                  <p className="leading-relaxed">
                    I occasionally speak or write about product management, AI products, and systems thinking. If you're organizing an event or publication that aligns with these topics, I'm open to discussing opportunities.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-900">
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
