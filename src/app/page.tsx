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
      <PortfolioSection />
    </main>
  );
}
