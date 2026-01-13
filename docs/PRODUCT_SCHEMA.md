# Digital Product Schema Reference

## Overview
Production-ready Sanity schema for selling digital products: courses, playbooks, templates, toolkits, and guides.

---

## Product Types
- **Course**: Video-based learning content
- **Playbook**: Step-by-step methodologies
- **Template**: Ready-to-use frameworks (Figma, Notion, etc.)
- **Toolkit**: Bundled resources
- **Guide**: Written educational content

---

## Core Fields

### Basic Information
```typescript
title: string (required, max 80 chars)
slug: slug (required, auto-generated from title)
shortDescription: text (required, max 200 chars)
  → One-sentence value proposition
detailedDescription: richText (required)
  → Full product description with formatting
heroImage: image (required)
  → 1200x900px recommended
productType: enum (required)
  → Course | Playbook | Template | Toolkit | Guide
```

---

## Pricing & Delivery

### Pricing Object
```typescript
pricing: {
  isFree: boolean (default: false)
  price: number (required, min: 0, 2 decimals)
  currency: string (USD, EUR, GBP, AED)
  originalPrice: number (optional, for showing discounts)
}
```

### Delivery & Purchase
```typescript
deliveryType: enum
  → instant-download | email | access-link | enrollment
purchaseLink: url
  → Gumroad, Stripe, or payment platform URL
```

### CTA Copy
```typescript
ctaCopy: {
  primary: string (max 30 chars)
    → Default: "Get Access Now"
  secondary: string (max 30 chars)
    → Default: "Learn More"
  freeDownload: string (max 30 chars)
    → Default: "Download Free"
}
```

---

## Product Details

### What's Included
```typescript
includedItems: string[] (1-12 items)
  → Example: "50-page PDF", "Figma template", "Video walkthroughs"
```

### Target Audience
```typescript
idealFor: string[] (max 6)
  → Example: "Early-stage PMs", "UX Researchers transitioning to product"
```

### Learning Outcomes
```typescript
learningOutcomes: string[] (max 8)
  → What buyers will be able to do after using this
```

### Preview Samples
```typescript
previewSamples: image[] (max 6)
  → Screenshots, sample pages, or preview assets
  → Each image has: alt, caption
```

---

## Social Proof

### Testimonials
```typescript
testimonials: object[] (max 5)
  → quote: text (max 300 chars)
  → author: string (required)
  → role: string (e.g., "Senior PM at Amazon")
  → avatar: image (optional)
```

---

## Cross-Linking

### Related Content
```typescript
relatedBlogs: reference[] (max 3)
  → Link to blog posts that provide context
relatedProjects: reference[] (max 2)
  → Link to case studies showing methodology in action
```

---

## Upsells & Revenue Optimization

### Upsell Settings
```typescript
upsells: {
  enableUpsells: boolean (default: true)
    → Show product recommendations
  
  recommendedProducts: reference[] (max 3)
    → Products to suggest after purchase
  
  bundleEligible: boolean (default: true)
    → Can be included in product bundles
  
  upgradeMessage: text (max 150 chars)
    → Custom upsell message
    → Example: "Want the complete system? Check out..."
}
```

---

## Product Status

### Lifecycle Management
```typescript
featured: boolean (default: false)
  → Highlight on products page
status: enum (required)
  → draft | live | coming-soon | archived
launchDate: datetime (optional)
  → When product was/will be available
```

---

## SEO & Metadata

### SEO Settings
```typescript
seo: {
  metaTitle: string (max 60 chars)
    → Defaults to product title
  
  metaDescription: text (max 160 chars)
    → Defaults to short description
  
  focusKeywords: string[] (max 5)
    → Example: "product strategy", "PM playbook"
  
  ogImage: image (1200x630px recommended)
    → Social share image (defaults to hero image)
}
```

### Internal Metadata
```typescript
metadata: {
  sku: string
    → Internal product identifier
  
  totalSales: number (read-only)
    → Track sales (manual or automated)
  
  downloadCount: number (read-only)
    → Track free product downloads
  
  tags: string[]
    → Internal categorization
}
```

---

## Studio Preview

### Document Preview
Shows in Sanity Studio list view:
```
⭐ 🟢 Product Strategy Playbook
Course • USD 49.00
```

Icons:
- ⭐ = Featured
- 🟢 = Live | ⚪ = Draft | 🟡 = Coming Soon | ⚫ = Archived

---

## Validation Rules

### Critical Validations
- Title: Required, max 80 chars
- Slug: Required, auto-generated
- Short Description: Required, max 200 chars
- Hero Image: Required (with alt text)
- Product Type: Required
- Pricing: Required (with free/paid logic)
- Status: Required

### Smart Validations
- Free products must have price = 0
- Paid products must have price > 0
- Original price (if set) must be > current price
- CTA copy limited to 30 chars for UI consistency
- SEO fields show warnings at 60/160 char limits

---

## Best Practices

### Content Strategy
1. **Short Description** = Value prop (problem + solution)
2. **Included Items** = Specific deliverables (not vague features)
3. **Learning Outcomes** = "You'll be able to..." statements
4. **Ideal For** = Specific personas (not "anyone")

### SEO Strategy
1. Use **focusKeywords** to target search terms
2. Keep **metaTitle** under 60 chars
3. Keep **metaDescription** under 160 chars
4. Always set **ogImage** for social sharing

### Revenue Strategy
1. Enable **upsells** for related products
2. Set **bundleEligible = true** for future bundles
3. Use **upgradeMessage** for cross-sells
4. Link to **relatedBlogs** to build trust

### Lifecycle Strategy
1. Use **status = coming-soon** for pre-launch
2. Set **launchDate** for marketing campaigns
3. Mark top sellers as **featured**
4. Archive old products instead of deleting

---

## Example: Course Product

```typescript
{
  title: "Product Strategy Playbook",
  slug: "product-strategy-playbook",
  shortDescription: "Go from vague ideas to clear product roadmaps using battle-tested PM frameworks.",
  productType: "playbook",
  
  pricing: {
    isFree: false,
    price: 49,
    currency: "USD",
    originalPrice: 79, // Launch discount
  },
  
  deliveryType: "instant-download",
  purchaseLink: "https://gumroad.com/l/product-strategy-playbook",
  
  ctaCopy: {
    primary: "Get the Playbook",
    secondary: "See What's Inside",
    freeDownload: "Download Free",
  },
  
  includedItems: [
    "80-page PDF playbook",
    "Notion template library",
    "15+ PM frameworks",
    "Real case study examples",
  ],
  
  idealFor: [
    "Early-stage PMs (0-3 years)",
    "Founders building first products",
    "Consultants advising startups",
  ],
  
  upsells: {
    enableUpsells: true,
    recommendedProducts: ["pm-interview-toolkit", "roadmap-templates"],
    bundleEligible: true,
    upgradeMessage: "Want 1-on-1 coaching? Check out my PM Mentorship program.",
  },
  
  status: "live",
  featured: true,
  
  seo: {
    focusKeywords: ["product strategy", "PM frameworks", "roadmap planning"],
  },
}
```

---

## Future Extensions

### Ready for:
- Bundle products (group products with discount)
- Dynamic pricing (time-based, volume-based)
- Access tiers (basic, pro, enterprise)
- Subscription products (monthly/annual)
- Affiliate tracking (referral links)
- Course progress tracking (completion %)
- Email automation hooks (Mailchimp, ConvertKit)

### Schema is extensible via:
- `metadata.tags` for custom categorization
- `upsells.recommendedProducts` for personalization
- `relatedBlogs` and `relatedProjects` for content graph

---

## Migration Notes

### If you have existing products:
1. All existing fields are **backward compatible**
2. New fields have **sensible defaults**
3. Optional fields can be **filled gradually**
4. Preview format **shows status at a glance**

---

## Quick Start Checklist

### Minimum Viable Product:
```
✅ Title
✅ Slug (auto-generated)
✅ Short Description
✅ Hero Image (with alt text)
✅ Product Type
✅ Pricing (free or paid)
✅ Status (set to "draft" initially)
```

### Before Publishing:
```
✅ Fill "Detailed Description"
✅ Add "What's Included" items (3-8)
✅ Set "Ideal For" personas (2-5)
✅ Add "Preview Samples" (2-4 images)
✅ Set "Purchase Link"
✅ Configure CTA copy
✅ Set "Published Date"
✅ Change status to "live"
```

### Post-Launch Optimization:
```
✅ Add testimonials as they come in
✅ Link related blog posts
✅ Configure upsells
✅ Set SEO focus keywords
✅ Mark as "featured" if top-seller
```

---

**Schema Version:** 2.0  
**Last Updated:** January 2026  
**Status:** Production Ready ✅
