# Author Attribution Box

## Overview
Minimal author attribution box at the end of blog posts. Displays author name, bio, and portfolio link with a clean, consistent design.

**Component:** `src/components/AuthorAttribution.tsx`  
**Location:** End of blog post content  
**Style:** Minimal, dark theme

---

## Features

### **Displayed Information:**
- Author name (required)
- Short bio (optional, 1-2 sentences)
- Portfolio/about link (optional)
- Author picture (optional)

### **Design:**
- Minimal layout
- Dark theme consistent
- Responsive (mobile/desktop)
- Optional author picture
- Clean typography

---

## Schema Enhancements

### **Author Schema** (`src/sanity/schemaTypes/authorType.ts`)

**Added Fields:**
```typescript
{
  name: string (required)
  bio: text (optional, max 200 chars)
  portfolioLink: url (optional)
  picture: image (optional)
}
```

**Fields:**
- **Name:** Author's full name
- **Bio:** Brief 1-2 sentence bio
- **Portfolio Link:** Link to portfolio/about page
- **Picture:** Profile picture (80x80px display)

---

## Component Structure

### **Layout:**
```
┌─────────────────────────────────────┐
│ ABOUT THE AUTHOR                    │
│                                     │
│ [Picture]  Author Name              │
│            Short bio text here...   │
│            View portfolio →         │
└─────────────────────────────────────┘
```

### **Responsive:**
- **Desktop:** Picture + info side-by-side
- **Mobile:** Picture above info (stacked)

---

## Visual Design

### **Container:**
```css
not-prose (removes prose styling)
mt-20 (spacing from content above)
pt-12 (padding top)
border-t border-zinc-900 (top border)
max-w-2xl mx-auto (centered, matches content)
```

### **Author Picture:**
```css
w-16 h-16 sm:w-20 sm:h-20 (80px desktop, 64px mobile)
rounded-full (circle)
bg-zinc-900 border border-zinc-800
object-cover
```

### **Typography:**
- **Label:** "ABOUT THE AUTHOR" (uppercase, small, muted)
- **Name:** Large, semibold, white
- **Bio:** Small, muted, relaxed leading
- **Link:** Small, muted, hover effect

---

## Component Props

### **Interface:**
```typescript
interface AuthorAttributionProps {
  author?: {
    name: string
    bio?: string
    portfolioLink?: string
    picture?: {
      alt?: string
      asset: {
        _id: string
        url: string
        metadata?: { ... }
      }
    }
  }
}
```

### **Behavior:**
- Returns `null` if no author or no author name
- Gracefully handles missing optional fields
- Shows only available information

---

## Integration

### **In Blog Detail Page:**
```typescript
import AuthorAttribution from "@/components/AuthorAttribution"

// Inside component:
<AuthorAttribution author={post.author} />
```

### **Placement:**
- After Email Capture component
- Before Related Projects section
- Within content container
- Aligned with article content

---

## Content Flow

### **Blog Post Structure:**
```
1. Hero Section
2. TL;DR (if exists)
3. Hero Image (if exists)
4. Main Content
5. PM Takeaway (if exists)
6. Tags (if exist)
7. Email Capture
8. Author Attribution ← NEW
9. Related Projects (if exist)
```

---

## GROQ Query Update

### **Enhanced Author Fetch:**
```groq
"author": author->{ 
  name,
  bio,
  portfolioLink,
  picture {
    alt,
    asset->{
      _id,
      url,
      metadata {
        dimensions { width, height, aspectRatio }
      }
    }
  }
}
```

**Fetches:**
- Author name
- Author bio
- Portfolio link
- Picture with dimensions

---

## Usage in Sanity

### **Setting Up Author:**

1. **Navigate to:** "Author" in Sanity Studio
2. **Create/Edit Author:**
   - Name: "Mauhhik" (required)
   - Bio: "Product Manager specializing in..." (optional)
   - Portfolio Link: "https://mauhhik.dev" (optional)
   - Picture: Upload profile picture (optional)
3. **Link to Blog Post:**
   - Edit blog post
   - Select author from dropdown
   - Publish

---

## Conditional Rendering

### **Shows If:**
- Author exists
- Author has name

### **Hides If:**
- No author assigned
- Author name is empty

### **Optional Fields:**
- Bio: Shows if provided
- Portfolio Link: Shows if provided
- Picture: Shows if provided

---

## Design Details

### **Spacing:**
- Top margin: 80px (`mt-20`)
- Top padding: 48px (`pt-12`)
- Border separator above
- Matches content width

### **Picture:**
- Size: 80px desktop, 64px mobile
- Circular crop
- Border for definition
- Responsive sizing

### **Link:**
- External link icon
- Opens in new tab
- Hover state
- Muted color

---

## Example Output

### **With All Fields:**
```
─────────────────────────────────────
ABOUT THE AUTHOR

[Picture]  Mauhhik
           Product Manager specializing in 
           AI-first products and SaaS MVPs.
           View portfolio →
```

### **Minimal (Name Only):**
```
─────────────────────────────────────
ABOUT THE AUTHOR

Mauhhik
```

### **With Bio + Link:**
```
─────────────────────────────────────
ABOUT THE AUTHOR

Mauhhik
Product Manager with hands-on experience 
in AI tools and real-world delivery.
View portfolio →
```

---

## Styling Breakdown

### **Container:**
```tsx
<div className="not-prose mt-20 pt-12 border-t border-zinc-900 max-w-2xl mx-auto">
```

**Classes:**
- `not-prose` - Removes prose styling interference
- `mt-20` - Top margin (80px)
- `pt-12` - Top padding (48px)
- `border-t border-zinc-900` - Top border separator
- `max-w-2xl mx-auto` - Centered, matches content width

### **Picture Container:**
```tsx
<div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800">
```

**Responsive:**
- Mobile: 64px (`w-16 h-16`)
- Desktop: 80px (`sm:w-20 sm:h-20`)

### **Author Info:**
```tsx
<div className="flex-1">
  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
    About the author
  </span>
  <h3 className="text-lg font-semibold text-white mb-2">
    {author.name}
  </h3>
  {/* Bio and link */}
</div>
```

---

## Responsive Behavior

### **Desktop (sm and up):**
```
┌─────────────────────────────────────┐
│ ABOUT THE AUTHOR                    │
│                                     │
│ [Picture]  Author Name              │
│            Bio text...               │
│            View portfolio →         │
└─────────────────────────────────────┘
```

### **Mobile:**
```
┌─────────────────────────────────────┐
│ ABOUT THE AUTHOR                    │
│                                     │
│        [Picture]                     │
│                                     │
│        Author Name                   │
│        Bio text...                   │
│        View portfolio →              │
└─────────────────────────────────────┘
```

---

## Accessibility

### **Features:**
- Semantic HTML structure
- Alt text for author picture
- External link indicators
- Proper heading hierarchy
- Screen reader friendly

### **Link Behavior:**
- `target="_blank"` - Opens in new tab
- `rel="noopener noreferrer"` - Security
- External link icon for clarity

---

## Testing Checklist

### **Content Display:**
- [x] Author name shows
- [x] Bio shows (if provided)
- [x] Portfolio link shows (if provided)
- [x] Picture shows (if provided)
- [x] Component hides if no author

### **Layout:**
- [x] Responsive on mobile
- [x] Responsive on desktop
- [x] Spacing consistent
- [x] Aligned with content
- [x] Border separator visible

### **Functionality:**
- [x] Portfolio link opens correctly
- [x] External link icon shows
- [x] Picture loads correctly
- [x] Hover states work

---

## Future Enhancements

### **Potential Additions:**
- [ ] Social media links
- [ ] Author email
- [ ] Author location
- [ ] Multiple authors support
- [ ] Author badges/credentials
- [ ] Related posts by author

---

## Code Structure

### **Component:**
```typescript
export default function AuthorAttribution({ author }: AuthorAttributionProps) {
  // Early return if no author
  if (!author || !author.name) return null

  // Build image URL
  const imageUrl = author.picture?.asset
    ? urlFor(author.picture).width(80).height(80).fit('crop').url()
    : null

  // Render attribution box
  return (
    <div>
      {/* Picture */}
      {/* Author info */}
    </div>
  )
}
```

---

## Image Optimization

### **Picture Sizing:**
```typescript
urlFor(author.picture)
  .width(80)
  .height(80)
  .fit('crop')
  .url()
```

**Settings:**
- Width: 80px
- Height: 80px
- Fit: Crop (square)
- Optimized for display size

---

**Status:** ✅ Complete  
**Last Updated:** January 13, 2026  
**Component Type:** Server Component  
**Breaking Changes:** None
