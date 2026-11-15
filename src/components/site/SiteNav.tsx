'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '/portfolio', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
  // Blog and Products are hidden until they have content. The routes still work.
]

const CONTACT_EMAIL = 'mailto:hello@mauhhik.com'

/**
 * SiteNav
 *
 * Fixed top navigation. Three links and one contact button on desktop,
 * a full-width sheet on phones.
 */
export default function SiteNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close the phone menu whenever the route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Stop the page scrolling behind the open phone menu
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const isActive = (href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-charcoal/80 backdrop-blur-md">
      <nav aria-label="Main navigation" className="site-container flex h-16 items-center justify-between">
        <Link
          href="/"
          aria-label="Mauhhik Thakkar, home"
          className="flex items-center gap-3 rounded text-[15px] font-semibold tracking-tight text-white"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line-strong bg-white/5 font-mono text-xs text-accent"
            aria-hidden="true"
          >
            MT
          </span>
          Mauhhik Thakkar
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                isActive(link.href)
                  ? 'bg-white/5 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={CONTACT_EMAIL}
            className="ml-3 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            Contact
          </a>
        </div>

        {/* Phone menu button */}
        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-zinc-300 hover:text-white md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'}
            />
          </svg>
        </button>
      </nav>

      {/* Phone menu */}
      {isOpen && (
        <div id="mobile-menu" className="border-t border-line bg-charcoal md:hidden">
          <ul className="site-container flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`flex min-h-[52px] items-center border-b border-line text-lg ${
                    isActive(link.href) ? 'text-white' : 'text-zinc-300'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-5">
              <a href={CONTACT_EMAIL} className="btn-primary w-full">
                Contact
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
