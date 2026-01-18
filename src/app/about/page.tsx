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
            Product thinking in practice
          </h1>
        </div>
      </section>

      {/* Content */}
      <Reveal>
        <section className="border-b border-zinc-900">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <div className="text-zinc-300 text-[19px] leading-[1.7]">
              
              {/* Intro Section */}
              <Reveal delay={0.1}>
                <div className="mb-16">
                  <p className="leading-relaxed mb-4">
                    I&apos;m a Product Manager who builds products to understand how products actually work. The best way to develop product judgment is to face the constraints, tradeoffs, and ambiguity that real product work demands.
                  </p>
                  <p className="leading-relaxed">
                    I work on problems where requirements are incomplete, technology is evolving, and user needs emerge through use rather than being predefined. My focus is translating product strategy into delivered software that creates measurable outcomes.
                  </p>
                </div>
              </Reveal>

              {/* My Journey */}
              <Reveal delay={0.2}>
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    My Journey
                  </h2>
                  
                  <p className="leading-relaxed mb-4">
                    I moved into product thinking through building products. Initially, I was solving problems directly—writing code, designing systems, shipping features. Over time, I realized the harder problems weren&apos;t technical; they were product problems. What should we build? Why? For whom? How do we know if it worked?
                  </p>

                  <p className="leading-relaxed mb-4">
                    Those questions led me to pursue ICPM certification. Not for the credential, but for the rigor. Product management has frameworks and methods for a reason—they help you think systematically about decisions that matter. I wanted to understand those frameworks deeply, not just apply them superficially.
                  </p>

                  <p className="leading-relaxed mb-4">
                    The certification process forced me to articulate how I think about ambiguity, decision-making, and tradeoffs. It revealed gaps in my reasoning and gave me structures to fill them. Most importantly, it showed me that good product judgment comes from practice, not just theory.
                  </p>

                  <p className="leading-relaxed">
                    What shaped my approach wasn&apos;t a single moment, but the accumulation of decisions made with incomplete information. Every product I&apos;ve built taught me something about navigating uncertainty, balancing data with intuition, and making choices that compound over time.
                  </p>
                </div>
              </Reveal>

              {/* How I Work */}
              <Reveal delay={0.3}>
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    How I Work
                  </h2>
                  
                  <ul className="space-y-4 list-none pl-0">
                    <li className="leading-relaxed">
                      <strong className="text-white">Product thinking style:</strong> I map systems before building features. Every decision creates downstream effects. I trace those connections early, not after problems emerge.
                    </li>

                    <li className="leading-relaxed">
                      <strong className="text-white">Decision frameworks:</strong> Clear hypotheses, fast learning loops, and the discipline to change course when evidence demands it. I default to structure in ambiguous situations.
                    </li>

                    <li className="leading-relaxed">
                      <strong className="text-white">Tradeoff mindset:</strong> Product work is a series of tradeoffs. I make them explicit, discuss them openly, and choose intentionally based on constraints and goals.
                    </li>

                    <li className="leading-relaxed">
                      <strong className="text-white">Data + intuition balance:</strong> Data informs judgment; it doesn&apos;t replace it. I use quantitative signals to validate direction, but I don&apos;t wait for perfect data to make decisions.
                    </li>

                    <li className="leading-relaxed">
                      <strong className="text-white">AI as leverage:</strong> AI amplifies human judgment where it matters most. I focus on the seams—where AI handles scale and humans handle nuance, where automation creates space for deeper thinking.
                    </li>
                  </ul>
                </div>
              </Reveal>

              {/* Building as a Product Manager */}
              <Reveal delay={0.4}>
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    Building as a Product Manager
                  </h2>
                  
                  <p className="leading-relaxed">
                    I build products alongside job hunting because building sharpens PM judgment. There&apos;s no substitute for facing real constraints, making real tradeoffs, and learning from real users. When I write product requirements, I also implement them. When I make assumptions, I validate them. When I ship something, I support it. This loop—strategy to code to user feedback to iteration—forces clarity that theorizing alone cannot provide. The products I&apos;ve built aren&apos;t about monetization; they&apos;re proof of execution. They demonstrate that I can take product strategy and translate it into something users actually interact with. That interaction teaches me how users think, what they value, and where products succeed or fail. That learning directly informs how I think about products in my day job, whether I&apos;m defining requirements, evaluating tradeoffs, or making decisions with incomplete information.
                  </p>
                </div>
              </Reveal>

              {/* Current Focus */}
              <Reveal delay={0.5}>
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    Current Focus
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Professionally
                      </h3>
                      <p className="leading-relaxed">
                        I&apos;m actively seeking PM roles at companies building AI products, SaaS platforms, or systems that solve complex problems. I&apos;m interested in companies where product thinking drives decisions, where ambiguity is expected, and where execution matters as much as strategy. Problem spaces that interest me include AI product development, enterprise software, financial technology, and platforms that enable other builders.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        Independently
                      </h3>
                      <p className="leading-relaxed">
                        I write about product management, AI products, and building in ambiguity. I experiment with tools and frameworks that help me think more clearly about product decisions. I build small products to test hypotheses about user behavior, product architecture, and what works in practice versus theory.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Let's Connect */}
              <Reveal delay={0.6}>
                <div className="mb-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                    Let&apos;s Connect
                  </h2>
                  
                  <p className="leading-relaxed mb-4">
                    I&apos;m available for PM roles and open to thoughtful conversations about product strategy, AI product development, or building systems that scale. If you&apos;re working on interesting problems or want to discuss product thinking, I&apos;d like to hear from you.
                  </p>

                  <p className="leading-relaxed mb-6">
                    The best way to reach me is through email or Twitter. I respond to collaboration requests, product discussions, and genuine questions about the work I do.
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
