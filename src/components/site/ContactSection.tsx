import Link from 'next/link'

/**
 * ContactSection
 *
 * Closing block on every marketing page. One clear ask (email), with the
 * resume and LinkedIn as secondary routes.
 */
export default function ContactSection() {
  return (
    <section className="border-t border-line" aria-labelledby="contact-heading">
      <div className="site-container py-20 md:py-28">
        <div className="card relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
          <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative max-w-2xl">
            <p className="eyebrow mb-4">Contact</p>
            <h2 id="contact-heading" className="section-title text-balance">
              Hiring for a product role in the UAE or Singapore?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
              I am open to Product Manager and Technical Product Owner roles. Email is the
              fastest way to reach me.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="mailto:hello@mauhhik.com" className="btn-primary">
                hello@mauhhik.com
              </a>
              <Link href="/resume" className="btn-secondary">
                View resume
              </Link>
              <a
                href="https://www.linkedin.com/in/mauhhikthakkar/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
