-- Resume Requests Table Schema
-- 
-- This table enforces download limits and expiration for resume downloads.
-- Database is the single source of truth - no JWT payload or in-memory state.

-- For PostgreSQL (Vercel Postgres, Supabase, etc.)
CREATE TABLE IF NOT EXISTS resume_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  download_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_token_hash ON resume_requests(token_hash);
CREATE INDEX IF NOT EXISTS idx_expires_at ON resume_requests(expires_at);
CREATE INDEX IF NOT EXISTS idx_email ON resume_requests(email);

-- For MySQL/MariaDB (PlanetScale, etc.)
-- CREATE TABLE IF NOT EXISTS resume_requests (
--   id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
--   email VARCHAR(255) NOT NULL,
--   token_hash VARCHAR(255) NOT NULL UNIQUE,
--   download_count INT NOT NULL DEFAULT 0,
--   expires_at DATETIME NOT NULL,
--   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );
-- 
-- CREATE INDEX idx_token_hash ON resume_requests(token_hash);
-- CREATE INDEX idx_expires_at ON resume_requests(expires_at);
-- CREATE INDEX idx_email ON resume_requests(email);
