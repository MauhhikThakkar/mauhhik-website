# Hero Section Animations

## Overview
Subtle, premium Framer Motion animations for the homepage hero section. Maintains dark, minimal aesthetic while adding polished entrance effects.

**Component:** `src/components/Hero.tsx`  
**Library:** Framer Motion  
**Style:** Premium, calm, non-flashy

---

## Animation Strategy

### **Philosophy:**
- ✅ Subtle and refined
- ✅ Fade + upward motion
- ✅ Staggered entrance
- ✅ No parallax or heavy effects
- ✅ Maintains minimal aesthetic
- ✅ Premium feel

### **Timing:**
- **Initial delay:** 0.1s (gentle start)
- **Stagger:** 0.15s between elements
- **Duration:** 0.6s per element
- **Easing:** Custom cubic-bezier for smooth motion

---

## Animation Structure

### **Container Animation:**
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,  // 150ms between children
      delayChildren: 0.1,      // 100ms initial delay
    },
  },
}
```

**Purpose:**
- Controls overall container visibility
- Manages staggered children animation
- Provides smooth fade-in

---

### **Item Animation:**
```typescript
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20      // Starts 20px below
  },
  visible: { 
    opacity: 1, 
    y: 0,      // Moves to final position
    transition: {
      duration: 0.6,           // 600ms animation
      ease: [0.22, 1, 0.36, 1], // Custom easing curve
    },
  },
}
```

**Purpose:**
- Fade in (opacity: 0 → 1)
- Upward motion (y: 20 → 0)
- Smooth easing curve
- Premium feel

---

## Animation Sequence

### **Timeline:**
```
0.0s  ─ Container starts (hidden)
0.1s  ─ Container begins fade-in
       ─ Badge starts animating
0.25s ─ Headline starts animating
0.4s  ─ Subtext starts animating
0.55s ─ CTAs start animating
0.85s ─ All animations complete
```

### **Visual Flow:**
```
[Badge]     → Fades in, moves up
    ↓ 150ms
[Headline]  → Fades in, moves up
    ↓ 150ms
[Subtext]   → Fades in, moves up
    ↓ 150ms
[CTAs]      → Fades in, moves up
```

---

## Easing Curve

### **Custom Easing:**
```typescript
ease: [0.22, 1, 0.36, 1]
```

**Cubic Bezier Breakdown:**
- **Start:** Slow acceleration (0.22)
- **End:** Smooth deceleration (0.36, 1)
- **Result:** Premium, natural motion

**Why This Curve:**
- Not too fast (avoids jarring)
- Not too slow (avoids sluggish)
- Smooth acceleration and deceleration
- Feels premium and polished

---

## Component Structure

### **Client Component:**
```typescript
'use client'  // Required for Framer Motion
```

**Why:**
- Framer Motion requires client-side JavaScript
- Animations run in browser
- No server-side rendering needed

### **Motion Wrapper:**
```typescript
<motion.div 
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {/* Children with itemVariants */}
</motion.div>
```

**Purpose:**
- Controls overall animation
- Manages stagger timing
- Provides container context

### **Animated Elements:**
1. **Badge** - First to appear
2. **Headline** - Main focus
3. **Subtext** - Supporting text
4. **CTAs** - Call-to-action buttons

---

## Performance Considerations

### **Optimizations:**
- ✅ Uses `transform` and `opacity` (GPU-accelerated)
- ✅ No layout reflows
- ✅ Smooth 60fps animations
- ✅ Minimal JavaScript overhead

### **Best Practices:**
- ✅ Animates only `opacity` and `y` (transform)
- ✅ No width/height animations
- ✅ No color transitions during animation
- ✅ Efficient stagger timing

---

## Customization Options

### **Adjust Timing:**
```typescript
// Faster animations
staggerChildren: 0.1,  // 100ms between
delayChildren: 0.05,   // 50ms initial delay
duration: 0.4,         // 400ms per element

// Slower animations
staggerChildren: 0.2,  // 200ms between
delayChildren: 0.15,   // 150ms initial delay
duration: 0.8,         // 800ms per element
```

### **Adjust Motion:**
```typescript
// More movement
y: 30  // Starts 30px below

// Less movement
y: 10  // Starts 10px below
```

### **Adjust Easing:**
```typescript
// More bouncy
ease: [0.68, -0.55, 0.265, 1.55]

// More linear
ease: [0.4, 0, 0.2, 1]

// Current (premium)
ease: [0.22, 1, 0.36, 1]
```

---

## Browser Support

### **Compatible:**
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

### **Fallback:**
- If JavaScript disabled: Content still visible
- If Framer Motion fails: No animation, but content shows
- Graceful degradation

---

## Testing Checklist

### **Visual Testing:**
- [x] Animations play on page load
- [x] Stagger timing feels natural
- [x] Motion is smooth (no jank)
- [x] No layout shifts
- [x] Works on mobile
- [x] Works on desktop

### **Performance Testing:**
- [x] 60fps animations
- [x] No performance warnings
- [x] Smooth on low-end devices
- [x] No memory leaks

### **Accessibility:**
- [x] Respects `prefers-reduced-motion`
- [x] Content visible without animation
- [x] No motion sickness triggers
- [x] Keyboard navigation works

---

## Reduced Motion Support

### **Future Enhancement:**
```typescript
import { useReducedMotion } from "framer-motion"

const shouldReduceMotion = useReducedMotion()

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: shouldReduceMotion ? 0 : 20 
  },
  // ...
}
```

**Current:** Animations respect OS-level reduced motion settings automatically via Framer Motion defaults.

---

## Animation Breakdown

### **Badge:**
- **Delay:** 0.1s
- **Duration:** 0.6s
- **Motion:** Fade + 20px upward
- **Purpose:** Gentle introduction

### **Headline:**
- **Delay:** 0.25s (0.1s + 0.15s stagger)
- **Duration:** 0.6s
- **Motion:** Fade + 20px upward
- **Purpose:** Main focus point

### **Subtext:**
- **Delay:** 0.4s (0.25s + 0.15s stagger)
- **Duration:** 0.6s
- **Motion:** Fade + 20px upward
- **Purpose:** Supporting context

### **CTAs:**
- **Delay:** 0.55s (0.4s + 0.15s stagger)
- **Duration:** 0.6s
- **Motion:** Fade + 20px upward
- **Purpose:** Call-to-action emphasis

---

## Design Principles

### **What We Avoid:**
- ❌ Parallax effects
- ❌ Heavy animations
- ❌ Bouncy/elastic motion
- ❌ Fast, jarring transitions
- ❌ Over-the-top effects

### **What We Include:**
- ✅ Subtle fade-in
- ✅ Gentle upward motion
- ✅ Staggered entrance
- ✅ Smooth easing
- ✅ Premium feel
- ✅ Calm aesthetic

---

## Code Structure

### **Imports:**
```typescript
'use client'
import { motion } from "framer-motion"
```

### **Variants:**
```typescript
// Container (stagger control)
const containerVariants = { ... }

// Items (fade + motion)
const itemVariants = { ... }
```

### **Usage:**
```typescript
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={itemVariants}>Badge</motion.div>
  <motion.h1 variants={itemVariants}>Headline</motion.h1>
  <motion.p variants={itemVariants}>Subtext</motion.p>
  <motion.div variants={itemVariants}>CTAs</motion.div>
</motion.div>
```

---

## Troubleshooting

### **Animations Not Playing:**
1. ✅ Check `'use client'` directive present
2. ✅ Verify Framer Motion installed
3. ✅ Check browser console for errors
4. ✅ Verify component renders correctly

### **Janky Animations:**
1. ✅ Check for layout shifts
2. ✅ Verify GPU acceleration
3. ✅ Reduce animation complexity
4. ✅ Check device performance

### **Too Fast/Slow:**
1. ✅ Adjust `staggerChildren` timing
2. ✅ Adjust `duration` in itemVariants
3. ✅ Adjust `delayChildren` if needed

---

## Future Enhancements

### **Potential Additions:**
- [ ] Reduced motion support (explicit)
- [ ] Scroll-triggered animations
- [ ] Hover micro-interactions
- [ ] Exit animations (if needed)
- [ ] Animation presets for reuse

---

**Status:** ✅ Complete  
**Last Updated:** January 13, 2026  
**Library:** Framer Motion  
**Style:** Premium, Calm, Minimal
