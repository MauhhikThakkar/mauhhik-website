import Link from "next/link"

interface ProductCard {
  title: string
  positioning: string
  description: string
  caseStudySlug: string
  prototypeLink: string
}

const products: ProductCard[] = [
  {
    title: "Founder OS",
    positioning: "AI-powered strategic operating system for founders.",
    description:
      "Streamlines decision-making, prioritization, and execution across product, growth, and operations. Built for founders who need clarity under uncertainty.",
    caseStudySlug: "founder-os",
    prototypeLink: "https://founder-os-hub.lovable.app",
  },
  {
    title: "Triage Genius",
    positioning: "Enterprise AI support triage and decision engine.",
    description:
      "Automates ticket routing with high accuracy, reducing response time and improving customer satisfaction. Designed for support teams scaling without proportional headcount.",
    caseStudySlug: "ai-enterprise-support-triage",
    prototypeLink: "https://triage-genius-hub.lovable.app",
  },
]

export default function AINativeProductSystems() {
  return (
    <section className="border-t border-zinc-900 py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3">
            AI-Native Product Systems
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed">
            Flagship products built with AI-first execution — from problem framing to prototype delivery.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product.title}
              className="group bg-charcoal-light/30 border border-zinc-900 rounded-xl p-6 md:p-8 hover:border-zinc-800 transition-colors duration-300"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 tracking-tight">
                {product.title}
              </h3>
              <p className="text-zinc-300 font-medium text-sm md:text-base mb-4">
                {product.positioning}
              </p>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/portfolio/${product.caseStudySlug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-zinc-200 transition-colors"
                >
                  Case Study
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <span className="text-zinc-600" aria-hidden="true">
                  ·
                </span>
                <a
                  href={product.prototypeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Live Prototype
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
