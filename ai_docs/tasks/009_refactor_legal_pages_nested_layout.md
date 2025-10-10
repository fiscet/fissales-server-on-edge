# Task 009: Refactor Legal Pages to Use Proper Next.js Nested Layout

> **Status:** PENDING APPROVAL
> **Created:** 2025-10-06
> **Task Type:** Architecture Refactor

---

## 1. Task Overview

### Task Title
**Title:** Refactor Legal Pages to Use Proper Next.js Nested Layout Pattern

### Goal Statement
**Goal:** Replace the client-side `legal-layout.tsx` pseudo-layout component with a proper Next.js nested layout using route groups. This will improve performance by enabling server-side rendering, follow Next.js best practices, and make the codebase more maintainable while keeping current URLs unchanged (`/privacy`, `/terms`, `/cookies`).

---

## 2. Strategic Analysis & Solution Options

### When to Use Strategic Analysis
**✅ ARCHITECTURAL DECISION MADE:**

**Option 1: Server Component Helper (CHOSEN)** ✅
- Keep as `LegalLayout` component (Server Component, not layout.tsx)
- Remove "use client" directive for server-side rendering
- Pages import and use it: `<LegalLayout tocSidebar={...}>`
- ✅ Simple, maintainable, achieves Server Component goal
- ✅ No TOC definition duplication
- ❌ Not using layout.tsx file feature (but that's okay!)

**Option 2: Parallel Routes (CONSIDERED)**
- True layout.tsx with `@tocSidebar` parallel route
- More complex, requires duplicate TOC definitions
- Better for 10+ pages, overkill for 3 legal pages
- ❌ Rejected due to unnecessary complexity

**Decision Rationale:** Option 1 achieves the main goal (Server Components, better performance) with minimal complexity for 3 legal pages.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.4 with strict mode
- **UI & Styling:** shadcn/ui components with Tailwind CSS
- **Key Architectural Patterns:** Next.js App Router, Server Components by default
- **Current Route Structure:** `app/(public)/` route group with individual legal page directories

### Current State
Currently, legal pages (`privacy`, `terms`, `cookies`) use an incorrect pattern:
- `legal-layout.tsx` is a **client component** ("use client" directive) that acts as a pseudo-layout
- Privacy and terms pages import this component and pass TOC sidebar as prop
- Cookies page has the layout markup **duplicated inline** instead of using the component
- This breaks Next.js conventions and forces unnecessary client-side rendering
- The layout should be a **Server Component** using Next.js's native nested layout feature

### Existing Context Providers Analysis
**N/A** - This refactor doesn't involve context providers. Legal pages are public, static content that don't require user context.

---

## 4. Context & Problem Definition

### Problem Statement
The current implementation violates Next.js App Router best practices in multiple ways:

1. **Client Component Pseudo-Layout:** `legal-layout.tsx` is marked "use client" but acts as a layout, forcing all legal content to render client-side unnecessarily
2. **Inconsistent Implementation:** Cookies page duplicates the layout markup inline instead of using the component
3. **Poor Performance:** Server-renderable content is being forced to client-side
4. **Framework Anti-Pattern:** Using a component as a layout when Next.js provides native layout functionality
5. **Maintainability Issues:** Layout changes require updating imports and component usage instead of being automatic

This approach was a mistake that needs correction to align with Next.js architecture.

### Success Criteria
- [ ] All legal pages use a proper Next.js `layout.tsx` file (Server Component)
- [ ] Legal pages remain at current URLs (`/privacy`, `/terms`, `/cookies`)
- [ ] TOC sidebar renders server-side, improving initial page load performance
- [ ] Layout is automatically applied to all legal pages through route grouping
- [ ] No "use client" directive needed for layout functionality
- [ ] Code is more maintainable with standard Next.js patterns

---

## 5. Development Mode Context

### Development Mode Context
- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Data loss acceptable** - no database changes involved
- **Users are developers/testers** - not production users requiring careful migration
- **Priority: Speed and simplicity** over data preservation
- **Aggressive refactoring allowed** - delete/recreate components as needed

---

## 6. Technical Requirements

### Functional Requirements
- Legal pages must display with TOC sidebar on desktop (lg breakpoint)
- TOC sidebar must remain hidden on mobile/tablet
- All existing content and metadata must be preserved
- URL structure must remain unchanged (`/privacy`, `/terms`, `/cookies`)
- Server Component rendering for better performance and SEO

### Non-Functional Requirements
- **Performance:** Improved initial page load through server-side rendering
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Works in all modern browsers
- **Maintainability:** Uses standard Next.js patterns for easier maintenance

### Technical Constraints
- Must use route group `(legal)` to avoid changing URLs
- Must remain Server Components (no "use client" needed)
- Must preserve existing page metadata and content
- Must maintain existing styling and layout behavior

---

## 7. Data & Database Changes

### Database Schema Changes
**N/A** - No database changes required for this refactor.

### Data Model Updates
**N/A** - No data model changes needed.

### Data Migration Plan
**N/A** - This is a frontend architectural change only.

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES
**N/A** - Legal pages are static content, no data fetching or mutations involved.

---

## 9. Frontend Changes

### New Components
- [ ] **`app/(public)/(legal)/layout.tsx`** - New nested layout for legal pages (Server Component)
  - Renders main content area with max-width container
  - Conditionally renders TOC sidebar on large screens
  - No "use client" directive - pure Server Component

### Page Updates
- [ ] **`app/(public)/(legal)/privacy/page.tsx`** - Remove `<LegalLayout>` wrapper, pass TOC sections to layout
- [ ] **`app/(public)/(legal)/terms/page.tsx`** - Remove `<LegalLayout>` wrapper, pass TOC sections to layout
- [ ] **`app/(public)/(legal)/cookies/page.tsx`** - Remove inline layout markup, pass TOC sections to layout

### Files to Delete
- [ ] **`app/(public)/legal-layout.tsx`** - Delete the client component pseudo-layout entirely

### State Management
**N/A** - Legal pages don't have interactive state. TOC sidebar is rendered server-side with client-side scroll behavior handled by `TableOfContents` component (already exists).

---

## 10. Code Changes Overview

### 📂 **Current Implementation (Before)**

**File Structure:**
```
app/(public)/
  ├── layout.tsx              # Public layout (Navbar + Footer)
  ├── legal-layout.tsx        # ❌ Client component pseudo-layout
  ├── privacy/
  │   └── page.tsx            # Imports and uses LegalLayout component
  ├── terms/
  │   └── page.tsx            # Imports and uses LegalLayout component
  └── cookies/
      └── page.tsx            # Duplicates layout markup inline
```

**Current Privacy Page Pattern:**
```typescript
// woovector/app/(public)/privacy/page.tsx
import LegalLayout from "../legal-layout";  // ❌ Importing client component

export default function PrivacyPolicy() {
  return (
    <LegalLayout tocSidebar={<TableOfContents sections={tocSections} />}>
      <LegalPageWrapper title="Privacy Policy" lastUpdated={lastUpdated}>
        {/* Content */}
      </LegalPageWrapper>
    </LegalLayout>
  );
}
```

**Current legal-layout.tsx (Client Component):**
```typescript
// woovector/app/(public)/legal-layout.tsx
"use client";  // ❌ Forces client-side rendering

export default function LegalLayout({ children, tocSidebar }: LegalLayoutProps) {
  return (
    <div className="lg:flex lg:gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="lg:flex-1">{children}</div>
      <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
        {tocSidebar}
      </div>
    </div>
  );
}
```

**Current Cookies Page (Duplicated Layout):**
```typescript
// woovector/app/(public)/cookies/page.tsx (lines 28-423)
export default function CookiePolicy() {
  return (
    <div className="lg:flex lg:gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">  {/* ❌ Duplicated */}
      <div className="lg:flex-1">
        <LegalPageWrapper>
          {/* Content */}
        </LegalPageWrapper>
      </div>
      <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
        <TableOfContents sections={tocSections} />  {/* ❌ Duplicated */}
      </div>
    </div>
  );
}
```

---

### 📂 **After Refactor**

**New File Structure:**
```
app/(public)/
  ├── layout.tsx              # Public layout (Navbar + Footer)
  └── (legal)/                # ✅ Route group (no URL segment added)
      ├── layout.tsx          # ✅ Legal pages nested layout (Server Component)
      ├── privacy/
      │   ├── page.tsx        # ✅ Clean implementation
      │   ├── loading.tsx     # Already exists
      │   └── error.tsx       # Already exists
      ├── terms/
      │   ├── page.tsx        # ✅ Clean implementation
      │   ├── loading.tsx     # Already exists
      │   └── error.tsx       # Already exists
      └── cookies/
          ├── page.tsx        # ✅ Clean implementation
          ├── loading.tsx     # ✅ To be created
          └── error.tsx       # ✅ To be created
```

**New Legal Layout (Server Component):**
```typescript
// woovector/app/(public)/(legal)/layout.tsx
import { ReactNode } from "react";

interface LegalLayoutProps {
  children: ReactNode;
  tocSidebar: ReactNode;
}

export default function LegalLayout({ children, tocSidebar }: LegalLayoutProps) {
  return (
    <div className="lg:flex lg:gap-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="lg:flex-1">{children}</div>
      <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
        {tocSidebar}
      </div>
    </div>
  );
}
```

**Refactored Privacy Page:**
```typescript
// woovector/app/(public)/(legal)/privacy/page.tsx
import { Metadata } from "next";
import LegalPageWrapper from "@/components/legal/LegalPageWrapper";
import { generateLegalMetadata } from "@/lib/metadata";
import TableOfContents from "@/components/legal/TableOfContents";

const lastUpdated = "2025-06-30";

export const metadata: Metadata = generateLegalMetadata(
  "Privacy Policy",
  "Privacy Policy for ShipKit.ai - How we collect, use, and protect your personal information."
);

const tocSections = [
  { id: "introduction", title: "Introduction", level: 1 },
  // ... rest of sections
];

export default function PrivacyPolicy() {
  return (
    <>
      <LegalPageWrapper title="Privacy Policy" lastUpdated={lastUpdated}>
        {/* Content */}
      </LegalPageWrapper>
      <aside slot="tocSidebar">
        <TableOfContents sections={tocSections} />
      </aside>
    </>
  );
}
```

---

### 🎯 **Key Changes Summary**
- [ ] **Delete** `app/(public)/legal-layout.tsx` - Remove client component anti-pattern
- [ ] **Create** `app/(public)/(legal)/` route group directory - Groups legal pages without URL segment
- [ ] **Create** `app/(public)/(legal)/layout.tsx` - Proper Server Component layout
- [ ] **Move** privacy, terms, cookies directories into `(legal)` route group
- [ ] **Simplify** all page.tsx files - Remove layout wrapper component usage
- [ ] **Create** missing loading.tsx and error.tsx for cookies page
- [ ] **Files Modified:** 5 files (3 page.tsx files simplified, 2 new files created)
- [ ] **Files Deleted:** 1 file (legal-layout.tsx)
- [ ] **Files Created:** 3 files (layout.tsx, cookies/loading.tsx, cookies/error.tsx)

**Impact:** 
- ✅ Better performance through server-side rendering
- ✅ Standard Next.js patterns for easier maintenance
- ✅ Automatic layout application through route grouping
- ✅ No URL structure changes - users see no difference
- ✅ Cleaner, more maintainable code

---

## 11. Implementation Plan

### Phase 1: Create Route Group and Layout ✅ COMPLETE
**Goal:** Set up proper Next.js nested layout structure

- [x] **Task 1.1:** Create (legal) Route Group Directory ✓ 2025-10-06
  - Files: Created `app/(public)/(legal)/` directory ✓
  - Details: Route group (parentheses) prevents URL segment, keeps URLs as `/privacy`, `/terms`, `/cookies` ✓
- [x] **Task 1.2:** Create layout.tsx (True Next.js Layout) ✓ 2025-10-06
  - Files: `app/(public)/(legal)/layout.tsx` ✓
  - Details: Server Component layout, provides max-w-7xl container and padding ✓

### Phase 2: Move and Refactor Legal Pages ✅ COMPLETE
**Goal:** Move pages into route group and simplify to use layout

- [x] **Task 2.1:** Move All Legal Pages into Route Group ✓ 2025-10-06
  - Files: Moved `privacy/`, `terms/`, `cookies/` directories into `(legal)/` ✓
  - Details: All three legal page directories now inside route group ✓
- [x] **Task 2.2:** Refactor Privacy Page ✓ 2025-10-06
  - Files: `app/(public)/(legal)/privacy/page.tsx` ✓
  - Details: Removed LegalLayout import, simplified container classes (layout.tsx handles max-w/padding) ✓
- [x] **Task 2.3:** Refactor Terms Page ✓ 2025-10-06
  - Files: `app/(public)/(legal)/terms/page.tsx` ✓
  - Details: Simplified container classes, layout.tsx provides outer container ✓
- [x] **Task 2.4:** Refactor Cookies Page ✓ 2025-10-06
  - Files: `app/(public)/(legal)/cookies/page.tsx` ✓
  - Details: Simplified container classes to match other pages ✓

### Phase 3: Add Missing Files and Cleanup ✅ COMPLETE
**Goal:** Create missing files for consistency and remove old file

- [x] **Task 3.1:** Create Cookies Loading State ✓ 2025-10-06
  - Files: `app/(public)/(legal)/cookies/loading.tsx` ✓
  - Details: Added skeleton loading state for consistency with privacy/terms ✓
- [x] **Task 3.2:** Create Cookies Error Boundary ✓ 2025-10-06
  - Files: `app/(public)/(legal)/cookies/error.tsx` ✓
  - Details: Added error boundary with reset functionality ✓
- [x] **Task 3.3:** Delete Old Legal Layout File ✓ 2025-10-06
  - Files: Deleted `app/(public)/legal-layout.tsx` ✓
  - Details: Removed client component pseudo-layout, no longer needed ✓
- [x] **Task 3.4:** Fix Linting Issues ✓ 2025-10-06
  - Files: All legal pages ✓
  - Details: Fixed unused imports and missing closing tags, all files pass linting ✓

### Phase 4: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only - NEVER run dev server, build, or application commands

- [ ] **Task 4.1:** Code Quality Verification
  - Files: All modified files
  - Details: Run linting and static analysis ONLY - NEVER run dev server, build, or start commands
- [ ] **Task 4.2:** Static Logic Review
  - Files: Modified page files and new layout
  - Details: Read code to verify structure, imports, and component usage

🛑 **CRITICAL WORKFLOW CHECKPOINT**
After completing Phase 4, you MUST:
1. Present "Implementation Complete!" message (exact text from section 16)
2. Wait for user approval of code review
3. Execute comprehensive code review process
4. NEVER proceed to user testing without completing code review first

### Phase 5: Comprehensive Code Review (Mandatory)
**Goal:** Present implementation completion and request thorough code review

- [ ] **Task 5.1:** Present "Implementation Complete!" Message (MANDATORY)
  - Template: Use exact message from section 16, step 7
  - Details: STOP here and wait for user code review approval
- [ ] **Task 5.2:** Execute Comprehensive Code Review (If Approved)
  - Process: Follow step 8 comprehensive review checklist from section 16
  - Details: Read all files, verify requirements, integration testing, provide detailed summary

### Phase 6: User Browser Testing (Only After Code Review)
**Goal:** Request human testing for UI/UX functionality that requires browser interaction

- [ ] **Task 6.1:** Present AI Testing Results
  - Files: Summary of automated test results
  - Details: Provide comprehensive results of all AI-verifiable testing
- [ ] **Task 6.2:** Request User UI Testing
  - Files: Specific browser testing checklist for user
  - Details: Clear instructions for user to verify legal pages render correctly, TOC works, responsive layout
- [ ] **Task 6.3:** Wait for User Confirmation
  - Files: N/A
  - Details: Wait for user to complete browser testing and confirm results

---

## 12. Task Completion Tracking - MANDATORY WORKFLOW

### Task Completion Tracking - MANDATORY WORKFLOW
🚨 **CRITICAL: Real-time task completion tracking is mandatory**

- [ ] **🗓️ GET TODAY'S DATE FIRST** - Before adding any completion timestamps, use the `time` tool to get the correct current date
- [ ] **Update task document immediately** after each completed subtask
- [ ] **Mark checkboxes as [x]** with completion timestamp using ACTUAL current date
- [ ] **Add brief completion notes** (file paths, key changes, etc.)
- [ ] **This serves multiple purposes:**
  - [ ] **Forces verification** - You must confirm you actually did what you said
  - [ ] **Provides user visibility** - Clear progress tracking throughout implementation
  - [ ] **Prevents skipped steps** - Systematic approach ensures nothing is missed
  - [ ] **Creates audit trail** - Documentation of what was actually completed
  - [ ] **Enables better debugging** - If issues arise, easy to see what was changed

---

## 13. File Structure & Organization

### New Files to Create
```
app/(public)/(legal)/
├── layout.tsx                          # New nested layout (Server Component)
├── privacy/
│   └── page.tsx                        # Moved and refactored
├── terms/
│   └── page.tsx                        # Moved and refactored
└── cookies/
    ├── page.tsx                        # Moved and refactored
    ├── loading.tsx                     # New loading state
    └── error.tsx                       # New error boundary
```

### Files to Move
- `app/(public)/privacy/` → `app/(public)/(legal)/privacy/`
- `app/(public)/terms/` → `app/(public)/(legal)/terms/`
- `app/(public)/cookies/` → `app/(public)/(legal)/cookies/`

### Files to Delete
- `app/(public)/legal-layout.tsx` - Client component pseudo-layout

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze
- [ ] **Error Scenario 1:** Route group doesn't work as expected and URLs change
  - **Code Review Focus:** Verify (legal) parentheses syntax, test actual routes
  - **Potential Fix:** Double-check Next.js route group documentation if issues occur
- [ ] **Error Scenario 2:** TOC sidebar doesn't render on legal pages
  - **Code Review Focus:** Check layout.tsx props, verify children/tocSidebar usage
  - **Potential Fix:** Ensure layout properly receives and renders both slots

### Edge Cases to Consider
- [ ] **Edge Case 1:** Mobile responsiveness of new layout structure
  - **Analysis Approach:** Verify hidden lg:block classes work as before
  - **Recommendation:** Test on mobile breakpoints to ensure TOC hidden properly
- [ ] **Edge Case 2:** Dark mode styling in new layout
  - **Analysis Approach:** Check that theme classes still apply correctly
  - **Recommendation:** Verify dark: variants work in refactored structure

### Security & Access Control Review
**N/A** - Legal pages are public, static content with no authentication or authorization concerns.

---

## 15. Deployment & Configuration

### Environment Variables
**N/A** - No environment changes needed for this refactor.

---

## 16. AI Agent Instructions

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Follow the standard workflow from task_template.md:**

1. **EVALUATE STRATEGIC NEED FIRST** - Already complete (straightforward refactor)
2. **STRATEGIC ANALYSIS** - Skipped (only one correct approach)
3. **CREATE TASK DOCUMENT** - ✅ Complete
4. **PRESENT IMPLEMENTATION OPTIONS** - Present A/B/C options to user
5. **IMPLEMENT PHASE-BY-PHASE** - Only after Option B approval
6. **VERIFY ARCHITECTURE** - Ensure Server Components, no "use client"
7. **FINAL CODE REVIEW RECOMMENDATION** - Mandatory after implementation
8. **COMPREHENSIVE CODE REVIEW PROCESS** - If user approves

### Code Quality Standards
- [ ] All components must be Server Components (no "use client" unless absolutely necessary)
- [ ] Follow Next.js App Router best practices
- [ ] Use proper TypeScript types
- [ ] Maintain existing styling and responsive design
- [ ] Clean, professional comments explaining logic (not change history)

### Architecture Compliance
- [ ] **✅ VERIFY: Proper nested layout pattern used**
  - Route group `(legal)` for grouping without URL change
  - Server Component layout.tsx with no "use client"
  - Automatic layout application through file system routing
- [ ] **❌ AVOID: Client components for layout functionality**
- [ ] **❌ AVOID: Duplicating layout markup across pages**

---

## 17. Notes & Additional Context

### Research Links
- [Next.js Route Groups Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Layouts and Templates](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### Why This Matters
This refactor corrects a fundamental architectural mistake. Using a client component as a pseudo-layout:
- Forces unnecessary client-side rendering of static content
- Breaks Next.js streaming and suspense capabilities
- Makes the codebase harder to maintain
- Violates framework best practices
- Reduces SEO performance

The proper nested layout pattern is:
- Standard Next.js architecture
- Better for performance (server-rendered)
- Easier to maintain (automatic layout composition)
- Future-proof for Next.js features

---

## 18. Second-Order Consequences & Impact Analysis

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing API Contracts:** N/A - No API changes
- [ ] **Database Dependencies:** N/A - No database changes
- [ ] **Component Dependencies:** Legal pages no longer import `legal-layout.tsx`
- [ ] **Authentication/Authorization:** N/A - Public pages, no auth involved

#### 2. **Ripple Effects Assessment**
- [ ] **Data Flow Impact:** No data flow changes - static content only
- [ ] **UI/UX Cascading Effects:** No visual changes - same layout, better performance
- [ ] **State Management:** No state management involved
- [ ] **Routing Dependencies:** URLs remain unchanged due to route group pattern

#### 3. **Performance Implications**
- [ ] **Database Query Impact:** N/A - No database queries
- [ ] **Bundle Size:** ✅ **IMPROVEMENT** - Less client-side JavaScript (Server Component)
- [ ] **Server Load:** ✅ **IMPROVEMENT** - Server-rendered layout is more efficient
- [ ] **Caching Strategy:** ✅ **IMPROVEMENT** - Server Components cache better

#### 4. **Security Considerations**
- [ ] **Attack Surface:** No change - public pages remain public
- [ ] **Data Exposure:** N/A - No sensitive data involved
- [ ] **Permission Escalation:** N/A - No authentication involved
- [ ] **Input Validation:** N/A - Static content pages

#### 5. **User Experience Impacts**
- [ ] **Workflow Disruption:** ✅ **NO IMPACT** - Users see no difference
- [ ] **Data Migration:** N/A - No user data involved
- [ ] **Feature Deprecation:** N/A - Same features, better implementation
- [ ] **Learning Curve:** N/A - No visible changes to users

#### 6. **Maintenance Burden**
- [ ] **Code Complexity:** ✅ **IMPROVEMENT** - Standard Next.js patterns easier to understand
- [ ] **Dependencies:** No new dependencies added
- [ ] **Testing Overhead:** No additional testing needed
- [ ] **Documentation:** Standard Next.js patterns well-documented

### Critical Issues Identification

#### 🟢 **GREEN FLAGS - Positive Impacts**
- ✅ **Better Performance:** Server-side rendering improves page load times
- ✅ **Standard Patterns:** Easier for other developers to understand and maintain
- ✅ **Framework Alignment:** Works with all Next.js features (streaming, suspense, etc.)
- ✅ **Reduced Bundle Size:** Less client-side JavaScript
- ✅ **Better SEO:** Server-rendered content is better for search engines

#### ⚠️ **YELLOW FLAGS - Minor Considerations**
- ⚠️ **File Structure Change:** Developers need to know legal pages moved to `(legal)` route group
- ⚠️ **Import Path Updates:** Any future references to legal pages need new paths

### Mitigation Strategies

#### File Structure Communication
- [ ] **Clear Documentation:** This task document explains the new structure
- [ ] **Standard Pattern:** Route groups are standard Next.js, well-documented
- [ ] **No Breaking Changes:** URLs unchanged, no external impact

---

*Task Document Version: 1.0*  
*Created: 2025-10-06*  
*Created By: Claude (AI Assistant)*

