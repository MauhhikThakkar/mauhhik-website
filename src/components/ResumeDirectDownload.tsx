'use client'

import { usePathname } from 'next/navigation'
import { RESUME_PDF_PATH } from '@/lib/constants'
import { trackResumeDownload } from '@/lib/analytics'

/**
 * ResumeDirectDownload Component
 *
 * One-click resume download. No email gate, so a recruiter gets the PDF
 * straight away. The click is logged as a GA4 `resume_download` event with
 * download_method "direct".
 *
 * The email-link flow (ResumeRequestForm + /api/resume/*) is left in the
 * codebase untouched so it can be restored later if wanted.
 */
export default function ResumeDirectDownload() {
  const pathname = usePathname()

  const handleClick = (): void => {
    trackResumeDownload({
      download_method: 'direct',
      page_path: pathname,
    })
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <a
        href={RESUME_PDF_PATH}
        download
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-charcoal text-base sm:text-lg min-h-[52px]"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
          />
        </svg>
        Download resume (PDF)
      </a>
    </div>
  )
}
