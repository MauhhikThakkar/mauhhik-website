import Link from 'next/link'

interface PortfolioBreadcrumbProps {
  caseStudyTitle: string
}

export default function PortfolioBreadcrumb({
  caseStudyTitle,
}: PortfolioBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-zinc-500" itemScope itemType="https://schema.org/BreadcrumbList">
        {/* Home */}
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link
            href="/"
            itemProp="item"
            className="hover:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-black rounded"
          >
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {/* Separator */}
        <li aria-hidden="true" className="text-zinc-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </li>

        {/* Portfolio */}
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link
            href="/portfolio"
            itemProp="item"
            className="hover:text-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-black rounded"
          >
            <span itemProp="name">Portfolio</span>
          </Link>
          <meta itemProp="position" content="2" />
        </li>

        {/* Separator */}
        <li aria-hidden="true" className="text-zinc-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </li>

        {/* Case Study Title (not a link) */}
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="text-zinc-400">
          <span itemProp="name" className="line-clamp-1">{caseStudyTitle}</span>
          <meta itemProp="position" content="3" />
        </li>
      </ol>
    </nav>
  )
}
