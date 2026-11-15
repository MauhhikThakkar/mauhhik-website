import Image from 'next/image'
import Link from 'next/link'
import TrackedLink from '@/components/site/TrackedLink'
import { PROFILE_FACTS } from '@/content/profile'

/**
 * HeroSection
 *
 * Server-rendered, so the headline and facts are in the HTML that recruiters'
 * link previews and search engines read. Entrance motion is CSS only and is
 * switched off for people who ask for reduced motion.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="site-container relative pb-16 pt-32 sm:pt-40 md:pb-24 md:pt-44">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          {/* Statement */}
          <div>
            <p
              className="animate-fade-up mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent-muted px-4 py-1.5 text-xs font-medium text-accent sm:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Open to product roles in the UAE and Singapore
            </p>

            <h1
              className="animate-fade-up text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              Project manager in financial infrastructure,{' '}
              <span className="text-zinc-400">moving into product management.</span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
              style={{ animationDelay: '160ms' }}
            >
              9+ years of experience, including 4+ managing IT delivery. I currently deliver secure
              network deployments for tier-1 global exchanges across 10+ countries, and build product
              concepts in payments and AI.
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: '240ms' }}
            >
              <TrackedLink href="/portfolio" label="View work" className="btn-primary">
                View work
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6l6 6-6 6" />
                </svg>
              </TrackedLink>
              <Link href="/resume" className="btn-secondary">
                Download resume
              </Link>
            </div>
          </div>

          {/* Fact card */}
          <aside
            aria-label="Profile at a glance"
            className="animate-fade-up card p-6 sm:p-7"
            style={{ animationDelay: '320ms' }}
          >
            <div className="mb-6 flex items-center gap-4">
              <Image
                src="/images/mauhhik-thakkar.jpg"
                alt="Mauhhik Thakkar"
                width={64}
                height={64}
                priority
                className="h-16 w-16 rounded-full border border-line-strong object-cover"
              />
              <div>
                <p className="text-base font-medium text-white">Mauhhik Thakkar</p>
                <p className="text-sm text-zinc-400">Gujarat, India</p>
              </div>
            </div>
            <dl className="divide-y divide-line">
              {PROFILE_FACTS.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 pt-0.5">
                    {fact.label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-zinc-200">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  )
}
