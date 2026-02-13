import Link from "next/link";

export default function Navbar() {
  return (
    <nav 
      className="fixed top-0 w-full z-50 backdrop-blur bg-charcoal/60 border-b border-white/10 transition-all duration-300"
      style={{ 
        // Account for announcement banner height (48px) when visible
        // Banner will push navbar down if present
        paddingTop: 'var(--banner-height, 0px)'
      }}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link 
          href="/" 
          className="text-lg font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal rounded transition"
          aria-label="Mauhhik Thakkar - Home"
        >
          Mauhhik Thakkar
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <Link 
            href="/portfolio" 
            className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal rounded px-2 py-1"
          >
            Portfolio
          </Link>
          <Link
            href="/resume"
            className="px-4 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-charcoal"
          >
            Resume
          </Link>
          <Link 
            href="/about" 
            className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal rounded px-2 py-1"
          >
            About
          </Link>
          <Link 
            href="/blog" 
            className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal rounded px-2 py-1"
          >
            Blog
          </Link>
          <Link 
            href="/products" 
            className="hover:text-white transition focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal rounded px-2 py-1"
          >
            Products
          </Link>
        </div>
      </div>
    </nav>
  );
}
