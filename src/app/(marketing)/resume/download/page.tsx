'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { getUtmParams } from '@/hooks/useUtmTracker'
import { trackResumeDownloadSuccess } from '@/lib/analytics'
import ExpiredLinkPage from '@/components/ExpiredLinkPage'

interface DownloadState {
  status: 'loading' | 'error' | 'downloading' | 'expired'
  error?: string
  reason?: 'expired' | 'invalid_token' | 'download_limit_reached'
  downloadCount?: number
}

function DownloadContent() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [state, setState] = useState<DownloadState>({ status: 'loading' })

  useEffect(() => {
    // Next.js automatically decodes URL-encoded query params
    let token = searchParams.get('token')

    if (!token) {
      console.error('[RESUME_DOWNLOAD_PAGE] No token in URL')
      setState({
        status: 'expired',
        reason: 'invalid_token',
      })
      return
    }

    // Ensure token is properly trimmed (no whitespace issues)
    token = token.trim()

    // Validate token format (JWT should have 3 parts separated by dots)
    if (token.split('.').length !== 3) {
      console.error('[RESUME_DOWNLOAD_PAGE] Invalid token format:', token.substring(0, 20))
      setState({
        status: 'expired',
        reason: 'invalid_token',
      })
      return
    }

    // Trigger download via API route (which verifies token and streams PDF)
    const downloadResume = async () => {
      try {
        setState({ status: 'downloading' })

        // Fetch from API route which handles token verification and PDF streaming
        // Re-encode token to ensure proper URL encoding
        const apiUrl = `/api/resume/download?token=${encodeURIComponent(token)}`
        console.log('[RESUME_DOWNLOAD_PAGE] Calling API with token length:', token.length)
        const response = await fetch(apiUrl)

        // Handle error responses (expired, invalid, limit reached)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          const reason = errorData.reason || 'invalid_token'
          
          setState({
            status: 'expired',
            reason: reason as 'expired' | 'invalid_token' | 'download_limit_reached',
          })
          return
        }

        // Get PDF blob from response
        const blob = await response.blob()
        
        // Extract download count from response headers (if available)
        const downloadCountHeader = response.headers.get('X-Download-Count')
        const downloadCount = downloadCountHeader ? parseInt(downloadCountHeader, 10) : 1

        // Trigger browser download
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'Mauhik_Thakkar_Product_Manager_Resume.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Track successful download
        const utmParams = getUtmParams()
        trackResumeDownloadSuccess({
          download_count: downloadCount,
          page_path: pathname,
          ...(utmParams || {}),
        })

        // Success - redirect to resume page after a moment
        setTimeout(() => {
          window.location.href = '/resume?downloaded=true'
        }, 1000)
      } catch (error) {
        console.error('[RESUME_DOWNLOAD] Download error:', error)
        setState({
          status: 'expired',
          reason: 'invalid_token',
        })
      }
    }

    downloadResume()
  }, [searchParams, pathname])

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

  if (state.status === 'expired') {
    return <ExpiredLinkPage reason={state.reason} />
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
