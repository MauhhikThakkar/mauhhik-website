# SEO Implementation Guide

## Overview
Comprehensive SEO defaults and OpenGraph support across the site, with blog-specific overrides.

**Status:** ✅ Complete

---

## Global SEO Defaults

### **File:** `src/app/layout.tsx`

**Features:**
- Default meta title with template
- Site description
- Keywords array
- OpenGraph defaults
- Twitter Card defaults
- Robots configuration
- Verification placeholders

**Title Template:**
```typescript
title: {
  default: "Mauhhik — Product Manager & AI Product Builder",
  template: "%s | Mauhhik",
}
```

**Result:** Pages automatically get "Page Title | Mauhhik" format

---

## Blog-Specific SEO

### **1. Blog Listing Page** (`/blog`)

**File:** `src/app/blog/page.tsx`

**Metadata:**
```typescript
title: 'Writing | Product Thinking & Strategy'
description: 'I write to clarify how modern products are built...'
```

**OpenGraph:**
- Type: `website`
- URL: `/blog`
- Custom title and description
- Default OG image

**Twitter Card:**
- Type: `summary_large_image`
- Custom title and description
- Default image

---

### **2. Blog Post Pages** (`/blog/[slug]`)

**File:** `src/app/blog/[slug]/page.tsx`

**Dynamic Metadata:**
- Uses `generateMetadata` function
- Fetches post data from Sanity
- Overrides global defaults

**Title:**
```typescript
title: post.seo?.metaTitle || post.title
// Result: "Post Title | Blog"
```

**Description:**
```typescript
description: post.seo?.metaDescription || post.shortDescription
```

**OpenGraph:**
- Type: `article`
- Uses post hero image (if available)
- Falls back to default OG image
- Includes `publishedTime`
- Includes `authors`
- Custom URL per post

**Twitter Card:**
- Type: `summary_large_image`
- Uses post hero image
- Custom title and description per post

---

## OpenGraph Image Strategy

### **Priority Order:**
1. **Blog Post Hero Image** (if available)
   - Resized to 1200x630
   - Uses Sanity image URL builder
2. **Default OG Image** (fallback)
   - `/og-image.jpg` in public folder
   - 1200x630 recommended size

### **Image Generation:**
```typescript
const ogImage = post.heroImage?.asset
  ? urlFor(post.heroImage).width(1200).height(630).fit('max').url()
  : `${SITE_URL}/og-image.jpg`
```

---

## Twitter Cards

### **Card Type:**
- `summary_large_image` (recommended)
- Shows large image preview
- Better engagement

### **Configuration:**
```typescript
twitter: {
  card: 'summary_large_image',
  title: post.title,
  description: post.shortDescription,
  images: [ogImage],
  creator: '@mauhhik',
}
```

---

## Site Constants

### **File:** `src/lib/constants.ts`

**Centralized Configuration:**
```typescript
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mauhhik.dev'
export const SITE_NAME = 'Mauhhik'
export const SITE_DESCRIPTION = 'Building products that solve real problems...'
```

**Benefits:**
- Single source of truth
- Easy to update
- Environment variable support
- Fallback values

---

## Environment Variables

### **Required:**
```env
NEXT_PUBLIC_SITE_URL=https://mauhhik.dev
```

**Usage:**
- OpenGraph URLs
- Canonical URLs
- Image URLs
- Social sharing

**Fallback:**
- Defaults to `https://mauhhik.dev` if not set
- Works in development and production

---

## Metadata Structure

### **Global (layout.tsx):**
```typescript
{
  metadataBase: SITE_URL,
  title: { default, template },
  description: SITE_DESCRIPTION,
  keywords: [...],
  openGraph: { ... },
  twitter: { ... },
  robots: { ... },
}
```

### **Blog Post (generateMetadata):**
```typescript
{
  title: `${post.title} | Blog`,
  description: post.shortDescription,
  openGraph: {
    type: 'article',
    publishedTime: post.publishedAt,
    authors: [...],
    images: [{ url, width, height, alt }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogImage],
  },
  alternates: {
    canonical: `${SITE_URL}/blog/${post.slug}`,
  },
}
```

---

## SEO Fields in Sanity

### **Blog Post Schema:**
```typescript
seo: {
  metaTitle?: string      // Override default title
  metaDescription?: string // Override default description
}
```

**Usage:**
- Optional fields
- Override defaults when needed
- Fallback to title/description if not set

---

## Canonical URLs

### **Implementation:**
```typescript
alternates: {
  canonical: `${SITE_URL}/blog/${post.slug}`,
}
```

**Benefits:**
- Prevents duplicate content issues
- Helps search engines understand primary URL
- Required for proper SEO

---

## Robots Configuration

### **Global Settings:**
```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
}
```

**Meaning:**
- `index: true` - Allow indexing
- `follow: true` - Follow links
- `max-image-preview: "large"` - Show large image previews
- `max-snippet: -1` - No snippet length limit

---

## Testing SEO

### **1. OpenGraph Testing:**
- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/
- Enter your blog post URL
- Check preview

### **2. Twitter Card Testing:**
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- Enter your blog post URL
- Check preview

### **3. Google Rich Results:**
- **Rich Results Test:** https://search.google.com/test/rich-results
- Enter your blog post URL
- Check structured data

### **4. Meta Tags:**
- View page source
- Check `<head>` section
- Verify all meta tags present

---

## Required Assets

### **Default OG Image:**
- **Path:** `/public/og-image.jpg`
- **Size:** 1200x630 pixels
- **Format:** JPG or PNG
- **Content:** Site branding, title, tagline

**Recommendations:**
- High contrast text
- Readable at small sizes
- Brand colors
- Clear messaging

---

## Blog Post SEO Checklist

### **In Sanity Studio:**
- [ ] Title filled (required)
- [ ] Short description filled (SEO-friendly, 120-160 chars)
- [ ] Hero image uploaded (for OG image)
- [ ] Alt text on hero image
- [ ] Category selected
- [ ] Tags added (optional)
- [ ] Published date set
- [ ] SEO fields (optional):
  - [ ] Meta title override
  - [ ] Meta description override

### **On Frontend:**
- [ ] Title renders correctly
- [ ] Description renders correctly
- [ ] OG image uses hero image (if available)
- [ ] Canonical URL correct
- [ ] Twitter card configured
- [ ] Article type set for blog posts

---

## Example Blog Post Metadata

### **HTML Output:**
```html
<head>
  <title>AI Didn't Replace Support Teams | Blog</title>
  <meta name="description" content="How AI actually enhanced customer support..." />
  
  <!-- OpenGraph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="AI Didn't Replace Support Teams" />
  <meta property="og:description" content="How AI actually enhanced..." />
  <meta property="og:image" content="https://cdn.sanity.io/..." />
  <meta property="og:url" content="https://mauhhik.dev/blog/ai-didnt-replace-support" />
  <meta property="article:published_time" content="2026-01-13T10:00:00.000Z" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="AI Didn't Replace Support Teams" />
  <meta name="twitter:description" content="How AI actually enhanced..." />
  <meta name="twitter:image" content="https://cdn.sanity.io/..." />
  
  <!-- Canonical -->
  <link rel="canonical" href="https://mauhhik.dev/blog/ai-didnt-replace-support" />
</head>
```

---

## Best Practices

### **Title Tags:**
- ✅ Keep under 60 characters
- ✅ Include primary keyword
- ✅ Use template: "Title | Section | Site"
- ✅ Unique per page

### **Descriptions:**
- ✅ Keep 120-160 characters
- ✅ Include call-to-action
- ✅ Unique per page
- ✅ Compelling and clear

### **OpenGraph Images:**
- ✅ 1200x630 pixels
- ✅ High quality
- ✅ Relevant to content
- ✅ Text readable at small sizes

### **Canonical URLs:**
- ✅ Absolute URLs
- ✅ HTTPS
- ✅ Match actual URL
- ✅ One per page

---

## Future Enhancements

### **Potential Additions:**
- [ ] JSON-LD structured data
- [ ] Article schema markup
- [ ] Author schema markup
- [ ] Breadcrumb schema
- [ ] FAQ schema (if applicable)
- [ ] Video schema (if applicable)
- [ ] Sitemap generation
- [ ] Robots.txt configuration

---

## Troubleshooting

### **OG Image Not Showing:**
1. ✅ Check image URL is absolute (not relative)
2. ✅ Verify image is accessible (public URL)
3. ✅ Check image dimensions (1200x630)
4. ✅ Test in Facebook Debugger

### **Twitter Card Not Working:**
1. ✅ Verify `card: 'summary_large_image'`
2. ✅ Check image URL is absolute
3. ✅ Test in Twitter Card Validator
4. ✅ Clear Twitter cache if needed

### **Title Not Updating:**
1. ✅ Check `generateMetadata` is exported
2. ✅ Verify title template in layout
3. ✅ Check Sanity SEO fields
4. ✅ Hard refresh browser

---

**Status:** ✅ Complete  
**Last Updated:** January 13, 2026  
**Files Changed:** 4  
**Breaking Changes:** None
