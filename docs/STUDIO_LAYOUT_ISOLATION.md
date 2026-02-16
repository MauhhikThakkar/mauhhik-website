# Studio Layout Isolation - Architecture Fix

**Date:** 2026-02-16  
**Status:** ✅ **COMPLETE**

## Problem

Sanity Studio mounted at `/studio` was inheriting the global marketing layout (Navbar + container styling), causing the Navbar (position: fixed, high z-index) to overlap Sanity Studio's top action bar, hiding the Publish/Unpublish controls.

## Solution

Isolated `/studio` route from marketing layout using Next.js App Router route groups.

## Architecture Changes

### 1. Created Route Group `(marketing)`

**Location:** `src/app/(marketing)/`

**Purpose:** Group all marketing pages together so they share a common layout.

**Pages moved:**
- `/` (homepage) → `(marketing)/page.tsx`
- `/about` → `(marketing)/about/page.tsx`
- `/portfolio` → `(marketing)/portfolio/page.tsx`
- `/blog` → `(marketing)/blog/page.tsx`
- `/products` → `(marketing)/products/page.tsx`
- `/resume` → `(marketing)/resume/page.tsx`

**Note:** Route groups `(marketing)` don't affect URLs - `/about` still works as `/about`.

### 2. Created Marketing Layout

**Location:** `src/app/(marketing)/layout.tsx`

**Includes:**
- `AnnouncementBanner` (dismissible top banner)
- `Navbar` (fixed, high z-index)
- `CTAFooter`
- `Footer`

**Applies to:** All pages in `(marketing)` route group.

### 3. Created Studio Layout

**Location:** `src/app/studio/layout.tsx`

**Includes:** Nothing - just returns `{children}`

**Excludes:**
- ❌ Navbar
- ❌ Footer
- ❌ CTAFooter
- ❌ AnnouncementBanner
- ❌ Any marketing UI

**Applies to:** All routes under `/studio/*`

### 4. Refactored Root Layout

**Location:** `src/app/layout.tsx`

**Changes:**
- Removed `Navbar`, `Footer`, `CTAFooter`, `AnnouncementBanner` imports
- Removed marketing UI components from JSX
- Kept only:
  - HTML structure
  - Global styles
  - Analytics (global)
  - SEO schema
  - Global utilities (UTM tracker, scroll depth)

**Result:** Root layout is now minimal and doesn't interfere with route-specific layouts.

## File Structure

```
src/app/
├── layout.tsx                    # Root layout (minimal, no marketing UI)
├── (marketing)/                  # Route group (doesn't affect URLs)
│   ├── layout.tsx               # Marketing layout (Navbar/Footer)
│   ├── page.tsx                 # Homepage (/)
│   ├── about/
│   │   └── page.tsx             # /about
│   ├── portfolio/
│   │   ├── page.tsx             # /portfolio
│   │   └── [slug]/
│   │       └── page.tsx         # /portfolio/[slug]
│   ├── blog/
│   │   ├── page.tsx             # /blog
│   │   └── [slug]/
│   │       └── page.tsx         # /blog/[slug]
│   ├── products/
│   │   ├── page.tsx             # /products
│   │   └── [slug]/
│   │       └── page.tsx         # /products/[slug]
│   └── resume/
│       ├── page.tsx             # /resume
│       ├── download/
│       │   └── page.tsx         # /resume/download
│       └── success/
│           └── page.tsx         # /resume/success
└── studio/                       # Studio routes (isolated)
    ├── layout.tsx               # Studio layout (minimal, no marketing UI)
    └── [[...tool]]/
        └── page.tsx             # /studio/* (Sanity Studio)
```

## How It Works

### Route Resolution

1. **Marketing Pages** (`/`, `/about`, `/portfolio`, etc.):
   - Matches `(marketing)` route group
   - Uses `(marketing)/layout.tsx` → includes Navbar/Footer
   - Renders marketing UI

2. **Studio Routes** (`/studio`, `/studio/structure`, etc.):
   - Matches `studio/` directory
   - Uses `studio/layout.tsx` → minimal, no marketing UI
   - Renders Studio cleanly without Navbar overlap

3. **API Routes** (`/api/*`):
   - No layout applied
   - Direct rendering

### Layout Hierarchy

```
Root Layout (app/layout.tsx)
├── HTML structure
├── Global styles
├── Analytics
└── Children
    ├── Marketing Layout (app/(marketing)/layout.tsx)
    │   ├── AnnouncementBanner
    │   ├── Navbar
    │   ├── Content
    │   ├── CTAFooter
    │   └── Footer
    └── Studio Layout (app/studio/layout.tsx)
        └── Studio Content (no marketing UI)
```

## Verification

### ✅ Build Status

```bash
npm run build
# ✓ Compiled successfully
```

### ✅ Expected Behavior

1. **Marketing Pages:**
   - Visit `/` → Navbar visible, Footer visible
   - Visit `/about` → Navbar visible, Footer visible
   - Visit `/portfolio` → Navbar visible, Footer visible

2. **Studio:**
   - Visit `/studio` → No Navbar, no Footer, Studio renders cleanly
   - Publish/Unpublish controls fully visible
   - No overlap with marketing UI

3. **API Routes:**
   - Visit `/api/*` → No layout applied, direct response

## Files Modified

### Created:
1. `src/app/(marketing)/layout.tsx` - Marketing layout with Navbar/Footer
2. `src/app/studio/layout.tsx` - Minimal Studio layout

### Modified:
1. `src/app/layout.tsx` - Removed marketing UI, kept minimal structure

### Moved:
- All marketing pages from `src/app/` to `src/app/(marketing)/`
- URLs remain unchanged (route groups don't affect URLs)

## Benefits

1. **Clean Separation:** Marketing UI and Studio UI are completely isolated
2. **No Overlap:** Studio's top action bar is fully visible
3. **Maintainable:** Clear architecture with route groups
4. **Scalable:** Easy to add more route groups (e.g., `(admin)`, `(dashboard)`)
5. **Production-Ready:** Follows Next.js App Router best practices

---

**Status:** ✅ Complete - Studio is now isolated from marketing layout.
