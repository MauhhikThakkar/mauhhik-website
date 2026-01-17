# Resume Download System

## Overview

Secure resume download system with token-based access control.

## Setup

### 1. Place Resume PDF

Place your resume PDF file in one of these locations (checked in order):

- `public/resume.pdf` (recommended)
- `resume.pdf` (project root)
- `data/resume.pdf`

The system will automatically find and serve the file from the first available location.

### 2. Environment Variables

Ensure these are set in your `.env.local`:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@mauhhik.dev
NEXT_PUBLIC_SITE_URL=https://mauhhik.dev
```

## How It Works

1. **Request Flow**: User submits email on `/resume` page
2. **Token Generation**: System generates secure 64-character token
3. **Email Sent**: User receives email with download link
4. **Download Flow**: 
   - User clicks link → `/resume/download?token=...`
   - Page validates token and triggers download
   - API serves PDF if token is valid
5. **Security**: 
   - Token expires after 6 hours
   - Maximum 3 downloads per token
   - Download count incremented on each successful download

## API Endpoints

### POST `/api/resume/request`
Creates a resume request and sends email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume request processed. Please check your email for the download link."
}
```

### GET `/api/resume/download?token=...`
Serves the resume PDF if token is valid.

**Query Parameters:**
- `token` (required): The secure download token

**Response:**
- Success: PDF file with appropriate headers
- Error: JSON error message

## Error States

The system handles these error cases gracefully:

- **Invalid/Missing Token**: "Invalid download link. Please request a new one."
- **Expired Token**: "This download link is invalid or has expired. Please request a new one."
- **Download Limit Reached**: "Download limit reached. Please request a new link."
- **File Not Found**: "Resume file not available. Please contact support."
- **Server Error**: Generic error message (doesn't expose internal details)

## Security Features

- ✅ Secure random token generation (crypto.randomBytes)
- ✅ Token expiry (6 hours)
- ✅ Download limit enforcement (3 downloads)
- ✅ No authentication required (as requested)
- ✅ Error messages don't expose internal data
- ✅ Production-grade error handling

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── resume/
│   │       ├── download/
│   │       │   └── route.ts      # Download API endpoint
│   │       └── request/
│   │           └── route.ts      # Request API endpoint
│   └── resume/
│       ├── download/
│       │   └── page.tsx          # Download page (client)
│       └── page.tsx               # Request page
├── components/
│   └── ResumeRequestForm.tsx      # Request form component
└── lib/
    ├── email.ts                   # Email sending utility
    └── resumeStorage.ts           # Token storage & validation
```

## Testing

1. Submit email on `/resume` page
2. Check email for download link
3. Click link to trigger download
4. Verify PDF downloads successfully
5. Try downloading again (should work up to 3 times)
6. Try expired/invalid token (should show error)

## Notes

- Resume PDF must be named `resume.pdf`
- Storage uses JSON file (`data/resume-requests.json`)
- For production scale, consider replacing file storage with a database
- Email link points to `/resume/download?token=...` which handles the download flow
