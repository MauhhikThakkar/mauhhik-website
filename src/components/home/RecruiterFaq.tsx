import JsonLd from '@/components/site/JsonLd'
import { RECRUITER_FAQ } from '@/content/profile'

const Plus = () => (
  <svg
    className="plus h-5 w-5 flex-none text-white transition-transform duration-200 motion-reduce:transition-none"
    viewBox="0 0 22 22"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M11 3v16M3 11h16" />
  </svg>
)

/**
 * RecruiterFaq
 *
 * The questions a screening call would open with, answered first. Published
 * as FAQPage structured data as well, for search and AI answer engines.
 */
export default function RecruiterFaq() {
  return (
    <section id="faq" className="border-y border-line bg-paper" aria-labelledby="faq-heading">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: RECRUITER_FAQ.map((entry) => ({
            '@type': 'Question',
            name: entry.question,
            acceptedAnswer: { '@type': 'Answer', text: entry.answer },
          })),
        }}
      />
      <div className="site-container flex flex-col gap-8 py-16 md:py-20 lg:flex-row lg:gap-16">
        <div className="lg:w-[18rem] lg:flex-none">
          <p className="eyebrow mb-3">Recruiter FAQ</p>
          <h2 id="faq-heading" className="section-title">
            Questions you would ask on a screening call.
          </h2>
          <p className="mt-3 text-base text-zinc-400">Answered here first.</p>
        </div>
        <div className="min-w-0 flex-1">
          {RECRUITER_FAQ.map((entry, index) => (
            <details
              key={entry.question}
              open={index === 0}
              className={`${index === 0 ? 'border-t-2 border-ink' : 'border-t border-line'} last:border-b`}
            >
              <summary className="flex min-h-[44px] items-center justify-between gap-6 py-5 text-lg font-semibold text-white sm:text-xl">
                {entry.question}
                <Plus />
              </summary>
              <p className="max-w-2xl pb-6 text-[16.5px] leading-relaxed text-zinc-400">{entry.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
