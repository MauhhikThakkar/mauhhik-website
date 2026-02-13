/**
 * Serverless-safe resume request storage
 * 
 * NOTE: This is a temporary logging-only implementation for serverless environments.
 * In production, replace with a proper database (e.g., Vercel Postgres, Supabase, etc.)
 * 
 * All filesystem write operations have been removed to ensure compatibility with
 * serverless platforms like Vercel where the filesystem is read-only.
 */

/**
 * UTM parameters structure
 */
export interface UtmParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

/**
 * Resume Request Data structure
 * Used for logging and future database integration
 */
export interface ResumeRequestData {
  token: string
  email: string
  expiry: string
  downloadCount: number
  maxDownloads: number
  createdAt: string
  utmParams?: UtmParams
}

/**
 * Store a new resume request
 * 
 * SERVERLESS-SAFE: Logs to console instead of filesystem
 * 
 * @param data - Resume request data including token, email, and UTM params
 */
export async function storeResumeRequest(data: ResumeRequestData): Promise<void> {
  // Log resume request with full details for analytics/debugging
  console.log('[RESUME_STORAGE] Resume request logged:')
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    token: data.token,
    email: data.email,
    expiry: data.expiry,
    maxDownloads: data.maxDownloads,
    utmParams: data.utmParams || null,
    createdAt: data.createdAt,
  }, null, 2))
  
  // TODO: Replace with database storage when ready
  // Example: await db.resumeRequests.create({ data })
}

/**
 * Get resume request by token
 * 
 * SERVERLESS-SAFE: Returns null (no filesystem reads)
 * 
 * NOTE: Token validation is currently disabled in download route.
 * For production, implement JWT tokens or database lookup.
 * 
 * @param token - Resume request token
 * @returns null (always returns null in serverless mode)
 */
export async function getResumeRequestByToken(token: string): Promise<ResumeRequestData | null> {
  // In serverless mode, we can't validate tokens without storage
  // This function is kept for API compatibility but always returns null
  // TODO: Replace with database lookup when ready
  // Example: return await db.resumeRequests.findUnique({ where: { token } })
  
  console.log(`[RESUME_STORAGE] Token lookup requested: ${token.substring(0, 8)}... (serverless mode - validation disabled)`)
  return null
}

/**
 * Increment download count for a token
 * 
 * SERVERLESS-SAFE: Returns success without filesystem writes
 * 
 * NOTE: Download tracking is currently disabled in serverless mode.
 * For production, implement database-based tracking.
 * 
 * @param token - Resume request token
 * @returns Always returns success (validation disabled in serverless mode)
 */
export async function incrementDownloadCount(token: string): Promise<{
  success: boolean
  reason?: 'not_found' | 'expired' | 'limit_reached'
}> {
  // In serverless mode, we can't track downloads without storage
  // This function is kept for API compatibility but always returns success
  // TODO: Replace with database update when ready
  // Example: await db.resumeRequests.update({ where: { token }, data: { downloadCount: { increment: 1 } } })
  
  console.log(`[RESUME_STORAGE] Download count increment requested for token: ${token.substring(0, 8)}... (serverless mode - tracking disabled)`)
  
  // Always return success in serverless mode
  // Token validation and download limits are disabled
  return { success: true }
}
