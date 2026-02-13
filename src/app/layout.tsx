import type { Metadata } from "next"
import localFont from "next/font/local"
import dynamic from "next/dynamic"
import "./globals.css"
import { SITE_URL, ANALYTICS_ENABLED, PLAUSIBLE_DOMAIN, IS_PRODUCTION, GA_ID, CLARITY_ID } from "@/lib/constants"
import { defaultMetadata } from "@/lib/seo"
import Analytics from "@/components/Analytics"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

// Dynamically import analytics components with SSR disabled to prevent hydration errors
const GoogleAnalytics = dynamic(
  () => import("@/components/GoogleAnalytics"),
  { ssr: false }
)

const MicrosoftClarity = dynamic(
  () => import("@/components/MicrosoftClarity"),
  { ssr: false }
)

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-charcoal`} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-screen bg-charcoal" suppressHydrationWarning>
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        {/* Analytics - only enabled in production or if explicitly enabled */}
        {(IS_PRODUCTION || ANALYTICS_ENABLED) && PLAUSIBLE_DOMAIN && (
          <Analytics domain={PLAUSIBLE_DOMAIN} enabled={true} />
        )}
        {/* Google Analytics 4 - only loads in production */}
        {IS_PRODUCTION && GA_ID && <GoogleAnalytics gaId={GA_ID} />}
        {/* Microsoft Clarity - only loads in production */}
        {IS_PRODUCTION && CLARITY_ID && <MicrosoftClarity clarityId={CLARITY_ID} />}
      </body>
    </html>
  )
}
