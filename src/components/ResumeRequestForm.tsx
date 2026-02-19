'use client'

import { useState, Suspense, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUtmTracker } from '@/hooks/useUtmTracker'
import { trackResumeButtonClick, trackResumeFormSubmit, trackResumeLinkGenerated, trackResumeFormView } from '@/lib/analytics'

/**
 * Internal form component that uses UTM tracker
 */
function ResumeRequestFormInner() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  
  // Track UTM parameters
  const { utmParams } = useUtmTracker()
  const hasTrackedView = useRef(false)

  // Track form view on mount
  useEffect(() => {
    if (!hasTrackedView.current) {
      trackResumeFormView({
        page_path: pathname,
        ...(utmParams || {}),
      })
      hasTrackedView.current = true
    }
  }, [pathname, utmParams])

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailValue)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Track button click event
    trackResumeButtonClick({
      button_location: 'resume_page',
      page_path: pathname,
      ...utmParams,
    })

    setIsSubmitting(true)

    try {
      // Include UTM params if available
      const requestBody: { email: string; utmParams?: { utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_term?: string; utm_content?: string } } = {
        email: email.trim(),
      }
      
      // Attach UTM metadata if available
      if (utmParams && Object.keys(utmParams).length > 0) {
        requestBody.utmParams = utmParams
      }
      
      const response = await fetch('/api/resume/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      // UI TRUTH GUARANTEE: Show success ONLY on HTTP 200
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unknown error' }))
        setError(data.error || 'Resume request failed. This is a system error.')
        
        // Track failed form submit
        trackResumeFormSubmit({
          success: false,
          page_path: pathname,
          ...utmParams,
        })
        return
      }

      // Track successful form submit
      trackResumeFormSubmit({
        success: true,
        page_path: pathname,
        ...utmParams,
      })

      // Track resume link generated
      trackResumeLinkGenerated({
        page_path: pathname,
        ...utmParams,
      })

      // Redirect to success page with masked email
      // Encode email for URL (will be masked on success page)
      const encodedEmail = encodeURIComponent(email.trim())
      router.push(`/resume/success?email=${encodedEmail}`)
    } catch {
      // Network errors or JSON parse errors
      setError('Resume request failed. This is a system error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Form state
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-charcoal-light/30 border border-zinc-900 rounded-2xl p-6 sm:p-8 md:p-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 sm:space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="resume-email" className="sr-only">
                Email address
              </label>
              <input
                id="resume-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="your@email.com"
                className="w-full px-4 py-3.5 sm:py-4 bg-zinc-900 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] text-base"
                style={{
                  borderColor: error ? '#dc2626' : '#27272a',
                }}
                disabled={isSubmitting}
                required
                aria-label="Email address"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'email-error' : undefined}
                autoComplete="email"
              />
              {error && (
                <p
                  id="email-error"
                  className="text-sm text-red-300/90 mt-2.5 px-1"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button - Improved prominence and tap target */}
            <button
              type="submit"
              className="w-full px-6 py-4 sm:py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950 min-h-[56px] text-base"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Request Resume'
              )}
            </button>
          </div>
        </form>

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <div className="space-y-3 text-xs text-zinc-500">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Secure, encrypted download link</span>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Valid for 6 hours from receipt</span>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-zinc-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Up to 3 downloads per link</span>
            </div>
          </div>
          <p className="text-xs text-zinc-600 mt-4 text-center">
            Your email is used solely to deliver the download link. No marketing, no spam.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Resume Request Form with Suspense boundary for UTM tracking
 */
export default function ResumeRequestForm() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto">
        <div className="bg-charcoal-light/30 border border-zinc-900 rounded-2xl p-8 md:p-10">
          <div className="space-y-4">
            <div className="h-12 bg-zinc-900 rounded-lg animate-pulse" />
            <div className="h-12 bg-zinc-900 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    }>
      <ResumeRequestFormInner />
    </Suspense>
  )
}
