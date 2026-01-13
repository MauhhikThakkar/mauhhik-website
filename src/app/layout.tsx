import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants"

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
  title: {
    default: "Mauhhik — Product Manager & AI Product Builder",
    template: "%s | Mauhhik",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "product manager",
    "AI products",
    "SaaS",
    "product strategy",
    "product management",
    "AI-first products",
    "product thinking",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: "Mauhhik — Product Manager & AI Product Builder",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Mauhhik — Product Manager & AI Product Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mauhhik — Product Manager & AI Product Builder",
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@mauhhik",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
