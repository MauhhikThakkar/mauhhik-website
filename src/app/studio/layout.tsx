/**
 * Studio Layout
 * 
 * This layout is specifically for /studio routes (Sanity Studio).
 * It does NOT include:
 * - Navbar
 * - Footer
 * - CTAFooter
 * - Any marketing UI
 * 
 * Studio must render cleanly without any marketing components
 * to prevent Navbar from overlapping Studio's top action bar.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
