import HeroSection from "@/components/home/HeroSection";
import QuickSummary from "@/components/home/QuickSummary";
import EvidenceSection from "@/components/home/EvidenceSection";
import WorkBoard from "@/components/home/WorkBoard";
import RecruiterFaq from "@/components/home/RecruiterFaq";
import CareerRoute from "@/components/home/CareerRoute";
import LatestWriting from "@/components/home/LatestWriting";
import { ReadingModeProvider, ShowIn } from "@/components/home/ReadingMode";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: 'Mauhhik Thakkar — Project Manager moving into Product Management',
  description: 'Project manager with 9+ years of experience, including 4+ years managing IT delivery for global exchanges and fintech, moving into product management. Open to Product Manager and Technical Product Owner roles in the UAE and Singapore.',
  url: '/',
  imageAlt: 'Mauhhik Thakkar — Project Manager moving into Product Management',
})

/**
 * Home (design concept D)
 *
 * Hero with a "30 seconds / 3 minutes" switch. The short view is a single
 * summary panel; the full view is evidence, work, recruiter FAQ, career route
 * and writing. Both are in the server HTML.
 */
export default function Home() {
  return (
    <main className="bg-charcoal text-white">
      <ReadingModeProvider>
        <HeroSection />
        <ShowIn mode="quick">
          <QuickSummary />
        </ShowIn>
        <ShowIn mode="full">
          <EvidenceSection />
          <WorkBoard />
          <RecruiterFaq />
          <CareerRoute />
          <LatestWriting />
        </ShowIn>
      </ReadingModeProvider>
      {/* Testimonials stay hidden until each quote carries a real name and permission */}
    </main>
  );
}
