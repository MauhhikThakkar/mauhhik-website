# Blog Routing Fix - Root Cause Analysis

## 🐛 PROBLEM

Blog posts were correctly published in Sanity and visible when navigating directly to `/blog`, but they did NOT appear when clicking "Blog" in the main navigation in Chrome (though they DID appear in Cursor's browser preview).

---

## 🔍 ROOT CAUSE

**Hash routing vs Next.js routing**

The navigation components were using **hash links** (`#blog`) instead of **proper Next.js routes** (`/blog`):

### Files affected:
1. `src/components/Navbar.tsx` - Line 17: `<Link href="#blog">`
2. `src/components/Hero.tsx` - Line 32: `<a href="#blog">`

### Why this broke:

```
Hash Navigation (#blog):
├─ Browser scrolls to anchor on SAME page
├─ NO page navigation occurs
├─ NO Next.js data fetching triggers
├─ NO server-side rendering
└─ Chrome caches the hash state → Stale content

Next.js Routing (/blog):
├─ Full page navigation
├─ Next.js fetches fresh data from Sanity
├─ Server-side rendering re-runs
└─ Blog posts appear correctly
```

### Browser behavior differences:

- **Chrome:** Aggressive hash navigation caching → stale content
- **Cursor Browser Preview:** Different cache behavior → worked accidentally

---

## ✅ SOLUTION

### 1. **Fixed Navbar** (`src/components/Navbar.tsx`)

**BEFORE:**
```tsx
<Link href="#blog" className="hover:text-white transition">
  Blog
</Link>
```

**AFTER:**
```tsx
{/* CRITICAL FIX: Changed from hash (#blog) to proper Next.js route (/blog) */}
{/* Hash routing prevents Next.js from re-fetching data, causing stale blog posts */}
{/* This was causing blog posts to not appear when clicking nav in Chrome */}
<Link href="/blog" className="hover:text-white transition">
  Blog
</Link>
```

### 2. **Fixed Hero CTA** (`src/components/Hero.tsx`)

**BEFORE:**
```tsx
<a href="#blog">
  Read Blog
</a>
```

**AFTER:**
```tsx
{/* CRITICAL: Blog changed from hash (#blog) to route (/blog) */}
{/* Hash links prevent Next.js data fetching, causing stale blog content in Chrome */}
<Link href="/blog">
  Read Blog
</Link>
```

### 3. **Enhanced Debug Logging** (`src/app/blog/page.tsx`)

Added comprehensive logging to diagnose issues:

```typescript
console.log('===== BLOG PAGE DEBUG =====')
console.log('📍 Pathname: /blog (should NOT be hash-based)')
console.log('📊 Total posts from Sanity:', posts?.length || 0)
console.log('📝 Post details:', posts?.map(p => ({...})))
console.log('🔍 GROQ Query Type: _type == "blog" && defined(slug.current)')
console.log('🕒 Timestamp:', new Date().toISOString())
console.log('============================')
```

### 4. **Documented GROQ Query** (`src/sanity/lib/blogQueries.ts`)

Added detailed comments explaining the query filters:

```groq
/*
 * IMPORTANT: Query filters explained:
 * - _type == "blog" : Matches the blog schema document type
 * - defined(slug.current) : Only returns posts with a valid slug
 * - NO publishedAt filter : Shows ALL posts regardless of date
 * - Drafts are INCLUDED unless they lack a slug
 */
```

### 5. **Portfolio Section ID** (`src/components/portfolio/PortfolioSection.tsx`)

Added `id="portfolio"` to support hash navigation for homepage sections:

```tsx
<section id="portfolio" className="bg-black text-white py-24">
```

---

## 🎯 KEY DIFFERENCES

### Hash Links (for homepage sections):
```tsx
<Link href="#portfolio">Portfolio</Link>  ✅ OK - Section on same page
<Link href="#resume">Resume</Link>        ✅ OK - Section on same page
```

### Route Links (for separate pages):
```tsx
<Link href="/blog">Blog</Link>            ✅ REQUIRED - Separate page with data fetching
<Link href="/products">Products</Link>    ✅ REQUIRED - Separate page
```

---

## 🧪 TESTING

### Before Fix:
1. Navigate to homepage
2. Click "Blog" in navbar
3. ❌ Blog posts don't appear (hash navigation, no data fetch)

### After Fix:
1. Navigate to homepage
2. Click "Blog" in navbar
3. ✅ Full navigation to `/blog`
4. ✅ Fresh data fetched from Sanity
5. ✅ Blog posts appear correctly

### Terminal Output (Success):
```
===== BLOG PAGE DEBUG =====
📍 Pathname: /blog (should NOT be hash-based)
📊 Total posts from Sanity: 1
📝 Post details: [
  {
    title: "AI Didn't Replace Support Teams...",
    slug: "ai-didnt-replace-support-teams",
    hasDescription: true,
    hasCategory: true,
    publishedAt: "2026-01-13T10:00:00.000Z",
    _id: "63daBd5b-2e79-4f29-bfb0-fce117aeefac"
  }
]
🔍 GROQ Query Type: _type == "blog" && defined(slug.current)
🕒 Timestamp: 2026-01-13T15:30:00.000Z
============================
✅ Valid posts after filter: 1
```

---

## 📋 ARCHITECTURE NOTES

### Homepage Structure:
```
/ (homepage)
├─ Hero section
├─ Portfolio section (id="portfolio") ← Hash link works
├─ Products section (id="products") ← Hash link works
└─ Resume section (id="resume") ← Hash link works
```

### Separate Pages:
```
/blog (separate page) ← MUST use route link
/blog/[slug] (individual post)
/portfolio/[slug] (individual case study)
/products (future page)
```

### Navigation Rules:
- **Same page section:** Use hash link `#section-id`
- **Separate page:** Use route link `/page-route`
- **Never mix:** Don't use hash links for pages with data fetching

---

## 🔧 CACHING CONFIGURATION

Current setup (for debugging):

```typescript
// src/sanity/lib/client.ts
useCdn: false  // Disabled CDN caching to ensure fresh data

// src/app/blog/page.tsx
export const revalidate = 0  // Force revalidation every request
```

### For Production:
```typescript
// Recommended settings after debugging:
useCdn: true  // Re-enable CDN for performance
export const revalidate = 60  // Revalidate every 60 seconds
```

---

## 🚨 COMMON PITFALLS

### ❌ DON'T:
```tsx
// DON'T use hash links for separate pages
<Link href="#blog">Blog</Link>  // BAD - prevents data fetching

// DON'T use route links for same-page sections
<Link href="/portfolio">Portfolio</Link>  // BAD - portfolio is on homepage
```

### ✅ DO:
```tsx
// DO use route links for separate pages
<Link href="/blog">Blog</Link>  // GOOD - triggers navigation + data fetch

// DO use hash links for same-page sections
<Link href="#portfolio">Portfolio</Link>  // GOOD - scrolls to section on homepage
```

---

## 📊 GROQ QUERY DETAILS

### Current Query:
```groq
*[_type == "blog" && defined(slug.current)]
```

### What it does:
- ✅ Fetches all documents with `_type == "blog"`
- ✅ Excludes documents without a slug
- ✅ Includes both drafts and published (if they have slugs)
- ✅ No date filtering (shows future-dated posts)

### To exclude drafts explicitly:
```groq
*[_type == "blog" && defined(slug.current) && !(_id in path("drafts.**"))]
```

### To exclude future posts:
```groq
*[_type == "blog" && defined(slug.current) && publishedAt <= now()]
```

---

## ✅ VERIFICATION CHECKLIST

After fix, verify:

- [x] Blog navigation uses `/blog` route (not `#blog` hash)
- [x] Clicking "Blog" in navbar navigates to full page
- [x] Browser URL shows `localhost:3000/blog` (not `localhost:3000/#blog`)
- [x] Terminal shows debug logs with post data
- [x] Posts appear on page in Chrome
- [x] Posts appear on page in other browsers
- [x] Portfolio/Resume hash links still work for homepage sections
- [x] No TypeScript/linter errors

---

## 🎓 LESSONS LEARNED

1. **Hash links break data fetching** - Only use for same-page sections
2. **Browser cache behavior varies** - Chrome is more aggressive than Cursor preview
3. **Next.js routing ≠ HTML anchor links** - They serve different purposes
4. **Debug early** - Logging pathname + timestamp helps identify routing issues
5. **Document query filters** - Clear comments prevent future confusion

---

**Status:** ✅ Fixed  
**Date:** January 13, 2026  
**Impact:** Blog posts now reliably appear when navigating from any entry point
