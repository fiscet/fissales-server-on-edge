# Bug Triage & Fix Template — Privacy/Legal Pages Navigation

> **Goal:** Restore a clear path back to the homepage from public legal pages.

---

## 🚨 STEP 1: Critical Info (REQUIRED)

**What's the actual error?**
- **Error message:** None (navigation usability issue)
- **When it happens:** Any time a user visits `/privacy`, `/terms`, or other public legal pages
- **Where you see it:** Page header — clicking the logo does nothing and there is no "Home" link
- **Browser/Environment:** All browsers, production & development

**Can you reproduce it?**
- [x] Always happens
- [ ] Sometimes happens  
- [ ] Only under specific conditions: N/A

---

## ⚡ STEP 2: Quick Assessment

Based on error message, this looks like:
- [ ] **Simple Fix** (typo, syntax, obvious one-liner)
- [x] **Missing File/Import** (navigation link missing)
- [ ] **Type/Interface Issue** (TypeScript errors, wrong data types)
- [ ] **Environment/Config** (API keys, database, environment variables)
- [ ] **Complex System Issue** (requires deeper investigation)

---

## 🎯 STEP 3: Immediate Action

### IF SIMPLE FIX:
**Fix it now:** Add a homepage link via the logo and provide a dedicated "Home" item in the Navbar menu.

Implementation notes:
- Update `Logo` component to accept an optional `href` so we can turn it into a `<Link>` on public pages without impacting other usages.
- Update `Navbar` to pass `href="/"` to `Logo` and add an explicit "Home" menu item that routes to `/`.

No deeper investigation required.

---

## 📋 Implementation Checklist

**Before fixing:**
- [x] Understand the exact change needed
- [x] Know how to test the fix (click logo and new Home menu item on `/privacy`)

**After fixing:**
- [ ] Test the specific error case (logo click + menu item)
- [ ] Check for similar issues elsewhere (other public pages using `Navbar`)
- [ ] Verify no new errors introduced (lint/type-check on modified files)

---

## ✅ Resolution Plan

1. Extend `Logo` component (`components/Logo.tsx`) with optional `href` prop and wrap output in `Link` when provided.
2. Update `Navbar` (`components/landing/Navbar.tsx`) to:
   - Pass `href="/"` to `Logo` so the logo becomes a homepage link.
   - Add a new "Home" menu entry that uses `<Link href="/">Home</Link>` to ensure explicit navigation back to the homepage.
3. Manually verify on `/privacy` and `/terms` that both logo and menu link navigate home.
4. Run lint/type-check if required.

---

## 📌 Status

- **Triaged:** ✅
- **Implementation:** Pending
- **Testing:** Pending
- **Completion:** Pending


