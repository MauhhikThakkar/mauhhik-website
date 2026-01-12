# CURSOR OPERATING RULES

These rules are non-negotiable.

## Tailwind & Styling
1. NEVER introduce non-default Tailwind classes.
   ❌ border-border, bg-background, text-foreground, ring-ring
   ✅ border-zinc-200, bg-white, text-zinc-900

2. DO NOT assume:
   - shadcn/ui
   - CSS variables
   - design tokens
   - theme systems

3. DO NOT modify globals.css unless explicitly instructed.

## Code Safety
4. Scope all changes to explicitly mentioned files only.

5. Before saying “fixed”:
   - List files changed
   - Show exact diffs or snippets

6. Optimize for build stability over visual polish.

## Working Style
7. Small, explicit changes only.
8. No global refactors without approval.