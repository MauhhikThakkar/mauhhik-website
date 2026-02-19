'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false)
    }
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/resume', label: 'Resume' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/products', label: 'Products' },
  ]

  return (
    <>
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
            onClick={closeMobileMenu}
          >
            Mauhhik Thakkar
          </Link>

          {/* Desktop Navigation */}
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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal rounded transition"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'tween',
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-charcoal border-l border-white/10 z-50 md:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="pt-20 px-6 pb-8">
                <nav aria-label="Mobile navigation">
                  <ul className="flex flex-col gap-1">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.05,
                          duration: 0.2
                        }}
                      >
                        <Link
                          href={link.href}
                          className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-charcoal"
                          onClick={closeMobileMenu}
                        >
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
