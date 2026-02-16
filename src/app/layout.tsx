import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { SITE_URL, ANALYTICS_ENABLED, PLAUSIBLE_DOMAIN, IS_PRODUCTION } from "@/lib/constants"
import { defaultMetadata } from "@/lib/seo"
import Analytics from "@/components/Analytics"
import PlausibleAnalytics from "@/components/PlausibleAnalytics"
import GlobalUtmInitializer from "@/components/GlobalUtmInitializer"
import ScrollDepthTracker from "@/components/ScrollDepthTracker"
import PersonSchema from "@/components/PersonSchema"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...defaultMetadata,
  verification: {
    // Add verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
}

/**
 * Root Layout
 * 
 * This is the root layout for all routes. It provides:
 * - HTML structure
 * - Global styles
 * - Analytics (only for marketing pages via route groups)
 * - SEO schema
 * 
 * Marketing UI (Navbar, Footer, etc.) is handled by:
 * - app/(marketing)/layout.tsx - for marketing pages
 * 
 * Studio UI is isolated via:
 * - app/studio/layout.tsx - minimal layout, no marketing components
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-charcoal`} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen bg-charcoal" suppressHydrationWarning>
        {/* JSON-LD Person Schema - structured data for search engines */}
        <PersonSchema />
        {/* Global UTM Initializer - captures UTM params on first visit to any page */}
        <GlobalUtmInitializer />
        {/* Scroll Depth Tracker - tracks scroll milestones globally */}
        <ScrollDepthTracker />
        {/* 
          Children will be wrapped by:
          - (marketing)/layout.tsx for marketing pages (includes Navbar/Footer/AnnouncementBanner)
          - studio/layout.tsx for /studio (minimal, no marketing UI)
          - Direct rendering for API routes
        */}
        {children}
        {/* Plausible Analytics - only enabled in production or if explicitly enabled */}
        {(IS_PRODUCTION || ANALYTICS_ENABLED) && PLAUSIBLE_DOMAIN && (
          <PlausibleAnalytics domain={PLAUSIBLE_DOMAIN} enabled={true} />
        )}
        {/* Google Analytics 4 & Microsoft Clarity - unified component, loads only in production */}
        <Analytics />
      </body>
    </html>
  )
}
