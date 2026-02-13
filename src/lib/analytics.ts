/**
 * Google Analytics 4 utility functions
 * Handles gtag.js tracking calls with strict TypeScript typing
 */

// GA4 Event Parameter types
interface GA4EventParams {
  event_category?: string
  event_label?: string
  value?: number
  [key: string]: string | number | boolean | undefined
}

// GA4 Config Parameter types
interface GA4ConfigParams {
  page_path?: string
  page_title?: string
  page_location?: string
  [key: string]: string | number | boolean | undefined
}

// DataLayer item type - can be various gtag command structures
type DataLayerItem =
  | ['config', string, GA4ConfigParams?]
  | ['event', string, GA4EventParams?]
  | ['js', Date]
  | ['set', GA4ConfigParams]

// gtag function overloads for type safety
interface GtagFunction {
  // gtag('config', measurementId, config?)
  (command: 'config', targetId: string, config?: GA4ConfigParams): void
  // gtag('event', eventName, eventParams?)
  (command: 'event', eventName: string, eventParams?: GA4EventParams): void
  // gtag('js', date)
  (command: 'js', date: Date): void
  // gtag('set', config)
  (command: 'set', config: GA4ConfigParams): void
  // Fallback for any other calls (for future compatibility)
  (command: string, ...args: unknown[]): void
}

// Extend Window interface with proper typing
declare global {
  interface Window {
    gtag?: GtagFunction
    dataLayer?: DataLayerItem[]
  }
}

/**
 * Initialize Google Analytics dataLayer
 * 
 * @param measurementId - GA4 Measurement ID (format: G-XXXXXXXXXX)
 */
export const initGA = (measurementId: string): void => {
  if (typeof window === 'undefined') {
    return
  }

  // Initialize dataLayer with proper typing
  window.dataLayer = window.dataLayer || []

  // Create gtag function using rest parameters (ESLint compliant)
  window.gtag = function gtag(
    command: string,
    ...args: unknown[]
  ): void {
    if (window.dataLayer) {
      // Push the command and arguments as a tuple to dataLayer
      window.dataLayer.push([command, ...args] as DataLayerItem)
    }
  }

  // Set initial timestamp
  window.gtag('js', new Date())

  // Configure GA4 with measurement ID
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  })
}

/**
 * Track pageview
 * 
 * @param url - Page URL path to track
 */
export const trackPageView = (url: string): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  window.gtag('config', measurementId, {
    page_path: url,
  })
}

/**
 * Track custom event
 * 
 * @param action - Event action name
 * @param category - Optional event category
 * @param label - Optional event label
 * @param value - Optional numeric value
 */
export const trackEvent = (
  action: string,
  category?: string,
  label?: string,
  value?: number
): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  // Build event parameters object
  const eventParams: GA4EventParams = {}
  
  if (category !== undefined) {
    eventParams.event_category = category
  }
  
  if (label !== undefined) {
    eventParams.event_label = label
  }
  
  if (value !== undefined) {
    eventParams.value = value
  }

  window.gtag('event', action, eventParams)
}

/**
 * UTM Parameters structure (matches useUtmTracker)
 */
export interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Resume Button Click Event Payload
 * Tracks when user clicks the resume request button
 */
export interface ResumeButtonClickPayload {
  button_location: 'resume_page' | 'homepage' | 'footer' | 'other'
  page_path: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Resume Form Submit Event Payload
 * Tracks successful resume form submission
 */
export interface ResumeFormSubmitPayload {
  success: boolean
  page_path: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Resume Download Event Payload
 * Tracks successful resume download
 */
export interface ResumeDownloadPayload {
  download_method: 'email_link' | 'direct'
  page_path: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Track resume button click event
 * 
 * @param payload - Event payload with location and UTM params
 */
export const trackResumeButtonClick = (payload: ResumeButtonClickPayload): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  const eventParams: GA4EventParams = {
    button_location: payload.button_location,
    page_path: payload.page_path,
  }

  // Add UTM parameters if available
  if (payload.utm_source) {
    eventParams.utm_source = payload.utm_source
  }
  if (payload.utm_medium) {
    eventParams.utm_medium = payload.utm_medium
  }
  if (payload.utm_campaign) {
    eventParams.utm_campaign = payload.utm_campaign
  }
  if (payload.utm_term) {
    eventParams.utm_term = payload.utm_term
  }
  if (payload.utm_content) {
    eventParams.utm_content = payload.utm_content
  }

  window.gtag('event', 'resume_button_click', eventParams)
}

/**
 * Track resume form submit event
 * 
 * @param payload - Event payload with success status and UTM params
 */
export const trackResumeFormSubmit = (payload: ResumeFormSubmitPayload): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  const eventParams: GA4EventParams = {
    success: payload.success,
    page_path: payload.page_path,
  }

  // Add UTM parameters if available
  if (payload.utm_source) {
    eventParams.utm_source = payload.utm_source
  }
  if (payload.utm_medium) {
    eventParams.utm_medium = payload.utm_medium
  }
  if (payload.utm_campaign) {
    eventParams.utm_campaign = payload.utm_campaign
  }
  if (payload.utm_term) {
    eventParams.utm_term = payload.utm_term
  }
  if (payload.utm_content) {
    eventParams.utm_content = payload.utm_content
  }

  window.gtag('event', 'resume_form_submit', eventParams)
}

/**
 * Track resume download event
 * 
 * @param payload - Event payload with download method and UTM params
 */
export const trackResumeDownload = (payload: ResumeDownloadPayload): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  const eventParams: GA4EventParams = {
    download_method: payload.download_method,
    page_path: payload.page_path,
  }

  // Add UTM parameters if available
  if (payload.utm_source) {
    eventParams.utm_source = payload.utm_source
  }
  if (payload.utm_medium) {
    eventParams.utm_medium = payload.utm_medium
  }
  if (payload.utm_campaign) {
    eventParams.utm_campaign = payload.utm_campaign
  }
  if (payload.utm_term) {
    eventParams.utm_term = payload.utm_term
  }
  if (payload.utm_content) {
    eventParams.utm_content = payload.utm_content
  }

  window.gtag('event', 'resume_download', eventParams)
}

/**
 * Resume Link Generated Event Payload
 * Tracks when a secure download link is generated and sent via email
 */
export interface ResumeLinkGeneratedPayload {
  page_path: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Resume Download Success Event Payload
 * Tracks successful resume download via secure link
 */
export interface ResumeDownloadSuccessPayload {
  download_count: number
  page_path: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Resume Download Expired Event Payload
 * Tracks when a download link is expired or invalid
 */
export interface ResumeDownloadExpiredPayload {
  reason: 'expired' | 'invalid_token' | 'download_limit_reached'
  page_path: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Track resume link generated event
 * 
 * @param payload - Event payload with page path and UTM params
 */
export const trackResumeLinkGenerated = (payload: ResumeLinkGeneratedPayload): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  const eventParams: GA4EventParams = {
    page_path: payload.page_path,
  }

  // Add UTM parameters if available
  if (payload.utm_source) {
    eventParams.utm_source = payload.utm_source
  }
  if (payload.utm_medium) {
    eventParams.utm_medium = payload.utm_medium
  }
  if (payload.utm_campaign) {
    eventParams.utm_campaign = payload.utm_campaign
  }
  if (payload.utm_term) {
    eventParams.utm_term = payload.utm_term
  }
  if (payload.utm_content) {
    eventParams.utm_content = payload.utm_content
  }

  window.gtag('event', 'resume_link_generated', eventParams)
}

/**
 * Track resume download success event
 * 
 * @param payload - Event payload with download count and UTM params
 */
export const trackResumeDownloadSuccess = (payload: ResumeDownloadSuccessPayload): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  const eventParams: GA4EventParams = {
    download_count: payload.download_count,
    page_path: payload.page_path,
  }

  // Add UTM parameters if available
  if (payload.utm_source) {
    eventParams.utm_source = payload.utm_source
  }
  if (payload.utm_medium) {
    eventParams.utm_medium = payload.utm_medium
  }
  if (payload.utm_campaign) {
    eventParams.utm_campaign = payload.utm_campaign
  }
  if (payload.utm_term) {
    eventParams.utm_term = payload.utm_term
  }
  if (payload.utm_content) {
    eventParams.utm_content = payload.utm_content
  }

  window.gtag('event', 'resume_download_success', eventParams)
}

/**
 * Track resume download expired event
 * 
 * @param payload - Event payload with reason and UTM params
 */
export const trackResumeDownloadExpired = (payload: ResumeDownloadExpiredPayload): void => {
  if (typeof window === 'undefined' || !window.gtag) {
    return
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_ID
  if (!measurementId) {
    return
  }

  const eventParams: GA4EventParams = {
    reason: payload.reason,
    page_path: payload.page_path,
  }

  // Add UTM parameters if available
  if (payload.utm_source) {
    eventParams.utm_source = payload.utm_source
  }
  if (payload.utm_medium) {
    eventParams.utm_medium = payload.utm_medium
  }
  if (payload.utm_campaign) {
    eventParams.utm_campaign = payload.utm_campaign
  }
  if (payload.utm_term) {
    eventParams.utm_term = payload.utm_term
  }
  if (payload.utm_content) {
    eventParams.utm_content = payload.utm_content
  }

  window.gtag('event', 'resume_download_expired', eventParams)
}
