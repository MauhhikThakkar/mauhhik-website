import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur bg-black/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Mauhhik.dev
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <Link href="#portfolio" className="hover:text-white transition">
            Portfolio
          </Link>
          <Link href="#blog" className="hover:text-white transition">
            Blog
          </Link>
          <Link href="#products" className="hover:text-white transition">
            Products
          </Link>
          <Link
            href="#resume"
            className="px-4 py-2 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}
