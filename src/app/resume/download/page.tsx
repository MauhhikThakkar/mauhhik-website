'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface DownloadState {
  status: 'loading' | 'error' | 'downloading'
  error?: string
}

function DownloadContent() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<DownloadState>({ status: 'loading' })

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setState({
        status: 'error',
        error: 'Invalid download link. Please request a new one.',
      })
      return
    }

    // Trigger download
    const downloadResume = async () => {
      try {
        setState({ status: 'downloading' })

        const response = await fetch(`/api/resume/download?token=${encodeURIComponent(token)}`)

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: 'Unknown error' }))
          setState({
            status: 'error',
            error: data.error || 'Failed to download resume. Please try again.',
          })
          return
        }

        // Get blob and trigger download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Mauhhik-Resume.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Success - redirect to resume page after a moment
        setTimeout(() => {
          window.location.href = '/resume?downloaded=true'
        }, 1000)
      } catch (error) {
        console.error('Download error:', error)
        setState({
          status: 'error',
          error: 'An error occurred while downloading. Please try again.',
        })
      }
    }

    downloadResume()
  }, [searchParams])

  if (state.status === 'loading' || state.status === 'downloading') {
    return (
      <main className="bg-charcoal text-white min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="mb-6">
            <div className="w-12 h-12 border-4 border-zinc-700 border-t-white rounded-full animate-spin mx-auto"></div>
          </div>
          <h1 className="text-2xl font-bold mb-4">Preparing Download</h1>
          <p className="text-zinc-400" aria-live="polite" aria-atomic="true">
            {state.status === 'downloading' 
              ? 'Downloading your resume...' 
              : 'Validating download link...'}
          </p>
        </div>
      </main>
    )
  }

  if (state.status === 'error') {
    return (
      <main className="bg-charcoal text-white min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-charcoal-light/30 border border-red-900/50 rounded-2xl p-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6" aria-hidden="true">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white mb-4">Unable to Download</h1>
            <p className="text-zinc-400 mb-6 leading-relaxed" role="alert">
              {state.error}
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
          </div>
        </div>
      </main>
    )
  }

  return null
}

export default function ResumeDownloadPage() {
  return (
    <Suspense
      fallback={
        <main className="bg-charcoal text-white min-h-screen flex items-center justify-center">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="mb-6">
              <div className="w-12 h-12 border-4 border-zinc-700 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
            <h1 className="text-2xl font-bold mb-4">Loading</h1>
            <p className="text-zinc-400" aria-live="polite">Preparing download...</p>
          </div>
        </main>
      }
    >
      <DownloadContent />
    </Suspense>
  )
}
