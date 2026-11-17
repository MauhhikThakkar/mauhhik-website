import Link from 'next/link'

/**
 * ContactSection
 *
 * Closing navy band on every marketing page. One question, the resume as the
 * main action, email and LinkedIn beside it.
 */
export default function ContactSection() {
  return (
    <section className="bg-ink text-paper" aria-labelledby="contact-heading">
      <div className="site-container flex flex-col gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-24">
        <div className="max-w-xl">
          <h2
            id="contact-heading"
            className="text-balance text-[34px] font-semibold leading-[1.05] tracking-tight sm:text-5xl"
          >
            Hiring for a technical <span className="text-highlight">product</span> role?
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
            I am open to Technical Product Manager and Technical Product Owner roles in the UAE and
            Singapore. The resume is one page of facts, and I am glad to walk through any figure on it.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-none lg:flex-nowrap">
          <Link href="/resume" className="btn-on-dark">
            Download resume
          </Link>
          <a href="mailto:hello@mauhhik.com" className="btn-outline-on-dark">
            hello@mauhhik.com
          </a>
          <a
            href="https://www.linkedin.com/in/mauhhikthakkar/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-on-dark"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
