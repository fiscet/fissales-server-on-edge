"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createCheckoutSession,
  createCancelSession,
} from "@/app/actions/subscriptions";
import { useUsage } from "@/contexts/UsageContext";
import type { SubscriptionTier } from "@/lib/subscriptions";
import { cn } from "@/lib/utils";

interface PlanFeature {
  name: string;
  conversations: number;
  products: number;
  price: number;
  support: string;
  description: string;
}

interface PlanCardProps {
  plan: PlanFeature;
  loading: boolean;
}

export function PlanCard({ plan, loading }: PlanCardProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCancelSubscription = async (): Promise<void> => {
    setCheckoutLoading(true);
    try {
      await createCancelSession();
    } catch (error) {
      console.error("Error during cancellation:", error);
      setCheckoutLoading(false);
    }
  };
  const { usageStats } = useUsage();
  const subscriptionTier: SubscriptionTier =
    (usageStats?.subscriptionTier as SubscriptionTier) || "free";
  const isCurrentPlan =
    (subscriptionTier === "starter" && plan.name === "Starter") ||
    (subscriptionTier === "professional" && plan.name === "Professional");

  let conversationsText = "";
  conversationsText = `${plan.conversations.toLocaleString()} AI conversations/month`;

  let productsText = "";
  productsText = `${plan.products.toLocaleString()} WooCommerce products`;

  const renderActionButton = () => {
    // Free plan - no action needed
    if (plan.name === "Free") {
      return null;
    }
    if (subscriptionTier === "free") {
      // Upgrade from free to pro - use server action directly
      return (
        <form action={createCheckoutSession}>
          <Button type="submit" size="sm" className="w-full" disabled={loading}>
            Upgrade
          </Button>
        </form>
      );
    }

    if (subscriptionTier === "paid") {
      // Cancel pro subscription - direct portal link
      return (
        <Button
          size="sm"
          className="w-full"
          variant="outline"
          disabled={
            usageStats?.stripeData?.cancelAtPeriodEnd ||
            loading ||
            checkoutLoading
          }
          onClick={handleCancelSubscription}
        >
          {usageStats?.stripeData?.cancelAtPeriodEnd
            ? "Cancellation Scheduled"
            : checkoutLoading
              ? "Loading..."
              : "Cancel"}
        </Button>
      );
    }

    return null;
  };

  return (
    <div
      className={cn(
        "rounded-lg px-5 py-4",
        isCurrentPlan
          ? "ring-2 ring-primary/80 bg-primary/10 dark:bg-primary/20"
          : "border"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{plan.name}</h3>
          {isCurrentPlan && <Badge variant="outline">Current</Badge>}
        </div>
        <div className="text-2xl font-bold">
          ${plan.price}
          <span className="text-sm font-normal text-muted-foreground">
            /month
          </span>
        </div>
        <ul className="space-y-1 text-sm">
          <li>• {conversationsText}</li>
          <li>• {productsText}</li>
          <li>• {plan.support}</li>
        </ul>
        <p className="text-xs text-muted-foreground">{plan.description}</p>
        {renderActionButton()}
      </div>
    </div>
  );
}
