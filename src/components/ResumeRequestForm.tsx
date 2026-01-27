'use client'

import { useState } from 'react'

export default function ResumeRequestForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

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

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/resume/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      // UI TRUTH GUARANTEE: Show success ONLY on HTTP 200
      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unknown error' }))
        setError(data.error || 'Resume request failed. This is a system error.')
        return
      }

      // Only set success if we got HTTP 200
      setIsSuccess(true)
      setEmail('')
    } catch {
      // Network errors or JSON parse errors
      setError('Resume request failed. This is a system error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-charcoal-light/30 border border-emerald-900/50 rounded-2xl p-8 md:p-10">
          <div className="text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6" aria-hidden="true">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-lg font-semibold text-white mb-2">
              Check Your Email
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              A secure download link has been sent to your email address. The link will be valid for 6 hours and allows up to 3 downloads.
            </p>
            <p className="text-xs text-zinc-500">
              If you don&apos;t see the email, please check your spam folder.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Form state
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-charcoal-light/30 border border-zinc-900 rounded-2xl p-8 md:p-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
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
                className="w-full px-4 py-3 bg-zinc-900 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: error ? '#ef4444' : '#27272a',
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
                  className="text-xs text-red-400 mt-2"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
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
