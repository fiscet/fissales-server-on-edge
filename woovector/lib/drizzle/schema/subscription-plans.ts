import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";

// Subscription Plans table - templates for Starter and Professional tiers
export const subscriptionPlans = pgTable(
  "subscription_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // "Starter", "Professional"

    // Italian market pricing in cents (€29.00 = 2900, €59.00 = 5900)
    price_monthly: integer("price_monthly").notNull(), // €2900, €5900 (cents)
    price_yearly: integer("price_yearly").notNull(), // €29000, €59000 (cents) - 10 month pricing

    // WooCommerce product and conversation limits
    product_limit: integer("product_limit").notNull(), // 5000, 10000 products
    conversation_limit: integer("conversation_limit").notNull(), // 500, 2000 conversations/month

    // Stripe price IDs for billing integration
    stripe_price_id_monthly: text("stripe_price_id_monthly"), // Monthly billing price ID
    stripe_price_id_yearly: text("stripe_price_id_yearly"), // Yearly billing price ID

    // Plan management
    is_active: boolean("is_active").default(true),

    // Metadata
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  }
);

// Zod validation schemas
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans);
export const selectSubscriptionPlanSchema = createSelectSchema(subscriptionPlans);

// Update schema - useful for PATCH requests
export const updateSubscriptionPlanSchema = insertSubscriptionPlanSchema.partial();

// TypeScript types
export type SubscriptionPlan = InferSelectModel<typeof subscriptionPlans>;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;
export type UpdateSubscriptionPlan = Partial<SubscriptionPlan>;

// Plan tier types for the Italian WooCommerce SaaS market
export type PlanTier = "starter" | "professional";

// Plan configuration constants
export const PLAN_TIERS = {
  STARTER: "starter",
  PROFESSIONAL: "professional",
} as const;
