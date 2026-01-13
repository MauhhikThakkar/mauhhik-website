# Product Landing Page Template

## Overview
Basic product landing page template for digital products. Clean, minimal layout with structural placeholder sections.

**Route:** `/products/[slug]`  
**Schema:** `productV1`  
**Status:** Structural placeholder (no pricing logic yet)

---

## Files Created

### 1. **GROQ Queries**
`src/sanity/lib/productQueries.ts`

**Queries:**
- `PRODUCT_SLUGS_QUERY` - Get all product slugs for static generation
- `PRODUCT_BY_SLUG_QUERY` - Get single product by slug
- `LIVE_PRODUCTS_QUERY` - Get all live products (for listing page)

### 2. **Product Detail Page**
`src/app/products/[slug]/page.tsx`

**Dynamic route:** `/products/[slug]`

### 3. **Products Listing Page**
`src/app/products/page.tsx`

**Route:** `/products`

---

## Page Structure

### **Hero Section**
```
┌─────────────────────────────────────┐
│ ← Back to Products                 │
│                                     │
│ Product Title                       │
│ Promise / Short Description         │
└─────────────────────────────────────┘
```

**Content:**
- Back link to `/products`
- Product title (H1)
- Short description (promise/value prop)

---

### **What It's For**
```
┌─────────────────────────────────────┐
│ What it's for                       │
│                                     │
│ [Long Description - Portable Text] │
│ - Rich formatting                   │
│ - Headings, lists, images           │
│ - Full product details              │
└─────────────────────────────────────┘
```

**Content:**
- Section heading
- Long description (portable text)
- Full product details with formatting

---

### **Who It's For**
```
┌─────────────────────────────────────┐
│ Who it's for                        │
│                                     │
│ [Placeholder text - can be enhanced]│
│ Target audience description         │
└─────────────────────────────────────┘
```

**Content:**
- Section heading
- Target audience description
- Placeholder text (can be replaced with schema field later)

---

### **Related Writing**
```
┌─────────────────────────────────────┐
│ Related writing                     │
│ Articles and posts that provide     │
│ deeper context on this topic        │
│                                     │
│ ┌───────────┬───────────┐          │
│ │ Blog Post │ Blog Post │          │
│ │ Title     │ Title     │          │
│ │ Desc...   │ Desc...   │          │
│ │ Read →    │ Read →    │          │
│ └───────────┴───────────┘          │
└─────────────────────────────────────┘
```

**Content:**
- Section heading with helper text
- Grid of related blog posts (2 columns)
- Cards with hover effects
- Links to blog posts

**Features:**
- Only shows if `relatedBlogPosts` exist
- Responsive grid (1 column mobile, 2 columns desktop)
- Hover effects (lift, glow, shadow)
- "Read article" CTA with arrow

---

### **CTA Section (Placeholder)**
```
┌─────────────────────────────────────┐
│                                     │
│   [Get Access — Coming soon]        │
│                                     │
└─────────────────────────────────────┘
```

**Content:**
- Placeholder CTA button
- Shows "Coming soon" (no pricing logic yet)
- Uses `ctaText` from schema if available

---

## Design Details

### **Layout:**
- Max width: `4xl` (896px) for content
- Consistent spacing: `py-16 md:py-24`
- Border separators: `border-zinc-900/50`

### **Typography:**
- H1: `text-4xl sm:text-5xl md:text-6xl`
- H2: `text-2xl md:text-3xl`
- Body: `text-[19px] leading-[1.7]`
- Muted text: `text-zinc-400`

### **Colors:**
- Background: `bg-black`
- Text: `text-white` (headings), `text-zinc-300` (body)
- Borders: `border-zinc-900`
- Accents: `text-zinc-500` (muted)

### **Spacing:**
- Section padding: `py-16 md:py-24`
- Content padding: `px-6 sm:px-8`
- Bottom spacing: `h-32`

---

## Data Flow

### **1. Static Generation**
```typescript
generateStaticParams() {
  // Fetches all product slugs
  // Generates static pages at build time
}
```

### **2. Data Fetching**
```typescript
const product = await client.fetch(PRODUCT_BY_SLUG_QUERY, {
  slug: params.slug,
})
```

### **3. Filtering**
```typescript
if (!product || product.status !== 'live') {
  notFound() // Only shows live products
}
```

---

## GROQ Query Structure

### **Product By Slug:**
```groq
*[_type == "productV1" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  longDescription,
  status,
  price,
  ctaText,
  "relatedBlogPosts": relatedBlogPosts[]->{
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    heroImage { ... }
  }
}
```

**Features:**
- Fetches single product by slug
- Dereferences related blog posts
- Includes blog post images
- Returns null if not found

---

## Related Blog Posts Cards

### **Styling:**
```tsx
className="
  group block 
  p-6 
  bg-zinc-950/50 
  border border-zinc-800 
  rounded-xl 
  hover:border-zinc-700 
  hover:bg-zinc-950/70 
  hover:shadow-lg 
  hover:shadow-zinc-900/30 
  hover:-translate-y-1 
  transition-all duration-300
"
```

**Hover Effects:**
- Border lightens (`zinc-800` → `zinc-700`)
- Background darkens
- Shadow appears
- Lifts 4px (`-translate-y-1`)
- Smooth 300ms transition

---

## TypeScript Interface

```typescript
interface Product {
  _id: string
  title: string
  slug: string
  shortDescription: string
  longDescription: any  // Portable text
  status: 'draft' | 'live' | 'archived'
  price?: number
  ctaText?: string
  relatedBlogPosts?: Array<{
    _id: string
    title: string
    slug: string
    shortDescription: string
    heroImage?: { ... }
  }>
}
```

---

## Usage

### **1. Create Product in Sanity:**
- Go to "Digital Product (V1)"
- Fill required fields
- Set status to `live`
- Add related blog posts (optional)
- Publish

### **2. Access Product:**
- Navigate to: `/products/[slug]`
- Or from listing: `/products`

### **3. View Listing:**
- Navigate to: `/products`
- Shows all live products
- Grid layout (3 columns desktop)

---

## Future Enhancements

### **Schema Additions:**
- [ ] "Who it's for" field (currently placeholder)
- [ ] Hero image
- [ ] Preview samples
- [ ] Included items list
- [ ] Learning outcomes

### **Page Enhancements:**
- [ ] Pricing display (when logic added)
- [ ] Purchase button (when checkout added)
- [ ] Product images/gallery
- [ ] Testimonials section
- [ ] FAQ section
- [ ] Related products section

### **Functionality:**
- [ ] Checkout integration
- [ ] Payment processing
- [ ] Download links
- [ ] Email delivery
- [ ] Access management

---

## Testing Checklist

### **Basic Functionality:**
- [x] Product page loads with valid slug
- [x] 404 page shows for invalid slug
- [x] Draft products don't show (status filter)
- [x] All sections render correctly
- [x] Related blog posts link correctly

### **Layout:**
- [x] Responsive on mobile
- [x] Responsive on tablet
- [x] Responsive on desktop
- [x] Spacing consistent
- [x] Typography readable

### **Content:**
- [x] Title displays
- [x] Short description displays
- [x] Long description renders (portable text)
- [x] Related posts show when available
- [x] CTA placeholder shows

### **Navigation:**
- [x] Back link works
- [x] Related blog post links work
- [x] Products listing page accessible

---

## Example Product Page

**URL:** `/products/product-strategy-playbook`

**Sections:**
1. Hero: "Product Strategy Playbook" + promise
2. What it's for: Full description with formatting
3. Who it's for: Target audience (placeholder)
4. Related writing: 2-3 blog post cards
5. CTA: "Get the Playbook — Coming soon"

---

## Notes

### **Current Limitations:**
- No pricing logic (placeholder CTA)
- "Who it's for" is placeholder text
- No product images
- No purchase/download functionality

### **Design Philosophy:**
- Minimal and clean
- Focus on content
- Dark theme consistent
- Professional appearance

### **Performance:**
- Static generation (fast)
- Only fetches live products
- Optimized queries
- No client-side JavaScript needed

---

**Status:** ✅ Complete  
**Version:** V1 (Structural Placeholder)  
**Last Updated:** January 13, 2026  
**Breaking Changes:** None
