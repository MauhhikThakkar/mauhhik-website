import Link from 'next/link'

interface PortfolioBreadcrumbProps {
  caseStudyTitle: string
}

export default function PortfolioBreadcrumb({
  caseStudyTitle,
}: PortfolioBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-zinc-500" itemScope itemType="https://schema.org/BreadcrumbList">
        {/* Home */}
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link
            href="/"
            itemProp="item"
            className="px-2 py-1.5 -mx-2 -my-1.5 hover:text-zinc-300 active:text-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-charcoal rounded min-h-[44px] min-w-[44px] flex items-center"
          >
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {/* Separator */}
        <li aria-hidden="true" className="text-zinc-700 flex-shrink-0">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
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
            className="px-2 py-1.5 -mx-2 -my-1.5 hover:text-zinc-300 active:text-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-charcoal rounded min-h-[44px] min-w-[44px] flex items-center"
          >
            <span itemProp="name">Portfolio</span>
          </Link>
          <meta itemProp="position" content="2" />
        </li>

        {/* Separator */}
        <li aria-hidden="true" className="text-zinc-700 flex-shrink-0">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
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
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="text-zinc-400 flex-1 min-w-0">
          <span itemProp="name" className="line-clamp-1 text-zinc-400">{caseStudyTitle}</span>
          <meta itemProp="position" content="3" />
        </li>
      </ol>
    </nav>
  )
}
