import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/portfolio', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
]

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-charcoal-dark">
      <div className="site-container py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-white">Mauhhik Thakkar</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.linkedin.com/in/mauhhikthakkar/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a href="mailto:hello@mauhhik.com" className="transition-colors hover:text-white">
              Email
            </a>
          </nav>
        </div>
        <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-zinc-500">
          Case studies on this site are concept prototypes. Figures are targets unless marked as
          measured.
        </p>
      </div>
    </footer>
  )
}
