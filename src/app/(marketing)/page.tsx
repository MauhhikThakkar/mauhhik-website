import HeroSection from "@/components/home/HeroSection";
import ProofStrip from "@/components/home/ProofStrip";
import SelectedWork from "@/components/home/SelectedWork";
import HowIWork from "@/components/home/HowIWork";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: 'Mauhhik Thakkar — Project Manager moving into Product Management',
  description: 'Project manager with 9+ years in financial infrastructure, moving into product management. Open to Product Manager and Technical Product Owner roles in the UAE and Singapore.',
  url: '/',
  imageAlt: 'Mauhhik Thakkar — Project Manager moving into Product Management',
})

export default function Home() {
  return (
    <main className="bg-charcoal text-white">
      <HeroSection />
      <ProofStrip />
      <SelectedWork />
      <HowIWork />
      {/* Testimonials (AuthorityValidationSection) stay hidden until each quote carries a real name and permission */}
    </main>
  );
}
