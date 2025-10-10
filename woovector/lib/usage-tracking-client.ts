/**
 * Usage Tracking Client Utilities for WooCommerce AI SaaS
 *
 * Client-safe utilities for usage enforcement UI components.
 * Contains types, formatters, and helper functions that can be safely imported by client components.
 * WooCommerce SaaS usage tracking: conversations and products only.
 */

// Import client-safe types from subscriptions
import { type SubscriptionTier } from "@/lib/subscriptions";

// WooCommerce SaaS usage statistics interface
export interface UsageStats {
  subscriptionTier: SubscriptionTier;
  billingPeriodStart: Date;
  usage: {
    // WooCommerce SaaS usage tracking
    conversations: {
      used: number;
      limit: number;
      resetPeriod: "monthly";
      nextReset?: Date;
    };
    products: {
      used: number;
      limit: number;
      resetPeriod: "monthly";
      nextReset?: Date;
    };
  };
  stripeData: {
    currentPeriodStart: Date | null;
    currentPeriodEnd: Date | null;
    cancelAtPeriodEnd: boolean;
  };
}

/**
 * Get default usage stats for error cases - WooCommerce SaaS trial period
 * This is a pure function with no server dependencies
 */
export function getDefaultUsageStats(): UsageStats {
  return {
    subscriptionTier: "starter", // Default to starter during 1-month trial
    billingPeriodStart: new Date(),
    usage: {
      // WooCommerce SaaS default limits (Starter plan during trial)
      conversations: { used: 0, limit: 500, resetPeriod: "monthly" },
      products: { used: 0, limit: 5000, resetPeriod: "monthly" },
    },
    stripeData: {
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    },
  };
}

// Usage enforcement specific types - WooCommerce SaaS only
export interface UsageCheckResult {
  allowed: boolean;
  reason?: string;
  currentUsage: {
    conversations: { used: number; limit: number; };
    products: { used: number; limit: number; };
  };
  upgradeRequired?: boolean;
  canStartConversation?: boolean;
  canImportProducts?: boolean;
}

/**
 * Core usage limit checking logic (shared between client and server)
 */
export function checkUsageLimitsCore(usage: { used: number; limit: number; }): {
  canUse: boolean;
  reason?: string;
  upgradeRequired?: boolean;
} {
  // -1 means unlimited (paid tier)
  if (usage.limit === -1) {
    return { canUse: true };
  }

  if (usage.used >= usage.limit) {
    return {
      canUse: false,
      reason: "Usage limit exceeded. Upgrade to continue.",
      upgradeRequired: true,
    };
  }

  return { canUse: true };
}


// ===============================
// WooCommerce SaaS Client-Safe Functions
// ===============================

/**
 * Client-safe function to check if user can start conversations
 */
export function canStartConversation(usageStats: UsageStats | null): {
  canStart: boolean;
  reason?: string;
  upgradeRequired?: boolean;
} {
  if (!usageStats) {
    return {
      canStart: false,
      reason: "Unable to load usage information",
      upgradeRequired: false,
    };
  }

  return {
    canStart: checkUsageLimitsCore(usageStats.usage.conversations).canUse,
    reason: checkUsageLimitsCore(usageStats.usage.conversations).reason,
    upgradeRequired: checkUsageLimitsCore(usageStats.usage.conversations)
      .upgradeRequired,
  };
}

/**
 * Client-safe function to check if user can import products
 */
export function canImportProducts(usageStats: UsageStats | null): {
  canImport: boolean;
  reason?: string;
  upgradeRequired?: boolean;
} {
  if (!usageStats) {
    return {
      canImport: false,
      reason: "Unable to load usage information",
      upgradeRequired: false,
    };
  }

  return {
    canImport: checkUsageLimitsCore(usageStats.usage.products).canUse,
    reason: checkUsageLimitsCore(usageStats.usage.products).reason,
    upgradeRequired: checkUsageLimitsCore(usageStats.usage.products)
      .upgradeRequired,
  };
}

/**
 * Client-safe function to get usage percentage for UI progress bars
 */
export function getUsagePercentage(used: number, limit: number): number {
  if (limit === -1) return 0; // Unlimited plan
  if (limit === 0) return 100; // No limit set

  return Math.min(Math.round((used / limit) * 100), 100);
}

/**
 * Client-safe function to get usage color for UI indicators
 */
export function getUsageColor(used: number, limit: number): "green" | "yellow" | "red" {
  const percentage = getUsagePercentage(used, limit);

  if (percentage < 80) return "green";
  if (percentage < 95) return "yellow";
  return "red";
}

/**
 * Client-safe function to format usage display text
 */
export function formatUsageDisplay(used: number, limit: number): string {
  if (limit === -1) return "Unlimited";

  return `${used.toLocaleString()} / ${limit.toLocaleString()}`;
}
