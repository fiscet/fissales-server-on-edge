# Task 011: Contact Form Implementation

> **Created:** 2025-01-06  
> **Status:** Planning  
> **Priority:** Medium

---

## 1. Task Overview

### Task Title
**Title:** Implement Contact Form to Replace Direct Email Links

### Goal Statement
**Goal:** Replace the current "mailto:" support email links with a professional contact form that collects user inquiries, stores them in the database, and sends notifications to support team. This provides a better user experience, allows tracking of support requests, and prevents email address harvesting by spam bots.

---

## 2. Strategic Analysis & Solution Options

### Problem Context
Currently, the application uses direct "mailto:support@woovector.com" links in multiple locations (Footer, FAQ section, CTA section, error pages). This approach has several limitations:
- Requires users to have an email client configured
- Provides no tracking or management of support inquiries
- Exposes support email to spam harvesters
- Offers no validation or structure for support requests
- No way to categorize or prioritize incoming requests

This is a good candidate for strategic analysis because there are multiple viable implementation approaches with different trade-offs in terms of complexity, features, and maintenance overhead.

### Solution Options Analysis

#### Option 1: Simple Form with Email Service Integration
**Approach:** Create a contact form that directly sends emails using a third-party email service (Resend, SendGrid, or similar) without database storage.

**Pros:**
- ✅ Quick implementation (~2-3 hours)
- ✅ No additional database tables required
- ✅ Simple architecture with minimal moving parts
- ✅ Lower maintenance overhead
- ✅ Works immediately without database migrations

**Cons:**
- ❌ No tracking or history of support requests
- ❌ Cannot build admin dashboard for support management
- ❌ No way to follow up with users about their requests
- ❌ Missing analytics on common support topics
- ❌ Requires immediate third-party service configuration

**Implementation Complexity:** Low - Single server action, form component, email template  
**Risk Level:** Low - Straightforward implementation with well-documented APIs

#### Option 2: Form with Database Storage + Email Notification
**Approach:** Store all contact form submissions in a dedicated database table and send email notifications to support team.

**Pros:**
- ✅ Complete history of all support requests
- ✅ Foundation for future admin dashboard
- ✅ Can track submission status (pending, resolved, spam)
- ✅ Enables analytics on support topics
- ✅ Can implement follow-up features later
- ✅ Better spam protection with database validation

**Cons:**
- ❌ Requires database migration and schema changes
- ❌ More complex architecture (DB + email)
- ❌ Higher implementation time (~4-5 hours)
- ❌ Additional storage costs (minimal for contact forms)
- ❌ Needs admin interface in future to view submissions

**Implementation Complexity:** Medium - Database schema, migration, server actions, email integration  
**Risk Level:** Low - Well-established pattern, clear implementation path

#### Option 3: Lightweight - Form with Supabase Database Only (No Email)
**Approach:** Store submissions in database with admin access through Supabase dashboard, no automated emails.

**Pros:**
- ✅ Medium implementation time (~3 hours)
- ✅ All benefits of database storage
- ✅ No third-party email service needed immediately
- ✅ Can add email notifications later
- ✅ Admin can check Supabase dashboard for new requests

**Cons:**
- ❌ No real-time notifications to support team
- ❌ Requires manual checking of Supabase dashboard
- ❌ Less professional user experience (no confirmation email)
- ❌ Team might miss urgent support requests
- ❌ Still needs email integration eventually

**Implementation Complexity:** Medium - Database schema, migration, server actions  
**Risk Level:** Low - Simple approach, but requires manual monitoring

### Recommendation & Rationale

**🎯 RECOMMENDED SOLUTION:** Option 2 - Form with Database Storage + Email Notification

**Why this is the best choice:**
1. **Scalability** - Provides foundation for future support management features without requiring architectural changes
2. **Professional Experience** - Users receive confirmation emails, support team gets notifications
3. **Data-Driven Decisions** - Historical data enables analytics on common issues and support volume
4. **Spam Protection** - Database validation and rate limiting protect against abuse
5. **Future-Proof** - Can easily add admin dashboard, status tracking, and automated responses later

**Key Decision Factors:**
- **Performance Impact:** Minimal - single database insert per submission
- **User Experience:** Best - immediate visual confirmation plus email confirmation
- **Maintainability:** Good - clean separation between storage and notification layers
- **Scalability:** Excellent - can handle thousands of submissions without changes
- **Security:** Best - database validation, rate limiting, input sanitization

**Alternative Consideration:**
Option 1 would be suitable for a very small project with no plans for support management features. However, given that this is a B2B SaaS application for WooCommerce vendors, having a proper support system foundation is valuable. The additional 1-2 hours of implementation time is worth the long-term benefits.

### Decision Request

**👤 USER DECISION REQUIRED:**
Based on this analysis, do you want to proceed with the recommended solution (Option 2 - Database + Email), or would you prefer a different approach?

**Questions for you to consider:**
- Do you want historical tracking of support requests for future analytics?
- Is it important to have email notifications to the support team?
- Do you plan to build an admin dashboard for support management in the future?
- Do you have preferences for email service providers (Resend is recommended for Next.js)?

**Next Steps:**
Once you approve the strategic direction, I'll update the implementation plan with the specific technical details and present you with implementation options.

---

## 3. Project Analysis & Current State

### Technology & Architecture
- **Frameworks & Versions:** Next.js 15.3, React 19
- **Language:** TypeScript 5.x with strict mode
- **Database & ORM:** Supabase (Postgres) via Drizzle ORM
- **UI & Styling:** shadcn/ui components with Tailwind CSS for styling
- **Authentication:** Supabase Auth managed by `middleware.ts` for protected routes
- **Key Architectural Patterns:** Next.js App Router, Server Components for data fetching, Server Actions for mutations
- **Relevant Existing Components:** 
  - `components/ui/button.tsx` for base styles
  - `components/ui/input.tsx` for form inputs
  - `components/ui/textarea.tsx` for message input
  - `components/ui/label.tsx` for form labels
  - `components/ui/card.tsx` for container styling
  - `components/auth/LoginForm.tsx` as form pattern reference

### Current State
**Existing Support Contact Implementation:**
- `components/landing/Footer.tsx` - Contains "mailto:support@woovector.com" link with Mail icon
- `components/landing/FAQSection.tsx` - Contains "Contact us" link at bottom: "mailto:support@woovector.com"
- `components/landing/CTASection.tsx` - Contains support email in MinimalFooterLinks component
- `app/(public)/(legal)/privacy/error.tsx` - Shows "support@chat-copilot.com" (outdated email!)
- `app/(public)/(legal)/terms/error.tsx` - Shows "support@chat-copilot.com" (outdated email!)

**Issues with Current Implementation:**
- Multiple mailto links require users to have email client configured
- No tracking or management system for support inquiries
- Two error pages show old/incorrect email address
- Support email is publicly visible and harvestable by spam bots
- No validation or structure for support requests
- Cannot analyze common support topics or request volume

### Existing Context Providers Analysis
- **UserContext (`useUser()`):** Available in protected routes via `app/(protected)/layout.tsx`
  - Provides: `id`, `email`, `full_name`, `role`, `subscription_tier`, `created_at`
  - Used for: Identifying logged-in users, personalizing experience
  - **Contact Form Context:** Can pre-fill name/email for authenticated users
- **UsageContext (`useUsage()`):** Available in protected routes
  - Provides: Billing and subscription data
  - Not directly relevant for contact form functionality
- **Other Context Providers:** None found in `contexts/` directory related to support/contact
- **Context Hierarchy:** UserProvider wraps protected routes only, not available on public landing pages

**🔍 Context Coverage Analysis:**
- Contact form will be on public pages (landing page, footer) where UserContext is not available
- For authenticated users accessing contact form, can check auth state and pre-fill data
- Need to handle both anonymous and authenticated user submissions
- Anonymous users must provide email (required field)
- Authenticated users can have email pre-filled from session

---

## 4. Context & Problem Definition

### Problem Statement
Users currently need to:
1. Click a mailto link that opens their email client
2. Have an email client properly configured on their device
3. Manually compose a support email without any structure

This creates friction in the support process and prevents the business from:
- Tracking support request volume and topics
- Implementing automated responses or routing
- Building a knowledge base from common questions
- Providing users with confirmation and ticket numbers
- Analyzing support trends to improve documentation

Additionally, there are inconsistencies with outdated email addresses in error pages and the public exposure of the support email address to spam bots.

### Success Criteria
- [ ] Contact form accessible from landing page footer, FAQ section, and CTA section
- [ ] Form includes fields for: name, email, subject/category, message
- [ ] Server-side validation for all fields with appropriate error messages
- [ ] Contact submissions stored in database with timestamp and status
- [ ] Email notification sent to support team for each new submission
- [ ] Confirmation email sent to user acknowledging their request
- [ ] Rate limiting to prevent spam (e.g., 3 submissions per hour per email/IP)
- [ ] Success message shown to user after submission
- [ ] All mailto links replaced with link to contact form
- [ ] Error pages updated with correct support email or contact form link
- [ ] Form works responsively on mobile, tablet, and desktop
- [ ] Form supports both light and dark mode
- [ ] Accessible form with proper ARIA labels and keyboard navigation

---

## 5. Development Mode Context

### Development Mode Context
- **🚨 IMPORTANT: This is a new application in active development**
- **No backwards compatibility concerns** - feel free to make breaking changes
- **Data loss acceptable** - existing data can be wiped/migrated aggressively
- **Users are developers/testers** - not production users requiring careful migration
- **Priority: Speed and simplicity** over data preservation
- **Aggressive refactoring allowed** - delete/recreate components as needed

---

## 6. Technical Requirements

### Functional Requirements
- **FR-1:** User can access contact form from multiple entry points (footer, FAQ, CTA, dedicated page)
- **FR-2:** Form collects: full name, email address, subject/category dropdown, message text
- **FR-3:** System validates all fields server-side (required fields, email format, message length)
- **FR-4:** System stores submission in database with: timestamp, user_id (if authenticated), status, IP address
- **FR-5:** System sends email to support@woovector.com with submission details
- **FR-6:** System sends confirmation email to user with submission reference number
- **FR-7:** Form implements rate limiting (max 3 submissions per hour per email address)
- **FR-8:** Success message displays with submission reference number
- **FR-9:** Error messages display for validation failures or submission errors
- **FR-10:** Authenticated users have name/email pre-filled from session
- **FR-11:** Anonymous users can submit without creating account

### Non-Functional Requirements
- **Performance:** Form submission completes within 3 seconds
- **Security:** 
  - Input sanitization to prevent XSS attacks
  - Rate limiting to prevent spam
  - CAPTCHA consideration for future implementation
  - Server-side validation cannot be bypassed
- **Usability:** 
  - Clear field labels and placeholder text
  - Inline validation with helpful error messages
  - Character counter for message field
  - Loading state during submission
- **Responsive Design:** Must work on mobile (320px+), tablet (768px+), and desktop (1024px+)
- **Theme Support:** Must support both light and dark mode using existing theme system
- **Compatibility:** Works in all modern browsers (Chrome, Firefox, Safari, Edge)

### Technical Constraints
- Must use existing Supabase database and authentication
- Must use existing shadcn/ui component library
- Must follow existing server action patterns in `app/actions/`
- Email service should integrate cleanly with Next.js (Resend recommended)
- Form should be accessible via route (e.g., `/contact`) and as component on existing pages

---

## 7. Data & Database Changes

### Database Schema Changes
```sql
-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'spam')),
  ip_address TEXT,
  user_agent TEXT,
  reference_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups by email (for rate limiting)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create index for faster lookups by status
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Create index for faster lookups by created_at (for rate limiting time windows)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Create index for faster lookups by reference number (for user inquiries)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_reference_number ON contact_submissions(reference_number);
```

### Data Model Updates
```typescript
// lib/drizzle/schema/contact-submissions.ts
import { pgTable, text, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("pending"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    referenceNumber: text("reference_number").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("idx_contact_submissions_email").on(table.email),
    statusIdx: index("idx_contact_submissions_status").on(table.status),
    createdAtIdx: index("idx_contact_submissions_created_at").on(table.createdAt),
    referenceNumberIdx: index("idx_contact_submissions_reference_number").on(table.referenceNumber),
  })
);

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
```

### Data Migration Plan
- [ ] Generate Drizzle migration with `npm run db:generate`
- [ ] No existing data to migrate (new table)
- [ ] Verify migration in development environment
- [ ] No down migration needed initially (development phase)

### 🚨 MANDATORY: Down Migration Safety Protocol
**CRITICAL REQUIREMENT:** Before running ANY database migration, you MUST create the corresponding down migration file following the `drizzle_down_migration.md` template process:

- [ ] **Step 1: Generate Migration** - Run `npm run db:generate` to create the migration file
- [ ] **Step 2: Create Down Migration** - Follow `drizzle_down_migration.md` template to analyze the migration and create the rollback file
- [ ] **Step 3: Create Subdirectory** - Create `drizzle/migrations/[timestamp_name]/` directory
- [ ] **Step 4: Generate down.sql** - Create the `down.sql` file with safe rollback operations
- [ ] **Step 5: Verify Safety** - Ensure all operations use `IF EXISTS` and include appropriate warnings
- [ ] **Step 6: Apply Migration** - Only after down migration is created, run `npm run db:migrate`

**🛑 NEVER run `npm run db:migrate` without first creating the down migration file!**

---

## 8. API & Backend Changes

### Data Access Pattern - CRITICAL ARCHITECTURE RULES

**🚨 MANDATORY: Follow these rules strictly:**

#### **MUTATIONS (Server Actions)** → `app/actions/contact.ts`
- [ ] **Server Actions File** - `app/actions/contact.ts` - Create/update contact submissions
- [ ] `submitContactForm()` - Creates new contact submission, sends emails, implements rate limiting
- [ ] Must use `'use server'` directive
- [ ] Return structured response: `{ success: boolean; referenceNumber?: string; error?: string }`

#### **QUERIES (Data Fetching)** → Direct in Server Components (if needed)
- [ ] **Simple Query** - If admin dashboard added later, fetch submissions directly in page component
- [ ] No complex queries needed for MVP (just insertion)

#### **API Routes** → NOT NEEDED
- [ ] ❌ No API routes required - Server Actions handle form submission
- [ ] ❌ No webhooks or external integrations for contact form

### Server Actions
- [ ] **`submitContactForm(formData: ContactFormData)`**
  - Validates all input fields
  - Checks rate limiting (3 submissions per hour per email)
  - Generates unique reference number
  - Stores submission in database
  - Sends notification email to support team
  - Sends confirmation email to user
  - Returns success/error response with reference number

### Database Queries
- [ ] **Direct in Server Action** - Simple INSERT query in `submitContactForm`
- [ ] **Rate Limiting Query** - Check recent submissions by email within time window
- [ ] No complex queries needed for MVP

### External Integrations
- **Email Service (Resend recommended):**
  - Sign up for Resend account (free tier: 3,000 emails/month)
  - Add API key to `.env.local`: `RESEND_API_KEY=re_xxx`
  - Install package: `npm install resend`
  - Verify domain in Resend dashboard for production
  - Use development mode for testing (emails sent to verified addresses only)

**🚨 MANDATORY: Use Latest AI Models**
- Not applicable for this task (no AI model integration)

---

## 9. Frontend Changes

### New Components
- [ ] **`components/contact/ContactForm.tsx`** - Main contact form component
  - Props: `defaultEmail?: string`, `defaultName?: string`
  - Features: Client-side validation, loading states, error handling, success message
  - Uses: shadcn/ui Input, Textarea, Button, Select, Label components
  
- [ ] **`components/contact/ContactFormModal.tsx`** (Optional) - Dialog wrapper for contact form
  - Props: `open: boolean`, `onOpenChange: (open: boolean) => void`
  - Uses: shadcn/ui Dialog component
  - Embeds ContactForm component

- [ ] **`app/(public)/contact/page.tsx`** - Dedicated contact page
  - Server Component
  - Fetches user session (if authenticated) to pre-fill form
  - Renders ContactForm with pre-filled data

**Component Organization Pattern:**
- Use `components/contact/` directory for contact-specific components
- Import into pages from the global components directory
- Consistent with existing patterns (`components/auth/`, `components/landing/`)

**Component Requirements:**
- **Responsive Design:** Mobile-first with Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- **Theme Support:** CSS variables for colors, `dark:` classes for dark mode
- **Accessibility:** WCAG AA guidelines, proper ARIA labels, keyboard navigation

### Page Updates
- [ ] **`components/landing/Footer.tsx`** - Replace mailto link with `/contact` link
- [ ] **`components/landing/FAQSection.tsx`** - Replace mailto link with `/contact` link
- [ ] **`components/landing/CTASection.tsx`** - Replace mailto link with `/contact` link
- [ ] **`app/(public)/(legal)/privacy/error.tsx`** - Update support email or add contact link
- [ ] **`app/(public)/(legal)/terms/error.tsx`** - Update support email or add contact link
- [ ] **`app/(public)/layout.tsx`** - Verify contact page is accessible (no auth required)

### State Management
- **Local Component State:** Form field values, validation errors, loading state, submission success
- **No Global State:** Contact form is self-contained, no shared state needed
- **Server State:** User session fetched server-side in page component, passed as props to form

### 🚨 CRITICAL: Context Usage Strategy

**MANDATORY: Before creating any component props or planning data fetching, verify existing context availability**

#### Context-First Design Pattern
- [ ] **✅ Check Available Contexts:** Analyzed UserContext availability
- [ ] **✅ Use Context Over Props:** Contact form on public pages - UserContext not available
- [ ] **✅ Context Conclusion:** 
  - Contact page needs to check auth state server-side to pre-fill form
  - No context providers needed - simple prop passing from page to form component
  - Authenticated user data passed as props: `defaultEmail`, `defaultName`

---

## 10. Code Changes Overview

### 🚨 MANDATORY: Always Show High-Level Code Changes Before Implementation

#### 📂 **Current Implementation (Before)**
```typescript
// components/landing/Footer.tsx - Current mailto link
<Link
  href="mailto:support@woovector.com"
  className="flex items-center justify-center md:justify-start gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
>
  <Mail className="w-4 h-4" />
  Email Support
</Link>

// components/landing/FAQSection.tsx - Current mailto link
<Link
  href="mailto:support@woovector.com"
  className="text-primary hover:underline font-medium"
>
  Contact us
</Link>

// components/landing/CTASection.tsx - Current mailto link
<Link
  href="mailto:support@woovector.com"
  className="flex items-center gap-2 hover:text-foreground transition-colors"
>
  <Mail className="w-4 h-4" />
  Contact
</Link>
```

#### 📂 **After Refactor**
```typescript
// components/landing/Footer.tsx - Link to contact form
<Link
  href="/contact"
  className="flex items-center justify-center md:justify-start gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
>
  <Mail className="w-4 h-4" />
  Contact Support
</Link>

// components/landing/FAQSection.tsx - Link to contact form
<Link
  href="/contact"
  className="text-primary hover:underline font-medium"
>
  Contact us
</Link>

// components/landing/CTASection.tsx - Link to contact form
<Link
  href="/contact"
  className="flex items-center gap-2 hover:text-foreground transition-colors"
>
  <Mail className="w-4 h-4" />
  Contact
</Link>

// NEW: components/contact/ContactForm.tsx - Professional contact form
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface ContactFormProps {
  defaultEmail?: string;
  defaultName?: string;
}

export function ContactForm({ defaultEmail, defaultName }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form fields, validation, submission logic
  // ...
}

// NEW: app/(public)/contact/page.tsx - Dedicated contact page
import { ContactForm } from "@/components/contact/ContactForm";
import { getCurrentUser } from "@/lib/auth";

export default async function ContactPage() {
  const user = await getCurrentUser();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <ContactForm 
        defaultEmail={user?.email}
        defaultName={user?.full_name}
      />
    </div>
  );
}

// NEW: app/actions/contact.ts - Server action for form submission
"use server";
import { db } from "@/lib/drizzle/db";
import { contactSubmissions } from "@/lib/drizzle/schema";
import { sendEmail } from "@/lib/email";

export async function submitContactForm(data: ContactFormData) {
  // Validation, rate limiting, database insertion, email sending
  // Returns { success: boolean; referenceNumber?: string; error?: string }
}
```

#### 🎯 **Key Changes Summary**
- [ ] **Change 1:** Create new database table `contact_submissions` with proper indexes for performance
- [ ] **Change 2:** Add new `components/contact/` directory with `ContactForm.tsx` component
- [ ] **Change 3:** Create dedicated `/contact` page as Server Component
- [ ] **Change 4:** Implement `app/actions/contact.ts` with server action for form submission
- [ ] **Change 5:** Replace all 3 mailto links with `/contact` route links
- [ ] **Change 6:** Update error pages with correct support email
- [ ] **Change 7:** Integrate email service (Resend) for notifications

- [ ] **Files Created:** 
  - `lib/drizzle/schema/contact-submissions.ts`
  - `components/contact/ContactForm.tsx`
  - `app/(public)/contact/page.tsx`
  - `app/(public)/contact/loading.tsx`
  - `app/(public)/contact/error.tsx`
  - `app/actions/contact.ts`
  - `lib/email.ts` (email utility functions)

- [ ] **Files Modified:**
  - `components/landing/Footer.tsx`
  - `components/landing/FAQSection.tsx`
  - `components/landing/CTASection.tsx`
  - `app/(public)/(legal)/privacy/error.tsx`
  - `app/(public)/(legal)/terms/error.tsx`
  - `lib/drizzle/schema/index.ts` (export new schema)

- [ ] **Impact:** 
  - Better user experience with structured support requests
  - Foundation for future support management features
  - Prevents email spam harvesting
  - Enables support request analytics and tracking

---

## 11. Implementation Plan

### Phase 1: Database Schema & Migration
**Goal:** Create database table for storing contact form submissions

- [ ] **Task 1.1:** Create Database Schema File
  - Files: `lib/drizzle/schema/contact-submissions.ts`
  - Details: Define `contactSubmissions` table with all fields, indexes, and types
  
- [ ] **Task 1.2:** Export Schema in Index
  - Files: `lib/drizzle/schema/index.ts`
  - Details: Add `export * from "./contact-submissions";`
  
- [ ] **Task 1.3:** Generate Database Migration
  - Command: `npm run db:generate`
  - Details: Generate SQL migration file for new table
  
- [ ] **Task 1.4:** Create Down Migration (MANDATORY)
  - Files: `drizzle/migrations/[timestamp]/down.sql`
  - Details: Follow `drizzle_down_migration.md` template to create safe rollback
  
- [ ] **Task 1.5:** Apply Migration
  - Command: `npm run db:migrate`
  - Details: Only run after down migration is created and verified

### Phase 2: Email Service Setup
**Goal:** Configure Resend email service for sending notifications

- [ ] **Task 2.1:** Install Resend Package
  - Command: `npm install resend`
  - Details: Add Resend SDK to project dependencies
  
- [ ] **Task 2.2:** Add Environment Variables
  - Files: `.env.local` (add to .gitignore if not already)
  - Details: Add `RESEND_API_KEY=re_xxx` and `SUPPORT_EMAIL=support@woovector.com`
  
- [ ] **Task 2.3:** Create Email Utility Functions
  - Files: `lib/email.ts`
  - Details: Create helper functions for sending support notification and user confirmation emails

### Phase 3: Server Action Implementation
**Goal:** Create server action for handling form submissions

- [x] **Task 3.1:** Create Contact Server Actions ✓ 2025-01-06
  - Files: `app/actions/contact.ts`
  - Details: Implemented `submitContactForm` with validation, rate limiting, database insert, email sending ✓
  
- [ ] **Task 3.2:** Add Rate Limiting Logic
  - Files: `app/actions/contact.ts`
  - Details: Check for existing submissions in past hour by email, return error if limit exceeded
  
- [ ] **Task 3.3:** Add Reference Number Generation
  - Files: `app/actions/contact.ts`
  - Details: Generate unique reference number (e.g., "CS-" + timestamp + random)

### Phase 4: Contact Form Component
**Goal:** Build the contact form UI component

- [x] **Task 4.1:** Create ContactForm Component ✓ 2025-01-06
  - Files: `components/contact/ContactForm.tsx`
  - Details: Implemented responsive form with validation, success states, consent ✓
  
- [ ] **Task 4.2:** Add Form Validation
  - Files: `components/contact/ContactForm.tsx`
  - Details: Validate required fields, email format, message length (min 10 chars, max 2000 chars)
  
- [ ] **Task 4.3:** Add Loading and Success States
  - Files: `components/contact/ContactForm.tsx`
  - Details: Show loading spinner during submission, success message with reference number
  
- [ ] **Task 4.4:** Add Error Handling
  - Files: `components/contact/ContactForm.tsx`
  - Details: Display server-side errors (rate limit, validation, submission failure)

### Phase 5: Contact Page
**Goal:** Create dedicated contact page route

- [x] **Task 5.1:** Create Contact Page ✓ 2025-01-06
  - Files: `app/(public)/contact/page.tsx`
  - Details: Server Component fetching user session, renders ContactForm with pre-filled data ✓
  
- [x] **Task 5.2:** Create Loading State ✓ 2025-01-06
  - Files: `app/(public)/contact/loading.tsx`
  - Details: Skeleton UI for loading state ✓
  
- [x] **Task 5.3:** Create Error Boundary ✓ 2025-01-06
  - Files: `app/(public)/contact/error.tsx`
  - Details: Error page with fallback UI and contact email ✓

### Phase 6: Replace Email Links
**Goal:** Update all mailto links to point to contact form

- [x] **Task 6.1:** Update Footer Component ✓ 2025-01-06
  - Files: `components/landing/Footer.tsx`
  - Details: Updated support link to `/contact` with CTA copy ✓
  
- [x] **Task 6.2:** Update FAQ Component ✓ 2025-01-06
  - Files: `components/landing/FAQSection.tsx`
  - Details: Updated CTA link to `/contact` ✓
  
- [x] **Task 6.3:** Update CTA Component ✓ 2025-01-06
  - Files: `components/landing/CTASection.tsx`
  - Details: Added contact CTA linking to `/contact` ✓
  
- [x] **Task 6.4:** Update Error Pages ✓ 2025-01-06
  - Files: `app/(public)/(legal)/privacy/error.tsx`, `app/(public)/(legal)/terms/error.tsx`
  - Details: Replaced mailto link with `/contact` encouragement ✓

### Phase 7: Basic Code Validation (AI-Only)
**Goal:** Run safe static analysis only - NEVER run dev server, build, or application commands

- [ ] **Task 7.1:** Code Quality Verification
  - Files: All modified files
  - Details: Run linting and static analysis ONLY - NEVER run dev server, build, or start commands
  
- [ ] **Task 7.2:** Static Logic Review
  - Files: `app/actions/contact.ts`, `components/contact/ContactForm.tsx`
  - Details: Read code to verify validation logic, rate limiting logic, error handling

🛑 **CRITICAL WORKFLOW CHECKPOINT**
After completing Phase 7, you MUST:
1. Present "Implementation Complete!" message (exact text from section 16)
2. Wait for user approval of code review
3. Execute comprehensive code review process
4. NEVER proceed to user testing without completing code review first

### Phase 8: Comprehensive Code Review (Mandatory)
**Goal:** Present implementation completion and request thorough code review

- [ ] **Task 8.1:** Present "Implementation Complete!" Message (MANDATORY)
  - Template: Use exact message from section 16, step 7
  - Details: STOP here and wait for user code review approval
  
- [ ] **Task 8.2:** Execute Comprehensive Code Review (If Approved)
  - Process: Follow step 8 comprehensive review checklist from section 16
  - Details: Read all files, verify requirements, integration testing, provide detailed summary

### Phase 9: User Browser Testing (Only After Code Review)
**Goal:** Request human testing for UI/UX functionality that requires browser interaction

- [ ] **Task 9.1:** Present AI Testing Results
  - Files: Summary of automated test results
  - Details: Provide comprehensive results of all AI-verifiable testing
  
- [ ] **Task 9.2:** Request User UI Testing
  - Testing Checklist:
    - [ ] Visit `/contact` page - form loads properly
    - [ ] Test form validation - empty fields show errors
    - [ ] Test email validation - invalid email shows error
    - [ ] Submit form as anonymous user - success message appears
    - [ ] Check email for confirmation message
    - [ ] Test rate limiting - submit 4 times quickly, 4th should fail
    - [ ] Test as authenticated user - email/name pre-filled
    - [ ] Test on mobile device - responsive layout works
    - [ ] Test in dark mode - styling works correctly
    - [ ] Click footer contact link - navigates to contact page
    - [ ] Click FAQ contact link - navigates to contact page
  
- [ ] **Task 9.3:** Wait for User Confirmation
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
woovector/
├── app/
│   ├── actions/
│   │   └── contact.ts                    # Server action for form submission
│   └── (public)/
│       └── contact/
│           ├── page.tsx                   # Contact form page (Server Component)
│           ├── loading.tsx                # Loading state UI
│           └── error.tsx                  # Error boundary
├── components/
│   └── contact/
│       └── ContactForm.tsx                # Contact form component (Client Component)
└── lib/
    ├── drizzle/
    │   └── schema/
    │       └── contact-submissions.ts     # Database schema for contact table
    └── email.ts                           # Email utility functions (Resend integration)
```

**File Organization Rules:**
- **Components**: `components/contact/` directory for contact feature
- **Pages**: Contact page in `app/(public)/contact/` route
- **Server Actions**: In `app/actions/contact.ts` file (mutations only)
- **Schema**: In `lib/drizzle/schema/contact-submissions.ts`
- **Utilities**: Email functions in `lib/email.ts`

#### **LIB FILE SERVER/CLIENT SEPARATION - CRITICAL ARCHITECTURE RULE**

**🚨 MANDATORY: Prevent Server/Client Boundary Violations**

- [ ] **`lib/email.ts`** - Server-only file (uses Resend SDK with API key)
  - Contains: Email sending functions, Resend client initialization
  - Imports: `resend` package, server-only operations
  - ✅ Can be imported by: Server Actions, API routes, Server Components
  - ❌ Cannot be imported by: Client Components
  
- [ ] **No client-safe utilities needed** - All contact form logic is server-side

### Files to Modify
- [ ] **`components/landing/Footer.tsx`** - Replace mailto link with `/contact` link
- [ ] **`components/landing/FAQSection.tsx`** - Replace mailto link with `/contact` link
- [ ] **`components/landing/CTASection.tsx`** - Replace mailto link with `/contact` link
- [ ] **`app/(public)/(legal)/privacy/error.tsx`** - Update support email
- [ ] **`app/(public)/(legal)/terms/error.tsx`** - Update support email
- [ ] **`lib/drizzle/schema/index.ts`** - Export new contact-submissions schema

### Dependencies to Add
```json
{
  "dependencies": {
    "resend": "^4.0.3"
  }
}
```

---

## 14. Potential Issues & Security Review

### Error Scenarios to Analyze
- [ ] **Error Scenario 1:** Rate limiting not working - users can spam submissions
  - **Code Review Focus:** Check `app/actions/contact.ts` rate limiting query logic
  - **Potential Fix:** Ensure database query checks past hour window correctly, consider IP-based limiting too

- [ ] **Error Scenario 2:** Email service fails - submission stored but no notification sent
  - **Code Review Focus:** Error handling in email sending functions
  - **Potential Fix:** Wrap email calls in try-catch, log errors, still return success to user

- [ ] **Error Scenario 3:** Long message causes database error
  - **Code Review Focus:** Message length validation in both client and server
  - **Potential Fix:** Add max length validation (2000 chars) before database insert

- [ ] **Error Scenario 4:** XSS attack via form fields
  - **Code Review Focus:** Input sanitization before storing/displaying
  - **Potential Fix:** Ensure React escapes all user input by default, validate format server-side

### Edge Cases to Consider
- [ ] **Edge Case 1:** User is authenticated but email in session differs from form email
  - **Analysis Approach:** Check if form allows editing pre-filled email
  - **Recommendation:** Allow users to change email, use form email (not session email) for submission

- [ ] **Edge Case 2:** User submits empty message or very short message
  - **Analysis Approach:** Check minimum message length validation
  - **Recommendation:** Enforce minimum 10 characters for meaningful support requests

- [ ] **Edge Case 3:** Reference number collision (very unlikely but possible)
  - **Analysis Approach:** Check reference number generation uniqueness
  - **Recommendation:** Use timestamp + UUID approach, handle database unique constraint errors

- [ ] **Edge Case 4:** Email service API key is invalid or expired
  - **Analysis Approach:** Error handling when Resend API fails
  - **Recommendation:** Log error, return generic error to user, alert team via logging service

### Security & Access Control Review
- [ ] **Public Access:** Contact form is public (no authentication required) - confirm this is intentional
  - **Check:** Route is in `(public)` group, not protected by middleware
  
- [ ] **Rate Limiting:** Are submissions properly rate-limited to prevent abuse?
  - **Check:** Database query counts submissions by email in past hour, returns error if >= 3
  
- [ ] **Input Validation:** Are all user inputs validated server-side?
  - **Check:** Server action validates all fields before database insert
  
- [ ] **SQL Injection:** Is database safe from SQL injection attacks?
  - **Check:** Using Drizzle ORM with parameterized queries (safe by default)
  
- [ ] **XSS Protection:** Are form fields sanitized to prevent XSS?
  - **Check:** React escapes by default, verify no `dangerouslySetInnerHTML` usage
  
- [ ] **Email Injection:** Can users inject headers into email sending?
  - **Check:** Resend SDK escapes email headers, validate email format server-side

---

## 15. Deployment & Configuration

### Environment Variables
```bash
# Add these to .env.local (development) and production environment
RESEND_API_KEY=re_xxx           # Get from Resend dashboard
SUPPORT_EMAIL=support@woovector.com  # Email to receive support notifications
```

**Production Checklist:**
- [ ] Verify Resend domain in Resend dashboard
- [ ] Add environment variables to production hosting (Vercel, Railway, etc.)
- [ ] Test email sending in production with verified email address
- [ ] Monitor rate limiting effectiveness in production logs

---

## 16. AI Agent Instructions

### Default Workflow - STRATEGIC ANALYSIS FIRST
🎯 **STANDARD OPERATING PROCEDURE:**

1. **STRATEGIC ANALYSIS COMPLETED** ✅ - Solution options presented above
2. **WAIT FOR USER DECISION** - Which option to proceed with (Option 1, 2, or 3)
3. **UPDATE PLAN BASED ON CHOICE** - Adjust implementation details based on selected approach
4. **CREATE/UPDATE TASK DOCUMENT** - Already created, will be updated based on user choice
5. **GET USER APPROVAL** of the final task document
6. **IMPLEMENT THE FEATURE** only after approval

### Implementation Approach - CRITICAL WORKFLOW
🚨 **MANDATORY: Follow this exact sequence after user approves strategic direction:**

1. **STRATEGIC DECISION MADE** - User will choose Option 1, 2, or 3
2. **UPDATE IMPLEMENTATION PLAN** - Adjust phases based on selected option
3. **PRESENT IMPLEMENTATION OPTIONS:**

   **👤 IMPLEMENTATION OPTIONS:**
   
   **A) Preview High-Level Code Changes**
   Would you like me to show you detailed code snippets and specific changes before implementing?
   
   **B) Proceed with Implementation**
   Ready to begin implementation? Say "Approved" or "Go ahead" and I'll start implementing phase by phase.
   
   **C) Provide More Feedback**
   Have questions or want to modify the approach?

4. **WAIT FOR USER CHOICE** (A, B, or C) - never assume or default
5. **IMPLEMENT PHASE-BY-PHASE** (Only after Option B approval)

### What Constitutes "Explicit User Approval"

#### For Strategic Analysis
**✅ STRATEGIC APPROVAL RESPONSES:**
- "Option 2 looks good"
- "Go with your recommendation"
- "I prefer Option 1"
- "Proceed with Option 2"

#### For Implementation Options
**✅ OPTION B RESPONSES (Start implementation):**
- "B" or "Option B"
- "Proceed" or "Go ahead"
- "Approved" or "Start implementation"

### 🚨 CRITICAL: Command Execution Rules
**NEVER run application execution commands!**

**❌ FORBIDDEN COMMANDS:**
- `npm run dev` / `npm start` - User already running
- `npm run build` - Expensive and unnecessary

**✅ ALLOWED COMMANDS:**
- `npm run lint` - Static code analysis
- `npm run type-check` - Type checking only
- `npm run db:generate` - Generate migration
- `npm run db:migrate` - Apply migration (after down migration created)

---

## 17. Notes & Additional Context

### Research Links
- Resend Documentation: https://resend.com/docs
- Resend Next.js Guide: https://resend.com/docs/send-with-nextjs
- Drizzle ORM Indexes: https://orm.drizzle.team/docs/indexes-constraints
- shadcn/ui Form Components: https://ui.shadcn.com/docs/components/form

### Implementation Priority Notes
- **MVP Priority:** Focus on functional form submission with email notifications (Option 2)
- **Future Enhancements:** Admin dashboard for viewing submissions, status management, automated responses
- **Email Template Design:** Keep simple for MVP, can enhance later with better HTML templates

---

## 18. Second-Order Consequences & Impact Analysis

### AI Analysis Instructions
🔍 **MANDATORY: The AI agent must analyze this section thoroughly before implementation**

### Impact Assessment Framework

#### 1. **Breaking Changes Analysis**
- [ ] **Existing Navigation:** Changing footer/FAQ/CTA links from mailto to `/contact` route
  - **Impact:** No breaking changes - new route, old mailto links simply replaced
  - **Migration:** None required - instant switchover

- [ ] **Email Address:** Hardcoded "support@woovector.com" becoming configurable
  - **Impact:** Centralized in environment variable for easier updates
  - **Migration:** None required - same email continues to work

- [ ] **Error Pages:** Updating incorrect email addresses in error pages
  - **Impact:** Fixes existing bugs (wrong email addresses)
  - **Migration:** None required - immediate improvement

#### 2. **Ripple Effects Assessment**
- [ ] **User Experience:** Users must now navigate to form instead of opening email client
  - **Positive Impact:** Better for users without email client configured
  - **Potential Negative:** Extra click for users who prefer email
  - **Mitigation:** Make form easily accessible, still show support email on contact page

- [ ] **Support Team Workflow:** Team receives structured emails instead of direct emails
  - **Positive Impact:** Consistent format, reference numbers, all submissions logged
  - **Consideration:** Team needs to reply via regular email (use user's email from form)

- [ ] **Database Growth:** New table will accumulate contact submissions over time
  - **Impact:** ~100-500 bytes per submission, negligible for expected volume
  - **Consideration:** May want to archive old resolved submissions after 1 year

#### 3. **Performance Implications**
- [ ] **Page Load:** New `/contact` route adds one page to application
  - **Impact:** Minimal - simple form page, no heavy data fetching
  
- [ ] **Form Submission:** Database insert + 2 email sends per submission
  - **Impact:** ~1-2 seconds per submission, acceptable for contact forms
  - **Mitigation:** Rate limiting prevents abuse, async email sending

- [ ] **Database Indexes:** 4 indexes added for rate limiting and lookups
  - **Impact:** Faster queries, minimal storage overhead
  - **Performance:** Indexes ensure rate limiting queries remain fast

#### 4. **Security Considerations**
- [ ] **Spam Prevention:** Rate limiting by email address
  - **Risk Level:** Medium - determined attackers can use different emails
  - **Mitigation:** Consider IP-based rate limiting in future, CAPTCHA if needed
  
- [ ] **Email Injection:** Form collects email addresses
  - **Risk Level:** Low - Resend SDK escapes headers, server validates format
  - **Mitigation:** Server-side email format validation before sending
  
- [ ] **XSS Attacks:** Form collects text input (name, subject, message)
  - **Risk Level:** Low - React escapes by default, no `dangerouslySetInnerHTML`
  - **Mitigation:** Server-side validation, proper escaping in database queries

- [ ] **API Key Exposure:** Resend API key in environment variables
  - **Risk Level:** Low - environment variables not exposed to client
  - **Mitigation:** Use .env.local (gitignored), add to hosting platform secrets

#### 5. **User Experience Impacts**
- [ ] **Anonymous Users:** Can now contact support without email client
  - **Impact:** ✅ Significant improvement - removes friction
  
- [ ] **Authenticated Users:** Get name/email pre-filled in form
  - **Impact:** ✅ Better UX - faster submission process
  
- [ ] **Mobile Users:** Form must be responsive and usable on small screens
  - **Impact:** ✅ Improvement over mailto (which often fails on mobile)
  
- [ ] **Confirmation:** Users get reference number and confirmation email
  - **Impact:** ✅ Professional experience - users know request was received

#### 6. **Maintenance Burden**
- [ ] **Email Service Dependency:** Adding dependency on Resend service
  - **Consideration:** Resend free tier (3,000 emails/month) sufficient for most use cases
  - **Fallback:** If Resend goes down, submissions still saved in database
  - **Cost:** Paid plan ($20/mo for 50k emails) if free tier exceeded
  
- [ ] **Database Maintenance:** New table to manage and back up
  - **Consideration:** Minimal overhead, part of existing database backup strategy
  
- [ ] **Code Complexity:** Adding new server action, component, page
  - **Impact:** Moderate increase - ~400 lines of code across 6 new files
  - **Maintainability:** High - clean separation of concerns, follows existing patterns

### Critical Issues Identification

#### 🚨 **RED FLAGS - Alert User Immediately**
- [ ] **Database Migration Required:** Yes - creates new `contact_submissions` table
  - **Alert:** Migration is reversible with down migration, no data loss risk (new table)
  - **Downtime:** None - Postgres supports online schema changes

#### ⚠️ **YELLOW FLAGS - Discuss with User**
- [ ] **Email Service Dependency:** Adding external dependency on Resend
  - **Discussion:** Is Resend acceptable? Alternative: SendGrid, AWS SES, Postmark
  - **Recommendation:** Resend is Next.js-friendly, generous free tier, good developer experience

- [ ] **Rate Limiting Strategy:** Email-based rate limiting can be bypassed
  - **Discussion:** Is 3 submissions per hour per email adequate?
  - **Enhancement:** Can add IP-based rate limiting in future if spam becomes issue

### Mitigation Strategies

#### Email Service Resilience
- [ ] **Graceful Degradation:** If email fails, submission still saved in database
- [ ] **Error Logging:** Log email send failures for manual follow-up
- [ ] **Fallback:** Support team can manually check database if emails not received

#### Spam Prevention
- [ ] **Rate Limiting:** 3 submissions per hour per email (database-enforced)
- [ ] **Future Enhancement:** Add IP-based rate limiting if needed
- [ ] **Future Enhancement:** Add CAPTCHA (hCaptcha or Cloudflare Turnstile) if spam increases

#### Data Privacy
- [ ] **GDPR Compliance:** Store minimal data (no IP tracking by default in schema)
- [ ] **Data Retention:** Consider adding cleanup job for old resolved submissions
- [ ] **User Rights:** Can implement "delete my data" feature if needed

### AI Agent Checklist

Before presenting the task document to the user, the AI agent must:
- [x] **Complete Impact Analysis:** Filled out all sections of the impact assessment
- [x] **Identify Critical Issues:** Flagged database migration (low risk), email dependency (low risk)
- [x] **Propose Mitigation:** Suggested rate limiting strategies, graceful email degradation
- [x] **Alert User:** Will present strategic options and get user choice before implementation
- [x] **Recommend Alternatives:** Three options presented with clear trade-offs

### Example Analysis Summary

```
🔍 **SECOND-ORDER IMPACT ANALYSIS:**

**Database Changes:**
- New table `contact_submissions` with 4 indexes for performance
- Migration is reversible, no risk to existing data
- Expected growth: ~10-50 MB per year (negligible)

**External Dependencies:**
- Adding Resend email service (free tier: 3,000 emails/month)
- Graceful degradation if email fails (submissions still saved)
- Alternative services available if needed (SendGrid, AWS SES)

**Security Considerations:**
- Rate limiting: 3 submissions/hour per email (prevents basic spam)
- Input validation: Server-side validation before database insert
- Email injection: Protected by Resend SDK escaping
- XSS: Protected by React's default escaping

**User Experience:**
- ✅ Improvement for users without email client
- ✅ Mobile-friendly form (better than mailto)
- ✅ Professional confirmation with reference number
- ⚠️ Extra click vs mailto link (but better overall UX)

**Maintenance:**
- Moderate code increase (~400 lines across 6 files)
- Clean architecture following existing patterns
- Minimal ongoing maintenance required

**🚨 USER ATTENTION REQUIRED:**
Please confirm:
1. Resend email service is acceptable (alternative: SendGrid, AWS SES)
2. Rate limiting strategy (3/hour per email) is adequate for your needs
3. No IP tracking in initial implementation (can add if spam becomes issue)
```

---

*Template Version: 1.3*  
*Task Created: 2025-01-06*  
*Next Task Number: 011*

