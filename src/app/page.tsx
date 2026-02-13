import Link from "next/link";
import { Suspense } from "react";
import Hero from "@/components/Hero";
import MetricsStrip from "@/components/MetricsStrip";
import PositioningSection from "@/components/PositioningSection";
import ProductThinkingSection from "@/components/ProductThinkingSection";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: 'Product Manager | Mauhhik',
  description: 'Product Manager focused on clarity, judgment, and execution. Designing products for complex, high-trust environments.',
  url: '/',
  imageAlt: 'Mauhhik — Product Manager',
})

export default function Home() {
  return (
    <main className="bg-charcoal text-white">
      <Suspense fallback={
        <section className="min-h-screen flex items-center justify-center px-6 pt-24">
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-[1.1]">
              Product Manager focused on clarity, judgment, and execution.
            </h1>
          </div>
        </section>
      }>
        <Hero />
      </Suspense>
      <Suspense fallback={null}>
        <MetricsStrip />
      </Suspense>
      <PositioningSection />
      <ProductThinkingSection />
      
      {/* Thinking Section */}
      <section className="border-t border-zinc-900 py-16 md:py-20">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed text-center">
            Product decisions require clear problem framing, explicit trade-off evaluation, 
            and judgment under constraints. My work demonstrates structured thinking across 
            certification-based projects and shipped products.
          </p>
        </div>
      </section>

      {/* Secondary Links */}
      <section className="border-t border-zinc-900 py-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <Link
              href="/resume"
              className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
            >
              Resume
            </Link>
            <span className="text-zinc-700 hidden sm:inline">•</span>
            <Link
              href="/about"
              className="text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
            >
              About
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
