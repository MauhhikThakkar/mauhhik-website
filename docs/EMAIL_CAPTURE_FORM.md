# Email Capture Form

## Overview
Simple, functional email capture form with success state. Client Component that works seamlessly with Server Components in Next.js App Router.

**Component:** `src/components/EmailCapture.tsx`  
**Location:** End of blog posts  
**Status:** Functional (no backend integration yet)

---

## Features

### **Form Functionality:**
- ✅ Email input with validation
- ✅ Submit button with loading state
- ✅ Success state with confirmation
- ✅ Error handling
- ✅ Client-side only (no backend)

### **UX:**
- ✅ Clean, minimal design
- ✅ Loading spinner during submission
- ✅ Success confirmation
- ✅ Error messages
- ✅ Disabled states

---

## Component States

### **1. Default Form State:**
```
┌─────────────────────────────────────┐
│         📧                          │
│                                     │
│  I share how I think about...      │
│                                     │
│  [Email Input] [Subscribe]        │
│                                     │
│    No spam. Unsubscribe anytime.   │
└─────────────────────────────────────┘
```

### **2. Loading State:**
```
┌─────────────────────────────────────┐
│         📧                          │
│                                     │
│  I share how I think about...      │
│                                     │
│  [Email Input] [🔄 Subscribing...] │
│                                     │
│    No spam. Unsubscribe anytime.   │
└─────────────────────────────────────┘
```

### **3. Success State:**
```
┌─────────────────────────────────────┐
│         ✓                           │
│                                     │
│  You're subscribed!                 │
│                                     │
│  Thanks for joining. I'll share    │
│  insights on building AI-first...   │
└─────────────────────────────────────┘
```

### **4. Error State:**
```
┌─────────────────────────────────────┐
│         📧                          │
│                                     │
│  I share how I think about...      │
│                                     │
│  [Email Input (red border)]        │
│  Please enter a valid email        │
│  [Subscribe]                        │
└─────────────────────────────────────┘
```

---

## State Management

### **State Variables:**
```typescript
const [email, setEmail] = useState('')
const [isSubmitting, setIsSubmitting] = useState(false)
const [isSuccess, setIsSuccess] = useState(false)
const [error, setError] = useState('')
```

### **State Flow:**
```
User types email
  ↓
User clicks Subscribe
  ↓
isSubmitting = true
  ↓
Validation check
  ↓
Simulate API call (800ms)
  ↓
isSuccess = true
  ↓
Show success message
```

---

## Email Validation

### **Validation Rules:**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**Checks:**
- Contains `@` symbol
- Has domain (text after `@`)
- Has TLD (text after `.`)
- No spaces

### **Error Handling:**
- Invalid email: Shows error message
- Empty email: Button disabled
- Network error: Shows error message
- Success: Shows confirmation

---

## Form Submission

### **Process:**
1. **Prevent default** form submission
2. **Clear previous errors**
3. **Validate email** format
4. **Set loading state** (`isSubmitting = true`)
5. **Simulate API call** (800ms delay)
6. **Store in localStorage** (temporary)
7. **Show success state**
8. **Reset form**

### **Current Implementation:**
```typescript
// Simulate API call
await new Promise((resolve) => setTimeout(resolve, 800))

// Store in localStorage (temporary)
const subscriptions = JSON.parse(
  localStorage.getItem('emailSubscriptions') || '[]'
)
if (!subscriptions.includes(email)) {
  subscriptions.push(email)
  localStorage.setItem('emailSubscriptions', JSON.stringify(subscriptions))
}
```

**Note:** This is temporary. Replace with actual API call when backend is ready.

---

## Success State

### **Visual Design:**
- Green accent color (emerald)
- Checkmark icon
- Success message
- Confirmation text

### **Styling:**
```css
bg-zinc-950/30
border border-emerald-900/50
text-emerald-400 (icon)
```

### **Message:**
```
You're subscribed!
Thanks for joining. I'll share insights 
on building AI-first products.
```

---

## Error Handling

### **Error Types:**
1. **Invalid Email:**
   - Message: "Please enter a valid email address"
   - Visual: Red border on input
   - Clears on input change

2. **Network Error:**
   - Message: "Something went wrong. Please try again."
   - Visual: Error message below input

### **Error Display:**
```tsx
{error && (
  <p id="email-error" className="text-xs text-red-400 mt-2 text-left">
    {error}
  </p>
)}
```

---

## Loading State

### **Visual Indicators:**
- Spinner animation
- Button text: "Subscribing..."
- Input disabled
- Button disabled

### **Spinner:**
```tsx
<svg className="animate-spin h-4 w-4">
  {/* Spinner SVG */}
</svg>
```

---

## Accessibility

### **Features:**
- `aria-label` on email input
- `aria-invalid` for error state
- `aria-describedby` for error message
- `required` attribute on input
- Semantic HTML structure

### **Keyboard Navigation:**
- Tab through form fields
- Enter to submit
- Escape to clear (future enhancement)

---

## Integration

### **In Blog Detail Page:**
```typescript
import EmailCapture from "@/components/EmailCapture"

// Inside component:
<EmailCapture />
```

### **Placement:**
- After blog content
- Before Author Attribution
- Within content container
- Aligned with article content

---

## Design Details

### **Container:**
```css
not-prose (removes prose styling)
my-16 (vertical spacing)
max-w-2xl mx-auto (centered, matches content)
bg-zinc-950/30 (subtle background)
border border-zinc-900 (minimal border)
rounded-2xl (rounded corners)
p-8 md:p-10 (responsive padding)
```

### **Input:**
```css
bg-zinc-900 (dark background)
border border-zinc-800 (default)
border-red-500 (error state)
focus:border-zinc-700 (focus state)
focus:ring-1 focus:ring-zinc-700 (focus ring)
```

### **Button:**
```css
bg-zinc-800 (default)
hover:bg-zinc-700 (hover)
disabled:opacity-50 (disabled)
whitespace-nowrap (prevents wrapping)
```

---

## Future Backend Integration

### **Replace This:**
```typescript
// Current: localStorage
localStorage.setItem('emailSubscriptions', JSON.stringify(subscriptions))
```

### **With This:**
```typescript
// Future: API call
const response = await fetch('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
})

if (!response.ok) {
  throw new Error('Subscription failed')
}
```

### **Backend Options:**
- Next.js API route
- Third-party service (ConvertKit, Mailchimp, etc.)
- Custom backend API
- Serverless function

---

## LocalStorage Usage

### **Current Implementation:**
- Stores emails in `localStorage`
- Key: `'emailSubscriptions'`
- Format: JSON array
- Prevents duplicates

### **Limitations:**
- Client-side only
- Not persistent across devices
- No server-side processing
- Temporary solution

### **When Backend Ready:**
- Remove localStorage logic
- Replace with API call
- Handle server-side storage
- Add proper error handling

---

## Testing Checklist

### **Form Functionality:**
- [x] Email input accepts text
- [x] Submit button works
- [x] Loading state shows
- [x] Success state shows
- [x] Error state shows for invalid email
- [x] Form resets after success

### **Validation:**
- [x] Invalid email shows error
- [x] Empty email disables button
- [x] Valid email submits successfully
- [x] Error clears on input change

### **UX:**
- [x] Loading spinner visible
- [x] Button disabled during submission
- [x] Input disabled during submission
- [x] Success message clear
- [x] No layout shift

### **Accessibility:**
- [x] Keyboard navigation works
- [x] Screen reader friendly
- [x] Error messages accessible
- [x] Focus states visible

---

## Code Structure

### **Component:**
```typescript
'use client'

export default function EmailCapture() {
  // State
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  // Handlers
  const handleSubmit = async (e) => {
    // Validation
    // Submission
    // Success/Error handling
  }

  // Render
  if (isSuccess) {
    return <SuccessState />
  }

  return <FormState />
}
```

---

## Customization Options

### **Change Copy:**
```typescript
<p className="text-lg text-zinc-300 leading-relaxed mb-6">
  {/* Your custom copy */}
</p>
```

### **Change Colors:**
```typescript
// Success state
border-emerald-900/50 → border-blue-900/50
text-emerald-400 → text-blue-400

// Error state
text-red-400 → text-orange-400
```

### **Change Timing:**
```typescript
// Faster submission
await new Promise((resolve) => setTimeout(resolve, 400))

// Slower submission
await new Promise((resolve) => setTimeout(resolve, 1200))
```

---

## Troubleshooting

### **Form Not Submitting:**
1. ✅ Check `'use client'` directive
2. ✅ Verify form has `onSubmit` handler
3. ✅ Check browser console for errors
4. ✅ Verify email validation logic

### **Success State Not Showing:**
1. ✅ Check `isSuccess` state updates
2. ✅ Verify localStorage logic
3. ✅ Check conditional rendering
4. ✅ Verify state reset

### **Error Not Clearing:**
1. ✅ Check `onChange` handler
2. ✅ Verify `setError('')` called
3. ✅ Check error state management

---

## Performance

### **Optimizations:**
- ✅ Client-side only (no server calls)
- ✅ Minimal re-renders
- ✅ Efficient state management
- ✅ No external dependencies

### **Bundle Size:**
- Minimal impact
- Only React hooks used
- No heavy libraries

---

## Security Notes

### **Current (No Backend):**
- Email stored in localStorage only
- No server-side validation
- No rate limiting
- No spam protection

### **When Backend Added:**
- Server-side validation
- Rate limiting
- Spam protection
- Email verification
- GDPR compliance

---

## Best Practices

### **Form UX:**
- ✅ Clear error messages
- ✅ Loading feedback
- ✅ Success confirmation
- ✅ Disabled states
- ✅ Accessible labels

### **Code Quality:**
- ✅ TypeScript types
- ✅ Error handling
- ✅ State management
- ✅ Clean component structure

---

**Status:** ✅ Complete  
**Last Updated:** January 13, 2026  
**Component Type:** Client Component  
**Backend Integration:** Not yet implemented
