'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { getUtmParams } from '@/hooks/useUtmTracker'
import { trackResumeDownloadExpired } from '@/lib/analytics'

interface ExpiredLinkPageProps {
  reason?: 'expired' | 'invalid_token' | 'download_limit_reached'
}

/**
 * Expired Link Page Component
 * 
 * Displays an elegant error page when a resume download link is:
 * - Expired (past 6 hours)
 * - Invalid (malformed or tampered token)
 * - Download limit reached (3 downloads exceeded)
 */
export default function ExpiredLinkPage({ reason = 'expired' }: ExpiredLinkPageProps) {
  const pathname = usePathname()

  // Track expired link event
  useEffect(() => {
    const utmParams = getUtmParams()
    trackResumeDownloadExpired({
      reason,
      page_path: pathname,
      ...(utmParams || {}),
    })
  }, [reason, pathname])

  // Determine error message based on reason
  const getErrorMessage = () => {
    switch (reason) {
      case 'expired':
        return {
          title: 'Download Link Expired',
          message: 'This secure download link has expired. Links are valid for 6 hours from the time they are sent.',
          action: 'Request a new download link below.',
        }
      case 'invalid_token':
        return {
          title: 'Invalid Download Link',
          message: 'This download link is invalid or has been tampered with. Please request a new link.',
          action: 'Request a new download link below.',
        }
      case 'download_limit_reached':
        return {
          title: 'Download Limit Reached',
          message: 'You have reached the maximum number of downloads (3) for this link. Each secure link allows up to 3 downloads.',
          action: 'Request a new download link below.',
        }
      default:
        return {
          title: 'Unable to Download',
          message: 'This download link is no longer valid.',
          action: 'Request a new download link below.',
        }
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <main className="bg-charcoal text-white min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-6">
        <div className="bg-charcoal-light/30 border border-red-900/50 rounded-2xl p-8 md:p-10 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6" aria-hidden="true">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {errorInfo.title}
          </h1>

          {/* Error Message */}
          <p className="text-zinc-400 mb-2 leading-relaxed" role="alert">
            {errorInfo.message}
          </p>
          <p className="text-sm text-zinc-500 mb-8">
            {errorInfo.action}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/resume"
              className="inline-block w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              Request New Link
            </Link>
            <Link
              href="/"
              className="inline-block w-full px-6 py-3 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              Back to Home
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-600 text-center">
              Secure download links are valid for 6 hours and allow up to 3 downloads per request.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
