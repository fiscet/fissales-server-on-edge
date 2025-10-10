"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlanCard } from "./PlanCard";

const PLANS = [
  {
    name: "Starter",
    conversations: 500,
    products: 5000,
    price: 29,
    support: "Email support",
    description: "Perfect for small WooCommerce stores",
  },
  {
    name: "Professional",
    conversations: 2000,
    products: 10000,
    price: 59,
    support: "Priority support",
    description: "Best for growing WooCommerce stores",
  },
];

export function SubscriptionPlansCard() {
  return (
    <>
      <Card className="md:col-span-2" data-section="plans">
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Choose the plan that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} loading={false} />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
