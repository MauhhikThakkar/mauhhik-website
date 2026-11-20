'use client'

import { useEffect, useRef } from 'react'
import { initToolkit } from './toolkitEngine'
import { TOOLKIT_CSS, TOOLKIT_MARKUP } from './toolkitMarkup'

/**
 * PmToolkit
 *
 * Six planning tools on one page: sprint capacity, release forecast, PERT
 * schedule, RICE/WSJF prioritisation, planning poker and a delivery risk check.
 *
 * The markup is rendered on the server so search engines can read it. In the
 * browser, the framework-free engine binds to it. Styles are scoped under
 * .pmt, so nothing leaks into the rest of the site and globals.css is untouched.
 */
export default function PmToolkit() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cleanup = initToolkit()
    return () => {
      cleanup()
      // Reset the markup so a second mount (React strict mode, fast refresh)
      // starts from clean elements with no listeners attached twice.
      root.innerHTML = TOOLKIT_MARKUP
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TOOLKIT_CSS }} />
      <div ref={rootRef} className="pmt" dangerouslySetInnerHTML={{ __html: TOOLKIT_MARKUP }} />
    </>
  )
}
