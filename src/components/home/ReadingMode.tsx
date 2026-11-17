'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { trackEvent } from '@/lib/analytics'

type Mode = 'quick' | 'full'

const ModeContext = createContext<{ mode: Mode; setMode: (mode: Mode) => void }>({
  mode: 'full',
  setMode: () => {},
})

/**
 * ReadingMode
 *
 * The "30 seconds / 3 minutes" switch on the home page. Both views are in
 * the server HTML; the switch only hides one of them, so search engines and
 * link previews always see the full page.
 */
export function ReadingModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('full')
  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>
}

export function ReadingModeToggle() {
  const { mode, setMode } = useContext(ModeContext)

  const choose = (next: Mode) => {
    setMode(next)
    try {
      trackEvent('reading_mode', 'home', next)
    } catch {
      // Analytics is optional
    }
  }

  const button = (value: Mode, label: string) => (
    <button
      type="button"
      aria-pressed={mode === value}
      onClick={() => choose(value)}
      className={`min-h-[46px] px-5 text-[15px] transition-colors ${
        mode === value ? 'bg-ink font-medium text-paper' : 'bg-paper text-ink hover:bg-charcoal-dark'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div>
      <p id="reading-mode-label" className="mb-3 text-sm text-zinc-400">
        How much time do you have?
      </p>
      <div
        role="group"
        aria-labelledby="reading-mode-label"
        className="inline-flex overflow-hidden rounded border border-ink"
      >
        {button('quick', '30 seconds')}
        {button('full', '3 minutes')}
      </div>
    </div>
  )
}

/** Shows its children only in the chosen mode */
export function ShowIn({ mode, children }: { mode: Mode; children: ReactNode }) {
  const current = useContext(ModeContext).mode
  return <div hidden={current !== mode}>{children}</div>
}
