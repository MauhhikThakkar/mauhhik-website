# Digital Product Schema (V1)

## Overview
Minimal digital product schema for Sanity CMS. Designed for courses, guides, templates, and tools.

**Status:** V1 - Schema only, no checkout logic  
**Type Name:** `productV1`  
**File:** `src/sanity/schemaTypes/productV1.ts`

---

## Fields

### 1. **Title** (Required)
```typescript
name: 'title'
type: 'string'
validation: Required, max 100 characters
```
**Description:** Product name (e.g., "Product Strategy Playbook")

---

### 2. **Slug** (Required)
```typescript
name: 'slug'
type: 'slug'
options: { source: 'title', maxLength: 96 }
validation: Required
```
**Description:** URL-friendly identifier, auto-generated from title

---

### 3. **Short Description** (Required)
```typescript
name: 'shortDescription'
type: 'text'
rows: 2
validation: Required, max 200 characters
```
**Description:** SEO-friendly summary (1-2 sentences, 120-160 characters optimal)

**SEO Best Practice:**
- Keep between 120-160 characters
- Include primary keyword
- Clear value proposition
- Action-oriented

---

### 4. **Long Description** (Required)
```typescript
name: 'longDescription'
type: 'richText'
validation: Required
```
**Description:** Full product description with formatting (portable text)

**Supports:**
- Headings (H2, H3, H4)
- Paragraphs
- Lists (bulleted, numbered)
- Bold, italic, code
- Links
- Images
- Blockquotes

---

### 5. **Status** (Required)
```typescript
name: 'status'
type: 'string'
options: ['draft', 'live', 'archived']
initialValue: 'draft'
validation: Required
```
**Description:** Current state of the product

**Values:**
- `draft` - Not published (default)
- `live` - Published and available
- `archived` - No longer active

---

### 6. **Price** (Optional)
```typescript
name: 'price'
type: 'number'
validation: Min 0, 2 decimal precision
```
**Description:** Product price (optional for now - no checkout logic yet)

**Notes:**
- Can be `null` or `undefined` for free products
- Stored as number (e.g., 49.99)
- No currency field (assumes USD for now)

---

### 7. **CTA Text** (Optional)
```typescript
name: 'ctaText'
type: 'string'
initialValue: 'Get Access'
validation: Max 30 characters
```
**Description:** Call-to-action button text

**Examples:**
- "Get Access"
- "Download Now"
- "Start Learning"
- "Buy Now"

---

### 8. **Related Blog Posts** (Optional)
```typescript
name: 'relatedBlogPosts'
type: 'array'
of: [{ type: 'reference', to: [{ type: 'blog' }] }]
validation: Max 5 references
```
**Description:** Link to relevant blog posts that provide context or deeper insights

**Use Cases:**
- Link to blog posts that explain the methodology
- Connect product to related articles
- Cross-link content for SEO

---

## Schema Preview

### In Sanity Studio:
```
🟢 Product Strategy Playbook
live • $49.00 • Master product strategy in 7 days...

⚪ PM Interview Toolkit
draft • Free • Ace your next product manager interview...

⚫ Old Template Library
archived • $29.00 • Legacy templates (no longer updated)
```

**Preview Format:**
- Status emoji (🟢 live, ⚪ draft, ⚫ archived)
- Title
- Status • Price • Short description

---

## Ordering Options

### By Status:
```
draft → live → archived
```

### By Title (A-Z):
```
Alphabetical sorting
```

---

## Example Product

```typescript
{
  title: "Product Strategy Playbook",
  slug: "product-strategy-playbook",
  shortDescription: "Master product strategy in 7 days. Go from vague ideas to clear roadmaps using battle-tested PM frameworks.",
  longDescription: [
    {
      _type: "block",
      children: [
        {
          _type: "span",
          text: "This playbook contains..."
        }
      ]
    }
  ],
  status: "live",
  price: 49.99,
  ctaText: "Get the Playbook",
  relatedBlogPosts: [
    { _ref: "blog-post-id-1" },
    { _ref: "blog-post-id-2" }
  ]
}
```

---

## Usage in Sanity Studio

### Creating a Product:

1. **Navigate to:** "Digital Product (V1)" in Sanity Studio
2. **Click:** "Create"
3. **Fill Required Fields:**
   - Title
   - Slug (auto-generates from title)
   - Short Description
   - Long Description
   - Status
4. **Fill Optional Fields:**
   - Price (if applicable)
   - CTA Text (defaults to "Get Access")
   - Related Blog Posts (select from blog posts)
5. **Save/Publish**

---

## GROQ Query Example

### Fetch All Live Products:
```groq
*[_type == "productV1" && status == "live"] {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  longDescription,
  status,
  price,
  ctaText,
  "relatedBlogPosts": relatedBlogPosts[]->{
    title,
    "slug": slug.current
  }
}
```

### Fetch Single Product by Slug:
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
    title,
    "slug": slug.current,
    shortDescription
  }
}
```

---

## Future Enhancements (V2+)

### Planned Additions:
- [ ] Currency field (USD, EUR, GBP, etc.)
- [ ] Purchase link (Gumroad, Stripe, etc.)
- [ ] Delivery method (instant download, email, etc.)
- [ ] Product type (course, guide, template, toolkit)
- [ ] Hero image
- [ ] Preview samples
- [ ] Included items list
- [ ] Learning outcomes
- [ ] Testimonials
- [ ] SEO fields (meta title, description)
- [ ] Analytics tracking

### Not Included in V1:
- ❌ Checkout logic
- ❌ Payment processing
- ❌ Inventory management
- ❌ Discount codes
- ❌ Bundles
- ❌ Subscriptions

---

## Migration Notes

### If You Have Existing Products:

**Option 1: Use Both Schemas**
- Keep `product` (comprehensive) for existing products
- Use `productV1` for new minimal products
- Migrate gradually

**Option 2: Migrate to V1**
- Export existing product data
- Map fields to V1 structure
- Import into `productV1` documents

**Option 3: Extend V1**
- Add fields as needed
- Keep minimal core
- Version as V1.1, V1.2, etc.

---

## Validation Rules

### Title:
- ✅ Required
- ✅ Max 100 characters
- ✅ No special validation

### Slug:
- ✅ Required
- ✅ Auto-generated from title
- ✅ Max 96 characters
- ✅ URL-safe

### Short Description:
- ✅ Required
- ✅ Max 200 characters
- ⚠️ Warning if over 160 (SEO optimal)

### Long Description:
- ✅ Required
- ✅ Portable text format
- ✅ Rich formatting supported

### Status:
- ✅ Required
- ✅ Must be: draft, live, or archived
- ✅ Default: draft

### Price:
- ⚠️ Optional
- ✅ Min: 0
- ✅ 2 decimal precision
- ✅ No max limit

### CTA Text:
- ⚠️ Optional
- ✅ Default: "Get Access"
- ✅ Max 30 characters
- ⚠️ Warning if over 30

### Related Blog Posts:
- ⚠️ Optional
- ✅ Max 5 references
- ⚠️ Warning if over 5

---

## TypeScript Interface

```typescript
interface ProductV1 {
  _id: string
  _type: 'productV1'
  title: string
  slug: {
    current: string
  }
  shortDescription: string
  longDescription: any[] // Portable text
  status: 'draft' | 'live' | 'archived'
  price?: number
  ctaText?: string
  relatedBlogPosts?: Array<{
    _ref: string
    _type: 'reference'
  }>
}
```

---

## Best Practices

### Short Description:
- ✅ 120-160 characters for SEO
- ✅ Include primary keyword
- ✅ Clear value proposition
- ✅ Action-oriented language

### Long Description:
- ✅ Use headings for structure
- ✅ Include bullet points for features
- ✅ Add images for visual appeal
- ✅ Link to related blog posts inline

### Status Management:
- ✅ Start as `draft`
- ✅ Change to `live` when ready
- ✅ Use `archived` instead of deleting

### Price:
- ✅ Set to `null` for free products
- ✅ Use 2 decimals (49.99, not 50)
- ✅ Consider future currency support

### Related Blog Posts:
- ✅ Link 2-3 most relevant posts
- ✅ Don't over-link (max 5)
- ✅ Choose posts that add value

---

## Troubleshooting

### Product Not Appearing:
1. ✅ Check `status` is set to `live`
2. ✅ Verify `slug` is generated
3. ✅ Ensure `shortDescription` is filled
4. ✅ Check GROQ query filters

### Rich Text Not Rendering:
1. ✅ Verify `richText` schema is registered
2. ✅ Check PortableText component
3. ✅ Ensure content is valid portable text

### Related Posts Not Loading:
1. ✅ Verify blog posts are published
2. ✅ Check reference IDs are correct
3. ✅ Ensure GROQ query dereferences properly

---

**Schema Version:** V1  
**Last Updated:** January 13, 2026  
**Status:** Production Ready ✅  
**Breaking Changes:** None (new schema)
