import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PortfolioSection from "@/components/portfolio/PortfolioSection";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
      <PortfolioSection />
    </main>
  );
}
