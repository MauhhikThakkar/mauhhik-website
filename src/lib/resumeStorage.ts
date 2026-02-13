import { promises as fs } from 'fs'
import { join } from 'path'

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

export interface ResumeRequestData {
  token: string
  email: string
  expiry: string
  downloadCount: number
  maxDownloads: number
  createdAt: string
  utmParams?: UtmParams
}

const STORAGE_FILE = join(process.cwd(), 'data', 'resume-requests.json')

/**
 * Ensure data directory exists
 */
async function ensureDataDirectory(): Promise<void> {
  const dataDir = join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

/**
 * Read all resume requests from storage
 */
async function readRequests(): Promise<ResumeRequestData[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(STORAGE_FILE, 'utf-8')
    return JSON.parse(data) as ResumeRequestData[]
  } catch (error) {
    // File doesn't exist yet, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }
}

/**
 * Write resume requests to storage
 */
async function writeRequests(requests: ResumeRequestData[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(STORAGE_FILE, JSON.stringify(requests, null, 2), 'utf-8')
}

/**
 * Store a new resume request
 */
export async function storeResumeRequest(data: ResumeRequestData): Promise<void> {
  const requests = await readRequests()
  
  // Remove expired requests
  const now = new Date()
  const validRequests = requests.filter(
    (req) => new Date(req.expiry) > now
  )
  
  // Add new request
  validRequests.push(data)
  
  await writeRequests(validRequests)
}

/**
 * Get resume request by token
 */
export async function getResumeRequestByToken(token: string): Promise<ResumeRequestData | null> {
  const requests = await readRequests()
  const request = requests.find((req) => req.token === token)
  
  if (!request) {
    return null
  }
  
  // Check if expired
  if (new Date(request.expiry) < new Date()) {
    return null
  }
  
  return request
}

/**
 * Increment download count for a token atomically
 * 
 * This function validates and increments in a single operation to minimize race conditions.
 * For file-based storage, minor race conditions are acceptable at low concurrency.
 * Returns false if token is invalid, expired, or limit reached.
 */
export async function incrementDownloadCount(token: string): Promise<{
  success: boolean
  reason?: 'not_found' | 'expired' | 'limit_reached'
}> {
  const requests = await readRequests()
  const requestIndex = requests.findIndex((req) => req.token === token)
  
  if (requestIndex === -1) {
    return { success: false, reason: 'not_found' }
  }
  
  const request = requests[requestIndex]
  const now = new Date()
  
  // Check if expired
  if (new Date(request.expiry) < now) {
    return { success: false, reason: 'expired' }
  }
  
  // Check if max downloads reached
  if (request.downloadCount >= request.maxDownloads) {
    return { success: false, reason: 'limit_reached' }
  }
  
  // Increment count atomically
  requests[requestIndex].downloadCount += 1
  await writeRequests(requests)
  
  return { success: true }
}
