# Blog CTA Block System

## Overview
A flexible, reusable CTA system for blog posts that supports:
- **Inline content upgrades** (mid-content)
- **End-of-post lead capture** (after conclusion)
- **Product promotion** (courses, playbooks, templates)

**Key Features:**
- ✅ Sanity-driven (no code changes needed)
- ✅ Optional per post
- ✅ Reusable CTA templates
- ✅ Multiple visual styles
- ✅ Product integration
- ✅ Analytics-ready

---

## Architecture

### 1. **CTA Template (Reusable)**
`blogCTA` schema → Create once, use across multiple blog posts

### 2. **Post-Level Control**
Each blog post has a `ctas` field with:
- `inlineContent`: CTA shown mid-content (~50% by default)
- `endOfPost`: CTA shown after conclusion
- `customPosition`: Override inline position (%)

### 3. **Rendering Component**
`BlogCTA.tsx` → Handles all visual styles and types

---

## Creating CTA Templates in Sanity

### Step 1: Navigate to CTAs
```
Sanity Studio → Blog CTA Block → Create
```

### Step 2: Configure CTA

#### **Basic Information**
```
CTA Title (Internal): "Newsletter Signup - Generic"
Slug: auto-generated
```

#### **CTA Type**
Choose from:
- **Content Upgrade**: Downloadable resource
- **Newsletter Signup**: Email list
- **Product Promotion**: Paid product
- **Course Promotion**: Educational product
- **Free Resource**: Lead magnet
- **Custom**: Any other action

#### **Content**
```
Headline: "Want the PM interview checklist?"
Description: "Get the exact framework I used to land offers from Google, Amazon, and Stripe."
Button Text: "Download Free Checklist"
Button Link: https://forms.example.com/pm-checklist
```

#### **Visual Style**
Choose from:
- **Card** (default): Contained box with border
- **Banner**: Full-width gradient background
- **Minimal**: Simple border-left style
- **Feature**: Prominent with badge

#### **Optional: Product Integration**
```
Related Product: [Select from products]
```
If selected, automatically displays:
- Product image (overrides CTA image)
- Product price
- Product title

#### **Placement**
```
Default Position: End of Post
Show on Mobile: ✅ Yes
Priority: 0-100 (higher = shows first if multiple)
Active: ✅ Enabled
```

---

## Adding CTAs to Blog Posts

### In Sanity Studio

1. **Edit Blog Post**
2. **Scroll to "Call-to-Action Blocks" section**
3. **Select CTAs:**

```
Inline CTA (Mid-Content): [Select CTA template]
End-of-Post CTA: [Select CTA template]
Custom Inline Position: 50% (default)
```

### Example Configurations

#### **Strategy 1: Content Upgrade Only**
```
Inline CTA: "Download Strategy Template"
End-of-Post CTA: [None]
```
→ One focused CTA mid-content

#### **Strategy 2: Dual CTAs**
```
Inline CTA: "Download Worksheet"
End-of-Post CTA: "Newsletter Signup"
Custom Position: 60%
```
→ Free resource + email capture

#### **Strategy 3: Product Funnel**
```
Inline CTA: "See Free Preview"
End-of-Post CTA: "Buy Full Course"
```
→ Tease → Convert

#### **Strategy 4: No CTAs**
```
Inline CTA: [None]
End-of-Post CTA: [None]
```
→ Clean reading experience

---

## CTA Styles & Types

### Visual Styles

#### **1. Card (Default)**
```
╔════════════════════════════════════╗
║ [Image]  Headline                  ║
║          Description               ║
║          [Button]                  ║
╚════════════════════════════════════╝
```
**Best for:** General use, product promotion

#### **2. Banner**
```
═══════════════════════════════════════
  Headline | Description | [Button]
═══════════════════════════════════════
```
**Best for:** Newsletter signups, announcements

#### **3. Minimal**
```
│ Headline
│ Description
│ [Button]
```
**Best for:** Subtle CTAs, inline content upgrades

#### **4. Feature**
```
╔════════════════════════════════════╗
║ [BADGE]                            ║
║ Large Headline                     ║
║ Description                        ║
║ [Prominent Button]                 ║
╚════════════════════════════════════╝
```
**Best for:** Main offers, course launches

---

## CTA Types & Colors

### **Content Upgrade** → Emerald
- Icon: Download
- Use: PDFs, templates, checklists

### **Newsletter** → Purple
- Icon: Email
- Use: Email list building

### **Product** → Blue
- Icon: Arrow right
- Use: Paid products

### **Course** → Blue
- Icon: Arrow right
- Use: Online courses

### **Free Resource** → Emerald
- Icon: Download
- Use: Lead magnets

### **Custom** → Gray
- Icon: None
- Use: Any other action

---

## Frontend Integration

### TypeScript Interface
```typescript
interface BlogCTAData {
  headline: string
  description?: string
  buttonText: string
  buttonLink: string
  ctaType: 'content-upgrade' | 'newsletter' | 'product' | 'course' | 'free-resource' | 'custom'
  style: 'card' | 'banner' | 'minimal' | 'feature'
  active: boolean
  image?: {
    url: string
    alt?: string
  }
  relatedProduct?: {
    title: string
    slug: string
    heroImage?: { asset: { url: string } }
    pricing: {
      isFree: boolean
      price: number
      currency: string
    }
  }
}
```

### Component Usage
```tsx
import BlogCTA from '@/components/BlogCTA'

// In your blog post component
{post.ctas?.inlineContent && post.ctas.inlineContent.active && (
  <BlogCTA
    headline={post.ctas.inlineContent.headline}
    description={post.ctas.inlineContent.description}
    buttonText={post.ctas.inlineContent.buttonText}
    buttonLink={post.ctas.inlineContent.buttonLink}
    ctaType={post.ctas.inlineContent.ctaType}
    style={post.ctas.inlineContent.style}
    image={post.ctas.inlineContent.image}
    relatedProduct={post.ctas.inlineContent.relatedProduct}
  />
)}
```

---

## Positioning Logic

### **Inline CTA (Mid-Content)**

**Default Behavior:**
- Shows after ~50% of content
- Can be customized per post (0-100%)

**Implementation:**
```tsx
// Split content into blocks
const midpoint = Math.floor(contentBlocks.length * (customPosition || 50) / 100)

// Render first half
{contentBlocks.slice(0, midpoint).map(renderBlock)}

// Insert inline CTA
{inlineCTA && <BlogCTA {...inlineCTA} />}

// Render second half
{contentBlocks.slice(midpoint).map(renderBlock)}
```

### **End-of-Post CTA**

**Default Behavior:**
- Shows after all content
- Before related posts/footer

**Implementation:**
```tsx
{/* Article content */}
<PortableText value={post.content} />

{/* End-of-post CTA */}
{endOfPostCTA && <BlogCTA {...endOfPostCTA} />}

{/* Related projects */}
{post.relatedProjects && <RelatedProjects />}
```

---

## Example CTA Templates

### **Template 1: Newsletter Signup**
```yaml
CTA Title: Newsletter Signup - Product Thinking
Headline: Join 10,000+ PMs getting smarter
Description: Weekly insights on product strategy, user research, and building better products.
Button Text: Subscribe Free
Button Link: https://newsletter.example.com
CTA Type: Newsletter
Style: Banner
```

### **Template 2: Content Upgrade**
```yaml
CTA Title: PM Interview Checklist
Headline: Want the complete interview prep checklist?
Description: The exact 47-point checklist I used to land offers from top tech companies.
Button Text: Download Checklist
Button Link: https://forms.example.com/pm-checklist
CTA Type: Content Upgrade
Style: Card
Image: [Upload preview image]
```

### **Template 3: Product Promotion**
```yaml
CTA Title: Product Strategy Playbook
Headline: Master product strategy in 7 days
Description: The complete playbook for building products that actually solve problems.
Button Text: Get the Playbook
Button Link: /products/product-strategy-playbook
CTA Type: Product
Style: Feature
Related Product: [Select "Product Strategy Playbook"]
```

### **Template 4: Free Course Teaser**
```yaml
CTA Title: Free UX Research Course
Headline: Learn user research from scratch
Description: Free 5-day email course. Go from beginner to confident researcher.
Button Text: Start Free Course
Button Link: https://course.example.com/ux-research
CTA Type: Free Resource
Style: Card
```

---

## Analytics & Tracking

### Built-in Tracking Fields
```yaml
Metadata:
  Tracking ID: "cta-newsletter-generic-001"
  Conversion Goal: "email-signup"
  Internal Notes: "Main newsletter CTA for all blog posts"
```

### Google Analytics Integration
```tsx
<button
  onClick={() => {
    // Track CTA click
    gtag('event', 'cta_click', {
      cta_id: cta._id,
      cta_type: cta.ctaType,
      cta_headline: cta.headline,
      page_slug: post.slug,
    })
  }}
>
  {buttonText}
</button>
```

---

## Best Practices

### **1. CTA Hierarchy**
```
Priority Levels:
- High (80-100): Limited-time offers, launches
- Medium (40-79): Main products, newsletter
- Low (0-39): General content upgrades
```

### **2. CTA Frequency**
- ✅ DO: Use 1-2 CTAs per post
- ❌ DON'T: Overwhelm with 3+ CTAs

### **3. Positioning**
- **Inline (~50%)**: Best for content upgrades
- **End (~100%)**: Best for newsletter, products

### **4. Copy Guidelines**
- **Headline**: 5-10 words, clear benefit
- **Description**: 1-2 sentences, WIIFM ("What's in it for me?")
- **Button**: Action verb + value (e.g., "Download Checklist")

### **5. Visual Consistency**
- Use **Card** for most CTAs
- Use **Banner** for site-wide campaigns
- Use **Feature** sparingly (1x per post max)

### **6. Product Integration**
- Always link products when promoting them
- Auto-displays price, image, title
- Keeps CTA data in sync

---

## A/B Testing Strategy

### Create Variants
```
CTA v1: "Join 10,000+ PMs"
CTA v2: "Get Weekly Product Tips"
CTA v3: "Subscribe for Free Insights"
```

### Test Placement
```
Test A: Inline at 40%
Test B: Inline at 60%
Test C: End-of-post only
```

### Measure Results
```
Tracking IDs:
- cta-newsletter-v1
- cta-newsletter-v2
- cta-newsletter-v3

Compare conversion rates in analytics
```

---

## Mobile Optimization

### Desktop Layout
```
[Image]  Headline
         Description
         [Button]
```

### Mobile Layout
```
[Image]
Headline
Description
[Button]
```

### Mobile Settings
```
Show on Mobile: ✅ Yes (default)
```
Disable for inline CTAs if content is short on mobile.

---

## Performance Optimization

### Image Loading
```tsx
<Image
  src={displayImage}
  alt={alt}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 33vw"
  loading="lazy"
/>
```

### Conditional Rendering
```tsx
// Only render if CTA is active
{cta?.active && <BlogCTA {...cta} />}
```

---

## Troubleshooting

### CTA Not Showing
1. ✅ Check `active: true` in Sanity
2. ✅ Verify CTA is selected in blog post
3. ✅ Confirm GROQ query includes CTA data
4. ✅ Check component receives CTA props

### Styling Issues
1. ✅ Add `not-prose` class to CTA wrapper
2. ✅ Use negative margins if needed (`-mx-0`)
3. ✅ Test on mobile and desktop

### Image Not Loading
1. ✅ Verify Sanity image asset exists
2. ✅ Check Next.js image domain config
3. ✅ Use product image as fallback

---

## Migration Guide

### Adding to Existing Blog
1. ✅ Deploy `blogCTA` schema
2. ✅ Update blog schema with `ctas` field
3. ✅ Update GROQ queries
4. ✅ Add `BlogCTA` component
5. ✅ Update blog post page template
6. ✅ Create first CTA template in Sanity
7. ✅ Add to blog post (optional)

### Backward Compatibility
```tsx
// Works with or without CTAs
{post.ctas?.inlineContent && <BlogCTA {...} />}
{post.ctas?.endOfPost && <BlogCTA {...} />}
```
Existing posts without CTAs render normally.

---

## Future Enhancements

### Roadmap
- [ ] A/B testing variants (built-in)
- [ ] Personalization (show different CTAs based on user)
- [ ] Exit intent CTAs
- [ ] Scroll-triggered CTAs
- [ ] CTA templates library
- [ ] Performance analytics dashboard

### Extensibility
Current schema supports:
- Custom tracking IDs
- Conversion goal labels
- Priority ordering
- Active/inactive toggle
- Metadata for future features

---

## Quick Start Checklist

### 1. Create Your First CTA
```
✅ Go to Sanity Studio → Blog CTA Block
✅ Click "Create"
✅ Fill required fields:
   - CTA Title (internal)
   - Headline
   - Button Text
   - Button Link
   - CTA Type
✅ Set style: Card
✅ Set active: Yes
✅ Publish
```

### 2. Add to Blog Post
```
✅ Edit blog post
✅ Scroll to "Call-to-Action Blocks"
✅ Select CTA for "End-of-Post CTA"
✅ Leave "Inline CTA" empty (for now)
✅ Publish
```

### 3. Test
```
✅ View blog post on frontend
✅ Scroll to end
✅ Verify CTA appears
✅ Click button to test link
✅ Check mobile view
```

---

**System Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Production Ready ✅
