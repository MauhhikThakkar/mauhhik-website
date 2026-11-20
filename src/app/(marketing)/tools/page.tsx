import PmToolkit from '@/components/tools/PmToolkit'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: 'PM Planning Toolkit',
  description:
    'Free planning tools for delivery and product teams: sprint capacity, probabilistic release forecast, PERT schedule simulation, RICE and WSJF prioritisation, planning poker and a go-live risk check.',
  url: '/tools',
  imageAlt: 'PM Planning Toolkit by Mauhhik Thakkar',
})

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-charcoal text-white">
      <section className="border-b border-line">
        <div className="site-container pb-10 pt-32 sm:pt-40">
          <p className="eyebrow mb-5">Tools</p>
          <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            PM Planning Toolkit
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-[1.75] text-zinc-300">
            Six planning tools I built for delivery and product work: capacity, release forecasting, schedule risk,
            prioritisation, estimation and go-live readiness. Each opens with clearly marked example
            data. Replace it with your own; nothing leaves your browser.
          </p>
        </div>
      </section>
      <div className="site-container pt-10">
        <PmToolkit />
      </div>
    </main>
  )
}
