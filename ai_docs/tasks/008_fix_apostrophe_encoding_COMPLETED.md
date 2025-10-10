# Task 008: Fix Apostrophe Encoding in FAQSection

**Status**: ✅ COMPLETED  
**Date**: 2025-10-06  
**Component**: `woovector/components/landing/FAQSection.tsx`

## Issue Description
HTML entities (`&rsquo;`) were being used inside JavaScript string literals instead of regular apostrophes. According to our coding rules, HTML entities should only be used in JSX text nodes, not inside JavaScript strings.

## Problem Details
- **Location**: `woovector/components/landing/FAQSection.tsx`
- **Pattern**: Using `&rsquo;` (HTML entity) in JavaScript strings
- **Rule Violated**: `escape-apostrophes-quotes` - HTML entities should only be in JSX text nodes

### Example of the Issue
```typescript
// ❌ Bad - HTML entity in JavaScript string
answer: "WooVector won&rsquo;t affect your site speed..."

// ✅ Good - Regular apostrophe in JavaScript string
answer: "WooVector won't affect your site speed..."
```

## Changes Made

### Fixed Instances
1. **FAQ 1** (line 21): "It&rsquo;s" → "It's", "doesn&rsquo;t" → "doesn't", "We&rsquo;ve" → "We've"
2. **FAQ 2** (line 27): "you&rsquo;ll" → "you'll"
3. **FAQ 3** (line 33): "That&rsquo;s" → "That's"
4. **FAQ 5** (line 45): "won&rsquo;t" → "won't", "doesn&rsquo;t" → "doesn't", "there&rsquo;s" → "there's", "store&rsquo;s" → "store's"
5. **FAQ 7** (line 57): "can&rsquo;t" → "can't"
6. **FAQ 8** (line 63): "WooVector&rsquo;s" → "WooVector's", "you&rsquo;ll" → "you'll", "plan&rsquo;s" → "plan's"
7. **FAQ 9** (line 69): Already fixed - "we&rsquo;ll" → "we'll"
8. **CTA text** (line 146): "we&rsquo;ll" → "we'll"

### Total Replacements
- Replaced 14 instances of `&rsquo;` with regular apostrophes in JavaScript strings

## Validation
✅ No linter errors  
✅ All HTML entities removed from JavaScript strings  
✅ Text will render correctly with proper apostrophes

## Technical Notes

### When to Use HTML Entities
- **JSX text nodes**: Use HTML entities
  ```tsx
  <p>Sarah&rsquo;s store</p>
  ```

- **JavaScript strings in JSX**: Use regular apostrophes
  ```tsx
  <p>{"Sarah's store"}</p>
  ```

- **JavaScript object properties**: Use regular apostrophes
  ```typescript
  const text = "Sarah's store";
  ```

### Why This Matters
1. **Code Consistency**: Follow established project patterns
2. **Readability**: Regular apostrophes are easier to read in code
3. **Best Practices**: HTML entities are only needed when directly in HTML/JSX text nodes
4. **Performance**: Minor improvement by not requiring entity decoding

## Files Modified
- ✅ `woovector/components/landing/FAQSection.tsx`

## Result
All apostrophes in JavaScript strings now use standard characters instead of HTML entities, following proper JSX/JavaScript coding practices. The rendered output remains identical, but the code is cleaner and follows project conventions.

