# Analytics Setup - Plausible

## Overview
Lightweight, privacy-focused analytics using Plausible. Tracks page views and outbound link clicks with zero performance impact.

**Provider:** Plausible Analytics  
**Component:** `src/components/Analytics.tsx`  
**Status:** ✅ Configured

---

## Features

### **What's Tracked:**
- ✅ Page views (automatic)
- ✅ Outbound link clicks (custom event)
- ✅ Route changes (SPA mode)

### **What's NOT Tracked:**
- ❌ No cookies
- ❌ No personal data
- ❌ No fingerprinting
- ❌ No cross-site tracking

---

## Environment Configuration

### **Required Environment Variables:**

Create `.env.local` (or add to existing):

```env
# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=mauhhik.dev
```

### **Environment Behavior:**

**Development:**
- Analytics disabled by default
- Enable with `NEXT_PUBLIC_ANALYTICS_ENABLED=true`

**Production:**
- Analytics enabled automatically
- Requires `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to be set

---

## Setup Instructions

### **1. Get Plausible Account:**
1. Sign up at https://plausible.io
2. Add your domain (e.g., `mauhhik.dev`)
3. Get your domain from Plausible dashboard

### **2. Configure Environment:**
```env
# .env.local
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=mauhhik.dev
```

### **3. Deploy:**
- Analytics automatically loads in production
- Or enable in dev with env var

---

## How It Works

### **Page View Tracking:**
- Plausible script automatically tracks pageviews
- Works with Next.js App Router
- No manual tracking needed

### **Outbound Link Tracking:**
- Custom event: `Outbound Link: Click`
- Tracks URL and current path
- Only tracks external links (http/https)
- Ignores mailto/tel links

### **Script Loading:**
- Loads asynchronously
- Non-blocking
- Deferred execution
- Minimal performance impact

---

## Component Structure

### **Analytics Component:**
```typescript
'use client'

export default function Analytics({ domain, enabled }) {
  // Load Plausible script
  useEffect(() => {
    // Load script if enabled
  }, [domain, enabled])

  // Track outbound links
  useEffect(() => {
    // Listen for outbound link clicks
  }, [pathname, domain, enabled])

  return null
}
```

### **Integration:**
```typescript
// In layout.tsx
{(IS_PRODUCTION || ANALYTICS_ENABLED) && PLAUSIBLE_DOMAIN && (
  <Analytics domain={PLAUSIBLE_DOMAIN} enabled={true} />
)}
```

---

## Tracking Events

### **Automatic Events:**
- **Pageview:** Tracked automatically on route change
- **Outbound Link:** Tracked when user clicks external link

### **Custom Events (Future):**
```typescript
// Example: Track button click
window.plausible('Newsletter Subscribe', {
  props: {
    source: 'blog-post',
    post: 'ai-didnt-replace-support',
  },
})
```

---

## Outbound Link Detection

### **What's Tracked:**
- ✅ Links starting with `http://` or `https://`
- ✅ Links to different domain
- ✅ External URLs

### **What's Ignored:**
- ❌ Same-domain links
- ❌ `mailto:` links
- ❌ `tel:` links
- ❌ Hash links (`#section`)

### **Event Properties:**
```typescript
{
  url: 'https://example.com',
  path: '/blog/ai-didnt-replace-support',
}
```

---

## Performance Impact

### **Metrics:**
- **Script Size:** ~1KB (gzipped)
- **Load Time:** < 50ms
- **Runtime Impact:** Negligible
- **Network Requests:** 1 per pageview

### **Optimizations:**
- ✅ Async script loading
- ✅ Deferred execution
- ✅ No blocking resources
- ✅ Minimal JavaScript

---

## Privacy Features

### **Plausible Benefits:**
- ✅ No cookies
- ✅ No personal data collection
- ✅ GDPR compliant
- ✅ CCPA compliant
- ✅ No cross-site tracking
- ✅ Open source

### **Data Collected:**
- Page URL
- Referrer
- Browser
- Device type
- Country (from IP, anonymized)

---

## Development vs Production

### **Development:**
```typescript
// Disabled by default
// Enable with: NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### **Production:**
```typescript
// Enabled automatically if domain is set
// Requires: NEXT_PUBLIC_PLAUSIBLE_DOMAIN
```

### **Conditional Loading:**
```typescript
{(IS_PRODUCTION || ANALYTICS_ENABLED) && PLAUSIBLE_DOMAIN && (
  <Analytics domain={PLAUSIBLE_DOMAIN} enabled={true} />
)}
```

---

## Testing

### **In Development:**
1. Set `NEXT_PUBLIC_ANALYTICS_ENABLED=true`
2. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain`
3. Navigate pages
4. Check Plausible dashboard

### **Verify Tracking:**
1. Open browser DevTools
2. Check Network tab
3. Look for requests to `plausible.io`
4. Verify events are sent

### **Test Outbound Links:**
1. Click external link
2. Check Plausible dashboard
3. Look for "Outbound Link: Click" event
4. Verify URL and path properties

---

## Plausible Dashboard

### **What You'll See:**
- Page views over time
- Top pages
- Referrers
- Countries
- Devices
- Browsers
- Custom events (outbound links)

### **Outbound Link Events:**
- Event name: "Outbound Link: Click"
- Properties: `url`, `path`
- Filterable in dashboard

---

## Custom Events (Future)

### **Example: Newsletter Subscribe:**
```typescript
window.plausible('Newsletter Subscribe', {
  props: {
    source: 'blog-post',
    postSlug: 'ai-didnt-replace-support',
  },
})
```

### **Example: Product View:**
```typescript
window.plausible('Product View', {
  props: {
    productType: 'playbook',
    productSlug: 'product-strategy-playbook',
  },
})
```

---

## Troubleshooting

### **Analytics Not Loading:**
1. ✅ Check `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set
2. ✅ Check `NEXT_PUBLIC_ANALYTICS_ENABLED=true` (dev)
3. ✅ Verify domain in Plausible dashboard
4. ✅ Check browser console for errors

### **Events Not Tracking:**
1. ✅ Verify script loads (Network tab)
2. ✅ Check `window.plausible` exists
3. ✅ Verify domain matches Plausible
4. ✅ Check ad blockers (may block analytics)

### **Outbound Links Not Tracking:**
1. ✅ Verify link is external (http/https)
2. ✅ Check link is not same domain
3. ✅ Verify click handler is attached
4. ✅ Check browser console for errors

---

## Alternative: PostHog

### **If You Prefer PostHog:**

**Install:**
```bash
npm install posthog-js
```

**Component:**
```typescript
'use client'
import posthog from 'posthog-js'

export default function Analytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: 'https://app.posthog.com',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') posthog.debug()
        },
      })
    }
  }, [])
  
  return null
}
```

**Note:** PostHog is more feature-rich but heavier. Plausible is recommended for lightweight, privacy-focused analytics.

---

## Environment Variables Reference

### **Required:**
```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=mauhhik.dev
```

### **Optional:**
```env
NEXT_PUBLIC_ANALYTICS_ENABLED=true  # Enable in dev
```

### **Production:**
- Analytics enabled automatically
- Only requires `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

---

## Code Structure

### **Constants** (`src/lib/constants.ts`):
```typescript
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ''
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
```

### **Component** (`src/components/Analytics.tsx`):
- Client Component
- Loads Plausible script
- Tracks outbound links
- Handles route changes

### **Integration** (`src/app/layout.tsx`):
- Conditional rendering
- Environment-based loading
- No performance impact

---

## Best Practices

### **Privacy:**
- ✅ No personal data
- ✅ No cookies
- ✅ GDPR compliant
- ✅ User-friendly

### **Performance:**
- ✅ Async loading
- ✅ Non-blocking
- ✅ Minimal impact
- ✅ Fast execution

### **Development:**
- ✅ Disabled by default
- ✅ Easy to enable
- ✅ No tracking in dev (unless enabled)

---

## Future Enhancements

### **Potential Additions:**
- [ ] Custom event tracking for CTAs
- [ ] Product view tracking
- [ ] Blog post engagement metrics
- [ ] Form submission tracking
- [ ] Download tracking

---

## Migration to Google Analytics (Future)

### **If Needed:**
1. Install `@next/third-parties`
2. Replace Plausible component
3. Update environment variables
4. Configure GA4

**Note:** Plausible is recommended for privacy and performance.

---

**Status:** ✅ Complete  
**Provider:** Plausible Analytics  
**Last Updated:** January 13, 2026  
**Performance Impact:** Minimal  
**Privacy:** GDPR Compliant
