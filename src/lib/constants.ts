/**
 * Site-wide constants
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mauhhik.com'
export const SITE_NAME = 'Mauhhik'
export const SITE_DESCRIPTION = 'Project manager with 9+ years in financial infrastructure, moving into product management. Case studies and concept prototypes across AI, fintech, and enterprise platforms.'

// Public resume PDF served from /public. Replace the file (or this path) when the resume is updated.
export const RESUME_PDF_PATH = '/resume/Resume_Mauhik%20Thakkar_Public.pdf'

// Analytics configuration
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ''
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || ''
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
