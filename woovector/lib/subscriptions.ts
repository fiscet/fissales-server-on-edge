// WooCommerce AI SaaS subscription types - Two-tier EU market model
export type SubscriptionTier = "starter" | "professional";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete";

// Usage limits configuration for WooCommerce SaaS
export type UsageLimits = {
  conversations: number; // AI chatbot conversations per month
  products: number; // WooCommerce products that can be imported
};

export const USAGE_LIMITS: Record<SubscriptionTier, UsageLimits> = {
  starter: {
    conversations: 500, // 500 AI conversations per month
    products: 5000, // 5,000 WooCommerce products
  },
  professional: {
    conversations: 2000, // 2,000 AI conversations per month
    products: 10000, // 10,000 WooCommerce products
  },
};

// Get usage limits for a subscription tier
export function getUsageLimitsForTier(tier: SubscriptionTier): UsageLimits {
  return USAGE_LIMITS[tier];
}

// Check if user has active subscription (both starter and professional are paid)
export function hasPaidSubscription(tier: SubscriptionTier): boolean {
  return tier === "starter" || tier === "professional";
}

// EU market tier display names
export function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case "starter":
      return "Starter";
    case "professional":
      return "Professional";
    default:
      return "Starter";
  }
}

// EU market pricing (EUR in cents)
export const PRICING = {
  starter: {
    monthly: 2900, // €29.00 in cents
    yearly: 29000, // €290.00 in cents (17% discount)
    currency: "EUR",
    displayPriceMonthly: "€29",
    displayPriceYearly: "€290",
  },
  professional: {
    monthly: 5900, // €59.00 in cents  
    yearly: 59000, // €590.00 in cents (17% discount)
    currency: "EUR",
    displayPriceMonthly: "€59",
    displayPriceYearly: "€590",
  },
} as const;
