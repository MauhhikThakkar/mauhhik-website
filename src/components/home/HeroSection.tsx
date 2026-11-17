import Image from 'next/image'
import { PROFILE_FACTS } from '@/content/profile'
import { ReadingModeToggle } from './ReadingMode'

/** Facts shown in the hero card (experience is already in the intro) */
const CARD_FACTS = PROFILE_FACTS.filter((fact) => fact.label !== 'Experience')

/**
 * HeroSection
 *
 * Server-rendered statement, intro and fact card, plus the reading-mode
 * switch. Entrance motion is CSS only and off for reduced-motion users.
 */
export default function HeroSection() {
  return (
    <section className="site-container pb-14 pt-32 sm:pt-36 md:pb-16">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-14">
        <div className="min-w-0 flex-1">
          <p className="animate-fade-up mb-6 inline-flex items-center gap-3 rounded-full bg-accent-muted px-3.5 py-2 font-mono text-[13px] text-accent">
            <span className="animate-pulse-dot h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            Open to product roles in the UAE and Singapore
          </p>

          <h1
            className="animate-fade-up text-balance text-[38px] font-semibold leading-[1.05] tracking-[-0.025em] text-white sm:text-5xl lg:text-[62px]"
            style={{ animationDelay: '80ms' }}
          >
            Project manager in financial infrastructure,{' '}
            <span className="text-accent">moving into product management.</span>
          </h1>

          <p
            className="animate-fade-up mt-7 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-[19px]"
            style={{ animationDelay: '160ms' }}
          >
            9+ years of experience, including 4+ managing IT delivery. I currently deliver secure
            network deployments for tier-1 global exchanges across 10+ countries, and build product
            concepts in payments and AI.
          </p>

          <div className="animate-fade-up mt-10" style={{ animationDelay: '220ms' }}>
            <ReadingModeToggle />
          </div>
        </div>

        <aside
          aria-label="Profile at a glance"
          className="animate-fade-up card w-full lg:max-w-[380px]"
          style={{ animationDelay: '280ms' }}
        >
          <div className="flex items-center gap-4 border-b border-line p-6">
            <Image
              src="/images/mauhhik-thakkar.jpg"
              alt="Mauhhik Thakkar"
              width={72}
              height={72}
              priority
              className="h-[72px] w-[72px] rounded-lg object-cover"
            />
            <div>
              <p className="text-[17px] font-semibold text-white">Mauhhik Thakkar</p>
              <p className="mt-1 text-sm text-zinc-400">Gujarat, India</p>
            </div>
          </div>
          <dl className="divide-y divide-line px-6 pb-4 pt-2">
            {CARD_FACTS.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[6rem_1fr] gap-4 py-3">
                <dt className="pt-0.5 font-mono text-xs uppercase tracking-[0.08em] text-zinc-500">
                  {fact.label}
                </dt>
                <dd className="text-[14.5px] leading-relaxed text-zinc-200">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
