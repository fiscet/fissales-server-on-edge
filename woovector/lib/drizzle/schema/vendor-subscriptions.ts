import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";
import { subscriptionPlans } from "./subscription-plans";

// Vendor Subscriptions table - individual vendor subscriptions with trial and overage control
export const vendorSubscriptions = pgTable(
  "vendor_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relations
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    plan_id: uuid("plan_id")
      .references(() => subscriptionPlans.id)
      .notNull(),

    // Stripe integration
    stripe_subscription_id: text("stripe_subscription_id").unique(),
    status: text("status").notNull(), // 'trialing', 'active', 'past_due', 'canceled', 'incomplete'

    // Billing configuration
    billing_cycle: text("billing_cycle").notNull(), // 'monthly', 'yearly'

    // Trial and billing periods
    trial_end: timestamp("trial_end", { withTimezone: true }), // 1-month free trial
    current_period_start: timestamp("current_period_start", { withTimezone: true }),
    current_period_end: timestamp("current_period_end", { withTimezone: true }),

    // Italian market feature: vendor choice for overage handling
    overage_behavior: text("overage_behavior")
      .default("block"), // 'block' (stop chatbot) or 'pay' (pay-per-extra conversation)

    // Metadata
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    // Indexes for efficient queries
    index("idx_vendor_subscriptions_user_id").on(t.user_id),
    index("idx_vendor_subscriptions_stripe_id").on(t.stripe_subscription_id),
    index("idx_vendor_subscriptions_status").on(t.status),
  ]
);

// Zod validation schemas
export const insertVendorSubscriptionSchema = createInsertSchema(vendorSubscriptions);
export const selectVendorSubscriptionSchema = createSelectSchema(vendorSubscriptions);

// Update schema - useful for PATCH requests
export const updateVendorSubscriptionSchema = insertVendorSubscriptionSchema.partial();

// TypeScript types
export type VendorSubscription = InferSelectModel<typeof vendorSubscriptions>;
export type InsertVendorSubscription = typeof vendorSubscriptions.$inferInsert;
export type UpdateVendorSubscription = Partial<VendorSubscription>;

// Subscription status constants based on Stripe webhook events
export const SUBSCRIPTION_STATUS = {
  TRIALING: "trialing", // 1-month free trial period
  ACTIVE: "active", // Active paid subscription
  PAST_DUE: "past_due", // Payment failed but still active
  CANCELED: "canceled", // Subscription canceled
  INCOMPLETE: "incomplete", // Initial payment failed
  INCOMPLETE_EXPIRED: "incomplete_expired", // Payment collection expired
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

// Billing cycle types for Italian market
export const BILLING_CYCLES = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export type BillingCycle = typeof BILLING_CYCLES[keyof typeof BILLING_CYCLES];

// Overage behavior types - vendor configurable
export const OVERAGE_BEHAVIORS = {
  BLOCK: "block", // Stop chatbot when limits exceeded
  PAY: "pay", // Pay per extra conversation (future enhancement)
} as const;

export type OverageBehavior = typeof OVERAGE_BEHAVIORS[keyof typeof OVERAGE_BEHAVIORS];

// Combined type for subscription with plan details
export type VendorSubscriptionWithPlan = VendorSubscription & {
  plan: {
    name: string;
    price_monthly: number;
    price_yearly: number;
    product_limit: number;
    conversation_limit: number;
  };
};
