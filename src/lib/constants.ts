/**
 * Site-wide constants
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mauhhik.com'
export const SITE_NAME = 'Mauhhik'
export const SITE_DESCRIPTION = 'Building products that solve real problems and deliver measurable impact. Product Manager specializing in AI-first products, SaaS MVPs, and real-world delivery.'

// Analytics configuration
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ''
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
