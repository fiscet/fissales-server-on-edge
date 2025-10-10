/**
 * Usage Enforcement Library for WooCommerce AI SaaS
 *
 * Server-side usage limit checking and enforcement for subscription tiers.
 * Provides real-time calculations using the userUsageEvents table for conversations and products.
 *
 * This file contains server-only operations and should not be imported by client components.
 *
 * ARCHITECTURE:
 * - getUserUsage(): Core consolidated function that retrieves all usage data from database
 * - getUserUsageStatsForUI(): UI wrapper for components (returns UsageStats with nextReset, billingPeriod)
 * - checkConversationLimits(): Conversation starting enforcement
 * - checkProductLimits(): Product import enforcement
 * - recordUsageEvent(): Record usage events in the database
 */

import { eq, and, sql, gte } from "drizzle-orm";
import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema/users";
import {
  userUsageEvents,
  USAGE_EVENT_TYPES,
  type UsageEventType,
} from "@/lib/drizzle/schema/usage-events";
import {
  getUsageLimitsForTier,
  type SubscriptionTier,
  type UsageLimits,
} from "@/lib/subscriptions";
import { getSubscriptionFromStripe } from "@/lib/stripe-service";
import { revalidatePath } from "next/cache";

// Import client-safe types and utilities for use in server functions
import type { UsageCheckResult, UsageStats } from "./usage-tracking-client";

// Import shared validation utilities
import {
  checkUsageLimitsCore,
  getDefaultUsageStats,
} from "./usage-tracking-client";
import { requireUserId } from "./auth";

// Re-export for backward compatibility
export { getDefaultUsageStats };

// Re-export all client-safe types and constants for consumers
export type { UsageCheckResult, UsageStats } from "./usage-tracking-client";

// Re-export usage event types and constants
export {
  USAGE_EVENT_TYPES,
  type UsageEventType,
} from "@/lib/drizzle/schema/usage-events";

/**
 * Get the start time for the current usage window (monthly-only)
 */
function getUsageWindowStart(currentPeriodStart?: Date): Date {
  // Use billing period start if provided
  if (currentPeriodStart) {
    return new Date(currentPeriodStart);
  }

  // Fallback to first of current month in UTC
  const now = new Date();
  const monthStart = new Date(now);
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  return monthStart;
}
/**
 * Calculate usage within a time window for WooCommerce SaaS event types
 */
async function calculateUsage(
  userId: string,
  windowStart: Date
): Promise<{
  conversationUsage: number;
  productUsage: number;
}> {
  try {
    // Calculate conversation usage (WooCommerce SaaS - AI chatbot conversations)
    const [conversationResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userUsageEvents)
      .where(
        and(
          eq(userUsageEvents.userId, userId),
          eq(userUsageEvents.eventType, USAGE_EVENT_TYPES.CONVERSATION_STARTED),
          gte(userUsageEvents.createdAt, windowStart)
        )
      );

    // Calculate product import usage (WooCommerce SaaS - product imports)
    const [productResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userUsageEvents)
      .where(
        and(
          eq(userUsageEvents.userId, userId),
          eq(userUsageEvents.eventType, USAGE_EVENT_TYPES.PRODUCT_IMPORTED),
          gte(userUsageEvents.createdAt, windowStart)
        )
      );

    return {
      conversationUsage: Number(conversationResult?.count || 0),
      productUsage: Number(productResult?.count || 0),
    };
  } catch (error) {
    console.error("Error calculating usage:", error);
    return {
      conversationUsage: 0,
      productUsage: 0,
    };
  }
}

/**
 * Core usage data retrieval function
 * Consolidated function that gets all usage data from database
 */
async function getUserUsage(userId: string): Promise<{
  user: {
    id: string;
    stripe_customer_id: string | null;
  };
  subscriptionTier: SubscriptionTier;
  limits: UsageLimits;
  usage: {
    conversations: { used: number; limit: number; };
    products: { used: number; limit: number; };
  };
  windowStart: Date;
  stripeData: {
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  };
} | null> {
  try {
    // Get user info - subscription data comes from Stripe directly
    const [user] = await db
      .select({
        id: users.id,
        stripe_customer_id: users.stripe_customer_id,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return null;
    }

    // Handle users without Stripe customer ID (free tier users)
    let stripeSubscriptionData;

    if (!user.stripe_customer_id) {
      // User without Stripe customer ID = free tier
      stripeSubscriptionData = {
        tier: "free" as SubscriptionTier,
        currentPeriodStart: null,
        currentPeriodEnd: null,
      };
    } else {
      stripeSubscriptionData = await getSubscriptionFromStripe(
        user.stripe_customer_id
      );
    }

    const subscriptionTier = stripeSubscriptionData.tier;
    const limits = getUsageLimitsForTier(subscriptionTier);

    // Calculate usage window start using Stripe period dates
    const windowStart = getUsageWindowStart(
      stripeSubscriptionData.currentPeriodStart || undefined
    );

    // Get WooCommerce SaaS usage within time window
    const { conversationUsage, productUsage } = await calculateUsage(
      userId,
      windowStart
    );

    return {
      user,
      subscriptionTier,
      limits,
      usage: {
        conversations: {
          used: conversationUsage || 0,
          limit: limits.conversations,
        },
        products: {
          used: productUsage || 0,
          limit: limits.products,
        },
      },
      windowStart,
      stripeData: {
        currentPeriodStart: stripeSubscriptionData.currentPeriodStart,
        currentPeriodEnd: stripeSubscriptionData.currentPeriodEnd,
        cancelAtPeriodEnd: stripeSubscriptionData.cancelAtPeriodEnd || false,
      },
    };
  } catch (error) {
    console.error("Error getting user usage data:", error);
    return null;
  }
}

/**
 * Check if user can start a conversation
 */
export async function checkConversationLimits(
  userId: string
): Promise<UsageCheckResult> {
  try {
    const usageData = await getUserUsage(userId);

    if (!usageData) {
      return {
        allowed: false,
        reason: "Unable to fetch user information",
        currentUsage: {
          conversations: { used: 0, limit: 0 },
          products: { used: 0, limit: 0 },
        },
        upgradeRequired: true,
        canStartConversation: false,
        canImportProducts: false,
      };
    }

    const conversationCheck = checkUsageLimitsCore(usageData.usage.conversations);
    const productCheck = checkUsageLimitsCore(usageData.usage.products);

    return {
      allowed: conversationCheck.canUse,
      reason: conversationCheck.reason,
      currentUsage: {
        conversations: usageData.usage.conversations,
        products: usageData.usage.products,
      },
      upgradeRequired: conversationCheck.upgradeRequired || false,
      canStartConversation: conversationCheck.canUse,
      canImportProducts: productCheck.canUse,
    };
  } catch (error) {
    console.error("Error checking conversation limits:", error);

    // Fail safely - deny conversation if we can't check limits
    return {
      allowed: false,
      reason: "Unable to verify usage limits. Please try again.",
      currentUsage: {
        conversations: { used: 0, limit: 0 },
        products: { used: 0, limit: 0 },
      },
      upgradeRequired: false,
      canStartConversation: false,
      canImportProducts: false,
    };
  }
}

/**
 * Check if user can import products
 */
export async function checkProductLimits(
  userId: string
): Promise<UsageCheckResult> {
  try {
    const usageData = await getUserUsage(userId);

    if (!usageData) {
      return {
        allowed: false,
        reason: "Unable to fetch user information",
        currentUsage: {
          conversations: { used: 0, limit: 0 },
          products: { used: 0, limit: 0 },
        },
        upgradeRequired: true,
        canStartConversation: false,
        canImportProducts: false,
      };
    }

    const conversationCheck = checkUsageLimitsCore(usageData.usage.conversations);
    const productCheck = checkUsageLimitsCore(usageData.usage.products);

    return {
      allowed: productCheck.canUse,
      reason: productCheck.reason,
      currentUsage: {
        conversations: usageData.usage.conversations,
        products: usageData.usage.products,
      },
      upgradeRequired: productCheck.upgradeRequired || false,
      canStartConversation: conversationCheck.canUse,
      canImportProducts: productCheck.canUse,
    };
  } catch (error) {
    console.error("Error checking product limits:", error);

    // Fail safely - deny product import if we can't check limits
    return {
      allowed: false,
      reason: "Unable to verify usage limits. Please try again.",
      currentUsage: {
        conversations: { used: 0, limit: 0 },
        products: { used: 0, limit: 0 },
      },
      upgradeRequired: false,
      canStartConversation: false,
      canImportProducts: false,
    };
  }
}

/**
 * Get comprehensive usage statistics for a user
 * Returns UsageStats format for actions and UI components
 * This is the main function used throughout the app for fetching user usage data
 */
export async function getUserUsageStatsForUI(
  userId: string
): Promise<UsageStats | null> {
  const data = await getUserUsage(userId);

  if (!data) {
    return null;
  }

  // Calculate next reset time using Stripe billing period data
  let nextReset: Date;
  let billingPeriodStart: Date;

  if (data.stripeData.currentPeriodEnd) {
    // Use Stripe subscription period data
    nextReset = new Date(data.stripeData.currentPeriodEnd);
    billingPeriodStart = data.stripeData.currentPeriodStart || data.windowStart;
  } else {
    // Fallback to monthly calculation for free tier
    nextReset = new Date();
    nextReset.setMonth(nextReset.getMonth() + 1);
    nextReset.setDate(1); // First of next month
    billingPeriodStart = data.windowStart;
  }

  return {
    subscriptionTier: data.subscriptionTier,
    usage: {
      conversations: {
        ...data.usage.conversations,
        resetPeriod: "monthly" as const,
        nextReset,
      },
      products: {
        ...data.usage.products,
        resetPeriod: "monthly" as const,
        nextReset,
      },
    },
    billingPeriodStart,
    stripeData: {
      currentPeriodStart: data.stripeData.currentPeriodStart,
      currentPeriodEnd: data.stripeData.currentPeriodEnd,
      cancelAtPeriodEnd: data.stripeData.cancelAtPeriodEnd,
    },
  };
}

/**
 * Standard result type for usage event recording
 */
export type UsageEventResult = {
  success: boolean;
  error?: string;
};

/** Usage event recording function */
export async function recordUsageEvent(
  eventType: UsageEventType
): Promise<UsageEventResult> {
  try {
    // Get authenticated user
    const userId = await requireUserId();

    if (!userId) {
      return { success: false, error: "Authentication required" };
    }

    // Record the usage event
    await db.insert(userUsageEvents).values({
      userId: userId,
      eventType: eventType,
    });

    // Revalidate any pages that show usage stats
    revalidatePath("/profile");
    if (eventType === USAGE_EVENT_TYPES.CONVERSATION_STARTED) {
      revalidatePath("/profile");
    }

    return { success: true };
  } catch (error) {
    console.error(`Error recording ${eventType} event:`, error);
    return {
      success: false,
      error: `Failed to record ${eventType} event`,
    };
  }
}

// ===============================
// WooCommerce SaaS Usage Tracking Functions
// ===============================

/**
 * Track a WooCommerce AI chatbot conversation start
 */
export async function trackConversation(
  userId: string,
  storeId?: string
): Promise<UsageEventResult> {
  try {
    // Record conversation start event with optional store context
    await db.insert(userUsageEvents).values({
      userId: userId,
      eventType: USAGE_EVENT_TYPES.CONVERSATION_STARTED,
      // Store metadata for future WooCommerce store tracking
      ...(storeId && {
        // metadata field can store additional context when needed
      }),
    });

    // Revalidate profile to update usage stats
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Error tracking conversation:", error);
    return {
      success: false,
      error: "Failed to track conversation",
    };
  }
}

/**
 * Check if user can start a new conversation based on subscription limits
 * Alias for checkConversationLimits - WooCommerce SaaS only
 */
export async function checkConversationLimit(userId: string): Promise<UsageCheckResult> {
  return checkConversationLimits(userId);
}

/**
 * Track WooCommerce product import events
 */
export async function trackProductImport(
  userId: string,
  storeId: string,
  productCount: number
): Promise<UsageEventResult> {
  try {
    // Record multiple product import events based on count
    // Each product counts as one usage event for limit tracking
    const events = Array(productCount).fill(null).map(() => ({
      userId: userId,
      eventType: USAGE_EVENT_TYPES.PRODUCT_IMPORTED,
      // metadata could store store context: { storeId, batchId, etc. }
    }));

    if (events.length > 0) {
      await db.insert(userUsageEvents).values(events);
    }

    // Revalidate profile to update usage stats
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Error tracking product import:", error);
    return {
      success: false,
      error: "Failed to track product import",
    };
  }
}

/**
 * Check if user can import products based on subscription limits
 * Alias for checkProductLimits - WooCommerce SaaS only
 */
export async function checkProductLimit(userId: string): Promise<UsageCheckResult> {
  return checkProductLimits(userId);
}
