import Navbar from "@/components/Navbar"
import CTAFooter from "@/components/CTAFooter"
import Footer from "@/components/Footer"
import AnnouncementBanner from "@/components/AnnouncementBanner"

/**
 * Marketing Layout
 * 
 * This layout applies to all marketing pages:
 * - / (homepage)
 * - /about
 * - /portfolio
 * - /blog
 * - /products
 * - /resume
 * 
 * It includes:
 * - AnnouncementBanner (dismissible top banner)
 * - Navbar (fixed, high z-index)
 * - CTAFooter
 * - Footer
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnnouncementBanner />
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <CTAFooter />
      <Footer />
    </>
  )
}
