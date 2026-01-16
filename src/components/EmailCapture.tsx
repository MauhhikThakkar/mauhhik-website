'use client'

import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    // Simulate API call (no backend integration yet)
    // In the future, replace this with actual API call
    try {
      // Placeholder: Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Store in localStorage for now (can be removed when backend is ready)
      const subscriptions = JSON.parse(localStorage.getItem('emailSubscriptions') || '[]')
      if (!subscriptions.includes(email)) {
        subscriptions.push(email)
        localStorage.setItem('emailSubscriptions', JSON.stringify(subscriptions))
      }

      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="not-prose my-16 -mx-0 max-w-2xl mx-auto">
        <div className="bg-zinc-950/30 border border-emerald-900/50 rounded-2xl p-8 md:p-10">
          <div className="text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
            <h3 className="text-lg font-semibold text-white mb-2">
              You&apos;re subscribed!
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Thanks for joining. I&apos;ll share insights on building AI-first products.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Form state
  return (
    <div className="not-prose my-16 -mx-0 max-w-2xl mx-auto">
      <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-8 md:p-10">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Copy */}
          <p className="text-lg text-zinc-300 leading-relaxed mb-6">
            I share how I think about building AI-first products.
          </p>

          {/* Form */}
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-zinc-900 border rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: error ? '#ef4444' : '#27272a',
                }}
                disabled={isSubmitting}
                required
                aria-label="Email address"
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'email-error' : undefined}
              />
              {error && (
                <p id="email-error" className="text-xs text-red-400 mt-2 text-left">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-zinc-800 text-white font-medium rounded-lg border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
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
                  Subscribing...
                </span>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>

          {/* Soft Disclaimer */}
          <p className="text-xs text-zinc-500 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
