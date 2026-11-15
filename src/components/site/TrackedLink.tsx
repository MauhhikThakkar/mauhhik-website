'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { trackHomepageHeroCtaClick } from '@/lib/analytics'

interface TrackedLinkProps {
  href: string
  /** Text reported to analytics as the button label */
  label: string
  className?: string
  children: ReactNode
}

/**
 * TrackedLink
 *
 * An internal link that logs a GA4 hero CTA click. Kept as its own small
 * client component so the hero itself can render on the server.
 */
export default function TrackedLink({ href, label, className, children }: TrackedLinkProps) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackHomepageHeroCtaClick({
          cta_text: label,
          cta_destination: href,
          page_path: pathname,
        })
      }
    >
      {children}
    </Link>
  )
}
