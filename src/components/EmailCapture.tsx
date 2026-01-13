'use client'

export default function EmailCapture() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Placeholder - no backend integration yet
    console.log('Email capture placeholder - no backend integration')
  }

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

          {/* Form Placeholder */}
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors"
              disabled
            />
            <button
              type="submit"
              className="px-6 py-3 bg-zinc-800 text-white font-medium rounded-lg border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Subscribe
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
