# Production Deployment Guide - Resume Download System

## Critical Production Requirements

### ✅ Environment Variables (Vercel)

**MUST be set in Vercel Environment Variables:**

1. **`RESUME_JWT_SECRET`** (REQUIRED)
   - Must be the same value used when tokens were created
   - Minimum 32 characters
   - Generate: `openssl rand -base64 32`
   - **CRITICAL:** If changed, all existing tokens become invalid

2. **`DATABASE_URL`** (REQUIRED)
   - PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database`
   - Automatically set if using Vercel Postgres
   - **CRITICAL:** Must be accessible from Vercel

3. **`NEXT_PUBLIC_SITE_URL`** (Optional)
   - Should be `https://mauhhik.com` for production
   - Used in email links

### ✅ Resume File Location

**The resume file MUST be in the repository for Vercel deployment:**

- **Production path:** `lib/assets/resume.pdf` ✅ (deployed with code)
- **Local path:** `data/private/resume.pdf` (gitignored, local only)
- **Fallback:** `public/resume/Mauhik_Thakkar_Product_Manager_Resume.pdf`

**The system automatically checks these locations in order.**

### ✅ Database Setup

1. **Table exists:** `resume_requests`
2. **Schema:**
   ```sql
   CREATE TABLE resume_requests (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) NOT NULL,
     token_hash VARCHAR(255) NOT NULL UNIQUE,
     download_count INTEGER NOT NULL DEFAULT 0,
     expires_at TIMESTAMP NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT NOW()
   );
   ```
3. **Indexes:**
   ```sql
   CREATE INDEX idx_token_hash ON resume_requests(token_hash);
   CREATE INDEX idx_expires_at ON resume_requests(expires_at);
   ```

## Deployment Checklist

### Before Deploying:

- [ ] `RESUME_JWT_SECRET` set in Vercel
- [ ] `DATABASE_URL` set in Vercel (or Vercel Postgres configured)
- [ ] Resume file exists at `lib/assets/resume.pdf`
- [ ] Database table `resume_requests` created
- [ ] Database indexes created
- [ ] Test locally: `npm run build` passes
- [ ] Test locally: Request and download resume

### After Deploying:

- [ ] Check Vercel logs for any errors
- [ ] Request a new resume link
- [ ] Test download link from email
- [ ] Verify download works
- [ ] Check database for new record
- [ ] Verify download count increments

## Troubleshooting

### Error: "System configuration error"
**Cause:** Missing `RESUME_JWT_SECRET` or `DATABASE_URL`  
**Fix:** Set both in Vercel Environment Variables

### Error: "Invalid download link" (401)
**Possible causes:**
- JWT secret mismatch (token signed with different secret)
- Token expired (6 hours)
- Token format invalid

**Fix:**
- Verify `RESUME_JWT_SECRET` matches between environments
- Request a new link (old tokens won't work if secret changed)

### Error: "Resume file not available" (500)
**Cause:** File not found in any location  
**Fix:**
- Ensure `lib/assets/resume.pdf` exists and is committed to git
- File must be in repository for Vercel deployment

### Error: "Database connection failed" (500)
**Cause:** `DATABASE_URL` incorrect or database unreachable  
**Fix:**
- Verify `DATABASE_URL` in Vercel
- Test database connection
- Check database firewall/network settings

## File Storage Strategy

### Why `lib/assets/`?

- ✅ Gets deployed with code (not gitignored)
- ✅ Not publicly accessible (not in `/public`)
- ✅ Server-side only access
- ✅ Works in Vercel serverless

### Security:

- File is NOT directly accessible via URL
- Only accessible through authenticated API route
- Token validation required before file access
- Database enforcement prevents unauthorized access

## Monitoring

### Check Vercel Logs for:

- `[RESUME_DOWNLOAD] TOKEN LENGTH:` - Should be > 200
- `[RESUME_DOWNLOAD] JWT VERIFIED` - Confirms token validation
- `[RESUME_DOWNLOAD] TOKEN HASH PREFIX:` - For debugging
- `[DB_UPDATE] UPDATE RESULT rowCount:` - Should be 1 for success
- `[RESUME_DOWNLOAD] Download successful` - Confirms file served

### Red Flags:

- `CRITICAL: RESUME_JWT_SECRET not configured`
- `CRITICAL: DATABASE_URL not configured`
- `CRITICAL: Resume file not found`
- `Database connection failed`
- `Token verification failed`

---

**Last Updated:** 2026-02-16  
**Status:** Production-ready
