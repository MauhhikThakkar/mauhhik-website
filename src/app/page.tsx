import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: 'Product Manager & AI Product Builder',
  description: 'Product Manager with hands-on experience in AI tools, Excel automation, SaaS MVPs, and real-world delivery. Building AI-first products and shipping them to production.',
  url: '/',
  imageAlt: 'Mauhhik — Product Manager & AI Product Builder',
})

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      
      {/* Proof Strip */}
      <section className="border-t border-zinc-900 py-8">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-zinc-400 text-sm leading-relaxed">
            ICPM-certified Product Manager with hands-on product delivery.
            Resume available to verified professionals.{' '}
            <Link
              href="/resume"
              className="text-zinc-300 hover:text-white underline underline-offset-4 transition-colors"
            >
              View Resume
            </Link>
          </p>
        </div>
      </section>

      <PortfolioSection />
    </main>
  );
}
