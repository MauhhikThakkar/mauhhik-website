import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/portfolio', label: 'Work' },
  { href: '/blog', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
]

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink-deep text-ink-soft">
      <div className="site-container py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-paper">Mauhhik Thakkar</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="py-1 transition-colors hover:text-paper">
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.linkedin.com/in/mauhhikthakkar/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 transition-colors hover:text-paper"
            >
              LinkedIn
            </a>
            <a href="mailto:hello@mauhhik.com" className="py-1 transition-colors hover:text-paper">
              Email
            </a>
          </nav>
        </div>
        <p className="mt-8 border-t border-paper/10 pt-6 text-xs leading-relaxed text-ink-muted">
          Work on this site is labelled as delivered or concept. Delivered work comes from my
          employment. Figures in concept case studies are targets unless marked as measured.
        </p>
      </div>
    </footer>
  )
}
