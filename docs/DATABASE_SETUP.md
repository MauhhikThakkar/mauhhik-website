# Database Setup for Resume Download Enforcement

## Overview

The resume download system uses a database as the single source of truth for enforcing download limits and expiration. This ensures proper enforcement in serverless environments like Vercel.

## Database Schema

See `src/lib/db/schema.sql` for the complete schema.

### Table: `resume_requests`

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

### Indexes

- `idx_token_hash` - For fast token lookups
- `idx_expires_at` - For expiration checks
- `idx_email` - For email-based queries

## Setup Options

### Option 1: Vercel Postgres (Recommended for Vercel)

1. Install the package:
   ```bash
   npm install @vercel/postgres
   ```

2. Create a Postgres database in Vercel:
   - Go to your Vercel project dashboard
   - Navigate to Storage → Create Database → Postgres
   - Follow the setup wizard

3. Run the schema:
   - Connect to your Vercel Postgres database
   - Execute the SQL from `src/lib/db/schema.sql`

4. Environment variables are automatically set by Vercel.

### Option 2: Generic PostgreSQL (via DATABASE_URL)

1. Install the PostgreSQL client:
   ```bash
   npm install pg @types/pg
   ```

2. Set environment variable:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. Run the schema:
   - Connect to your PostgreSQL database
   - Execute the SQL from `src/lib/db/schema.sql`

### Option 3: Other Databases

The code can be adapted for other SQL databases (MySQL, SQLite, etc.) by modifying `src/lib/db/resumeRequests.ts` to use the appropriate client library.

## How It Works

### Request Flow

1. User requests resume via `/api/resume/request`
2. System generates:
   - Unique `token_id` (UUID)
   - JWT token containing: `token_id`, `email`, `exp`
   - Token hash (SHA-256) for database storage
3. Database record created with:
   - `email`
   - `token_hash`
   - `download_count = 0`
   - `expires_at` (6 hours from now)

### Download Flow

1. User accesses `/api/resume/download?token=...`
2. System verifies JWT signature
3. System hashes token for database lookup
4. **ATOMIC DATABASE UPDATE** (the gate):
   ```sql
   UPDATE resume_requests
   SET download_count = download_count + 1
   WHERE token_hash = ?
     AND expires_at > NOW()
     AND download_count < 3
   RETURNING download_count
   ```
5. If update succeeds (`affectedRows > 0`):
   - Stream PDF file
6. If update fails:
   - Check if expired → return 410 (Gone)
   - Else → return 403 (Forbidden - limit reached)

## Key Features

- **Database as Source of Truth**: No JWT payload or in-memory state
- **Atomic Updates**: Prevents race conditions
- **Serverless-Safe**: Works in stateless environments
- **Single Token**: Token remains valid until limit reached (no regeneration)

## Testing

1. Create a resume request:
   ```bash
   curl -X POST http://localhost:3000/api/resume/request \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

2. Download resume (use token from email):
   ```bash
   curl -O http://localhost:3000/api/resume/download?token=YOUR_TOKEN
   ```

3. Verify database:
   ```sql
   SELECT * FROM resume_requests WHERE email = 'test@example.com';
   ```

## Troubleshooting

### "No database connection available"

- Ensure `@vercel/postgres` is installed OR `DATABASE_URL` is set
- Verify database is accessible
- Check environment variables

### "Module not found: Can't resolve '@vercel/postgres'"

This is a build warning, not an error. The code handles missing packages gracefully. Install `@vercel/postgres` if using Vercel Postgres.

### Schema errors

- Ensure the table exists: `SELECT * FROM resume_requests LIMIT 1;`
- Verify indexes are created
- Check column types match the schema
