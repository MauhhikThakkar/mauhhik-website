import SiteNav from "@/components/site/SiteNav"
import ContactSection from "@/components/site/ContactSection"
import SiteFooter from "@/components/site/SiteFooter"

/**
 * Marketing Layout
 *
 * Wraps every public page (/, /about, /portfolio, /blog, /products, /resume) with:
 * - SiteNav (fixed top navigation)
 * - ContactSection (closing call to action)
 * - SiteFooter
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteNav />
      <div className="flex-1">
        {children}
      </div>
      <ContactSection />
      <SiteFooter />
    </>
  )
}
