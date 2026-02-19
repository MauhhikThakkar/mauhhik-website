'use client'

import Link from 'next/link'

export default function CaseStudyBottomBar() {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-charcoal border-t border-white/10 backdrop-blur-sm"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Left: Back to Portfolio */}
          <Link
            href="/portfolio"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-zinc-900/50 hover:bg-zinc-900 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal text-center min-h-[44px] flex items-center justify-center"
          >
            Portfolio
          </Link>

          {/* Center: Download Resume */}
          <Link
            href="/resume"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-white text-black hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-charcoal text-center min-h-[44px] flex items-center justify-center"
          >
            Resume
          </Link>

          {/* Right: About */}
          <Link
            href="/about"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-zinc-900/50 hover:bg-zinc-900 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal text-center min-h-[44px] flex items-center justify-center"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  )
}
