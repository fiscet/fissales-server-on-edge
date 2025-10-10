#!/usr/bin/env tsx

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { subscriptionPlans } from "../lib/drizzle/schema/subscription-plans";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Italian WooCommerce SaaS subscription plans with 17% annual discount
const SUBSCRIPTION_PLANS = [
  {
    name: "Starter",
    price_monthly: 2900, // €29.00 in cents
    price_yearly: 29000, // €290.00 in cents (10 months pricing - 17% discount)
    product_limit: 5000, // 5,000 WooCommerce products
    conversation_limit: 500, // 500 AI chatbot conversations per month
    stripe_price_id_monthly: null, // Will be set after Stripe configuration
    stripe_price_id_yearly: null,
    is_active: true,
  },
  {
    name: "Professional",
    price_monthly: 5900, // €59.00 in cents
    price_yearly: 59000, // €590.00 in cents (10 months pricing - 17% discount)
    product_limit: 10000, // 10,000 WooCommerce products
    conversation_limit: 2000, // 2,000 AI chatbot conversations per month
    stripe_price_id_monthly: null, // Will be set after Stripe configuration
    stripe_price_id_yearly: null,
    is_active: true,
  },
];

async function main(): Promise<void> {
  console.log("🚀 Seeding subscription plans for Italian WooCommerce SaaS market...");

  // Create PostgreSQL connection
  const client = postgres(DATABASE_URL!, {
    prepare: false,
    ssl: "require",
  });
  const db = drizzle(client);

  try {
    // Check if plans already exist
    console.log("🔍 Checking existing subscription plans...");
    const existingPlans = await db.select().from(subscriptionPlans);

    if (existingPlans.length > 0) {
      console.log(`⚠️  Found ${existingPlans.length} existing plan(s). Skipping seed to prevent duplicates.`);
      console.log("💡 To re-seed, delete existing plans first or update this script to handle updates.");
      return;
    }

    // Insert subscription plans
    console.log("📝 Inserting subscription plans...");

    for (const plan of SUBSCRIPTION_PLANS) {
      console.log(`   📋 Creating ${plan.name} plan - €${plan.price_monthly / 100}/month (€${plan.price_yearly / 100}/year)`);
      console.log(`      📦 Limits: ${plan.product_limit.toLocaleString()} products, ${plan.conversation_limit} conversations/month`);
    }

    const insertedPlans = await db
      .insert(subscriptionPlans)
      .values(SUBSCRIPTION_PLANS)
      .returning();

    console.log(`✅ Successfully created ${insertedPlans.length} subscription plans!`);
    console.log("");
    console.log("🎯 Next steps:");
    console.log("   1. Configure Stripe products and prices");
    console.log("   2. Update plans with Stripe price IDs using environment variables");
    console.log("   3. Test subscription creation flow");

  } catch (error) {
    console.error("❌ Seeding failed:");
    console.error(error);
    throw error;
  } finally {
    // Close the connection
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

main().catch((err) => {
  console.error("💥 Seed process failed:");
  console.error(err);
  process.exit(1);
});
