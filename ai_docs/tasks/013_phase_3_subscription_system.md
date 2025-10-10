# Phase 3: Subscription Plan System Implementation

## Overview
Transform the existing template into a complete WooCommerce AI chatbot SaaS with two-tier subscription management, Stripe integration, and usage tracking for the Italian market.

## Current State Analysis
- ✅ Users table with `stripe_customer_id` field ready
- ✅ UserUsageEvents table for message/session tracking 
- ✅ Basic Stripe integration in place
- ❌ Missing subscription plan structure
- ❌ Missing vendor subscription management
- ❌ Missing enhanced usage tracking for products/conversations

## Target Architecture
**Subscription Tiers:**
- **Starter Plan:** €29/month (€290/year) - 5,000 products, 500 conversations/month
- **Professional Plan:** €59/month (€590/year) - 10,000 products, 2,000 conversations/month

## Task 1: Database Schema - Subscription Plans
**Goal:** Create subscription tier templates with Stripe integration

### Files to Create:
- `woovector/lib/drizzle/schema/subscription-plans.ts`
- `woovector/lib/drizzle/schema/vendor-subscriptions.ts`

### subscription-plans.ts Structure:
```typescript
export const subscriptionPlans = pgTable(
  "subscription_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // "Starter", "Professional"
    price_monthly: integer("price_monthly").notNull(), // €2900, €5900 (cents)
    price_yearly: integer("price_yearly").notNull(), // €29000, €59000 (cents)
    product_limit: integer("product_limit").notNull(), // 5000, 10000
    conversation_limit: integer("conversation_limit").notNull(), // 500, 2000
    stripe_price_id_monthly: text("stripe_price_id_monthly"),
    stripe_price_id_yearly: text("stripe_price_id_yearly"),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  }
);
```

### vendor-subscriptions.ts Structure:
```typescript
export const vendorSubscriptions = pgTable(
  "vendor_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    plan_id: uuid("plan_id").references(() => subscriptionPlans.id),
    stripe_subscription_id: text("stripe_subscription_id").unique(),
    status: text("status").notNull(), // 'trialing', 'active', 'past_due', 'canceled'
    billing_cycle: text("billing_cycle").notNull(), // 'monthly', 'yearly'
    trial_end: timestamp("trial_end", { withTimezone: true }),
    current_period_start: timestamp("current_period_start", { withTimezone: true }),
    current_period_end: timestamp("current_period_end", { withTimezone: true }),
    overage_behavior: text("overage_behavior").default("block"), // 'block' or 'pay'
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("idx_vendor_subscriptions_user_id").on(t.user_id),
    index("idx_vendor_subscriptions_stripe_id").on(t.stripe_subscription_id),
  ]
);
```

### Actions Required:
1. Create both schema files with proper TypeScript types
2. Update `woovector/lib/drizzle/schema/index.ts` to export new schemas
3. Generate migration: `cd woovector && npm run db:generate`
4. Create down migration using template
5. Apply migration: `npm run db:migrate`

## Task 2: Seed Subscription Plans
**Goal:** Populate database with Italian market pricing

### Create: `woovector/scripts/seed-subscription-plans.ts`
```typescript
const plans = [
  {
    name: "Starter",
    price_monthly: 2900, // €29.00
    price_yearly: 29000, // €290.00 (€29 * 10 months)
    product_limit: 5000,
    conversation_limit: 500,
  },
  {
    name: "Professional", 
    price_monthly: 5900, // €59.00
    price_yearly: 59000, // €590.00 (€59 * 10 months)
    product_limit: 10000,
    conversation_limit: 2000,
  }
];
```

### Actions Required:
1. Create comprehensive seed script
2. Run script to populate plans
3. Verify data in database

## Task 3: Stripe Integration Setup
**Goal:** Configure Stripe billing products and pricing

### Stripe Dashboard Configuration:
1. **Starter Plan Product:**
   - Monthly Price: €29.00 → Copy price ID to `.env.local`: `STRIPE_STARTER_MONTHLY_PRICE_ID`
   - Yearly Price: €290.00 → Copy price ID to `.env.local`: `STRIPE_STARTER_YEARLY_PRICE_ID`

2. **Professional Plan Product:**
   - Monthly Price: €59.00 → Copy price ID to `.env.local`: `STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID`
   - Yearly Price: €590.00 → Copy price ID to `.env.local`: `STRIPE_PROFESSIONAL_YEARLY_PRICE_ID`

### Update Files:
- `woovector/lib/stripe.ts` - Add subscription price ID constants
- `woovector/lib/stripe-service.ts` - Add subscription creation logic

## Task 4: Enhanced Usage Tracking
**Goal:** Extend existing usage events for WooCommerce integration

### Update: `woovector/lib/drizzle/schema/usage-events.ts`
- Add `metadata` JSONB field (already exists per current code)
- Extend `USAGE_EVENT_TYPES` constant:
  ```typescript
  export const USAGE_EVENT_TYPES = {
    MESSAGE_SENT: "message_sent", // existing
    SESSION_CREATED: "session_created", // existing
    CONVERSATION_STARTED: "conversation_started", // new
    PRODUCT_IMPORTED: "product_imported", // new
  } as const;
  ```

### Create: `woovector/lib/usage-tracking.ts` helpers
```typescript
export async function trackConversation(userId: string, storeId: string): Promise<void>
export async function checkConversationLimit(userId: string): Promise<boolean>
export async function trackProductImport(userId: string, storeId: string, productCount: number): Promise<void>
export async function checkProductLimit(userId: string): Promise<boolean>
```

## Task 5: Subscription Management UI
**Goal:** Replace existing PlanCard with comprehensive subscription management

### Components to Update/Create:

#### Update: `components/profile/PlanCard.tsx`
- Replace current Free/Pro structure with Starter/Professional tiers
- Add annual/monthly billing toggle
- Show current subscription details with Italian pricing
- Handle trial period display

#### Update: `components/profile/SubscriptionPlansCard.tsx`
- Display both plans with €29/€59 pricing
- Add upgrade/downgrade buttons with proper flow
- Show feature comparison (products/conversations limits)
- Handle immediate upgrade vs renewal downgrade

#### Update: `components/profile/UsageStatisticsCard.tsx`
- Replace existing sessions/messages with products/conversations
- Add progress bars with color coding (green <80%, yellow 80-95%, red >95%)
- Display format: "1,234 / 5,000 products" and "45 / 500 conversations"

#### Update: `app/(protected)/profile/page.tsx`
- Show current subscription tier and billing cycle
- Display next billing date and amount
- Add subscription management actions

## Task 6: Server Actions
**Goal:** Create subscription CRUD operations with Stripe integration

### Create: `woovector/app/actions/subscriptions.ts`
```typescript
export async function createCheckoutSession(planId: string, billingCycle: 'monthly' | 'yearly'): Promise<string>
export async function getCurrentSubscription(): Promise<VendorSubscriptionWithPlan>
export async function cancelSubscription(): Promise<{ success: boolean; error?: string }>
export async function updateSubscription(newPlanId: string): Promise<{ success: boolean; error?: string }>
```

### Update: `woovector/app/api/webhooks/stripe/route.ts`
Handle subscription lifecycle events:
- `subscription.created` - Create vendor subscription record
- `subscription.updated` - Update subscription status/period
- `subscription.deleted` - Mark subscription as canceled
- `invoice.payment_succeeded` - Reset usage counters
- `invoice.payment_failed` - Handle payment failures

## Task 7: Integration & Testing
**Goal:** End-to-end subscription flow validation

### Test Scenarios:
1. **New User Registration:**
   - Choose Starter plan with 1-month free trial
   - Verify Stripe checkout creation
   - Test webhook subscription creation

2. **Usage Tracking:**
   - Verify conversation limit enforcement
   - Test usage statistics display accuracy
   - Validate reset on billing period

3. **Subscription Management:**
   - Test immediate upgrade (Starter → Professional)
   - Test renewal-based downgrade (Professional → Starter)
   - Verify overage behavior configuration

4. **Payment Handling:**
   - Test successful payment processing
   - Handle payment failure scenarios
   - Verify subscription cancellation

### Validation Checklist:
- [ ] Database migrations apply without errors
- [ ] Seed data populates correctly
- [ ] Stripe integration creates subscriptions
- [ ] Webhooks update database properly
- [ ] UI displays subscription information accurately
- [ ] Usage limits enforce correctly
- [ ] Overage behavior works as configured
- [ ] Email notifications send for key events

## Environment Variables Required:
```env
# Stripe Configuration
STRIPE_STARTER_MONTHLY_PRICE_ID=price_xxx
STRIPE_STARTER_YEARLY_PRICE_ID=price_xxx
STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID=price_xxx
STRIPE_PROFESSIONAL_YEARLY_PRICE_ID=price_xxx
```

## Success Criteria:
- [ ] Two subscription tiers with Italian pricing operational
- [ ] Stripe integration handles full subscription lifecycle
- [ ] Usage tracking enforces product and conversation limits
- [ ] UI provides complete subscription management experience
- [ ] Webhooks maintain data consistency between Stripe and database
- [ ] Trial periods and overage behaviors work as designed

## Next Phase Preparation:
After completion, the system will be ready for:
- WooCommerce store connection (Phase 4)
- Product catalog management (Phase 5)
- AI brand voice configuration (Phase 6)
