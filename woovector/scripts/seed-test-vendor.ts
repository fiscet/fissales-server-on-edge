#!/usr/bin/env tsx

import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { users } from "../lib/drizzle/schema/users";
import { vendorStores } from "../lib/drizzle/schema/vendor-stores";

// Generate API key function
function generateApiKey(): string {
  const prefix = "wv_";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 12);
  return `${prefix}${timestamp}_${random}`;
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Test vendor configuration
const TEST_VENDOR = {
  email: "test-vendor@example.com",
  password: "vendor123",
  full_name: "Test Vendor",
  store_name: "Test WooCommerce Store",
  store_url: "https://test-store.example.com",
  store_description: "A test store for demonstrating chatbot integration with WooCommerce",
};

async function main(): Promise<void> {
  console.log("Seeder: Creating test vendor...");

  // Create PostgreSQL connection
  const client = postgres(DATABASE_URL!, {
    prepare: false,
  });
  const db = drizzle(client);

  try {
    // Check if test vendor user already exists
    console.log("Checking existing test vendor user...");
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, TEST_VENDOR.email));

    let userId: string;

    if (existingUser.length > 0) {
      console.log(`Test vendor user "${TEST_VENDOR.email}" already exists.`);
      userId = existingUser[0].id;
    } else {
      // Create test vendor user
      console.log(`Creating test vendor user: ${TEST_VENDOR.email}`);

      const insertedUser = await db
        .insert(users)
        .values({
          email: TEST_VENDOR.email,
          password_hash: "test_hash_not_for_auth", // Not meant for real auth
          full_name: TEST_VENDOR.full_name,
          role: "member",
          email_verified: true,
        })
        .returning();

      userId = insertedUser[0].id;
      console.log(`Created test vendor user with ID: ${userId}`);
    }

    // Check if vendor store already exists
    const existingStore = await db
      .select()
      .from(vendorStores)
      .where(eq(vendorStores.user_id, userId));

    if (existingStore.length > 0) {
      console.log("Vendor store already exists for this user.");
      console.log("");
      console.log("Vendor Store Details:");
      console.log(`   Store Name: ${existingStore[0].store_name}`);
      console.log(`   Store URL: ${existingStore[0].store_url}`);
      console.log(`   API Key: ${existingStore[0].api_key}`);
      console.log(`   Status: ${existingStore[0].status}`);
      console.log(`   Chatbot Enabled: ${existingStore[0].chatbot_enabled}`);
      console.log("");
      console.log("To test the chatbot API, use:");
      console.log(`   POST http://localhost:3000/api/chatbot/${existingStore[0].api_key}`);
      console.log("   Body: { \"message\": \"Hello\", \"userId\": \"test-user\", \"sessionId\": \"test-session\" }");
      await client.end();
      return;
    }

    // Generate API key
    const apiKey = generateApiKey();
    console.log(`Generated API Key: ${apiKey}`);

    // Create vendor store
    const insertedStore = await db
      .insert(vendorStores)
      .values({
        user_id: userId,
        store_name: TEST_VENDOR.store_name,
        store_url: TEST_VENDOR.store_url,
        store_description: TEST_VENDOR.store_description,
        api_key: apiKey,
        chatbot_enabled: true,
        status: "active",
        default_language: "en",
        brand_voice: JSON.stringify({
          tone: "friendly",
          personality: ["helpful", "knowledgeable", "enthusiastic"],
          guidelines: ["Be concise", "Focus on products", "Offer alternatives if product not found"],
        }),
      })
      .returning();

    console.log("");
    console.log("Test vendor created successfully!");
    console.log("");
    console.log("=".repeat(60));
    console.log("VENDOR STORE DETAILS");
    console.log("=".repeat(60));
    console.log(`   Store Name: ${insertedStore[0].store_name}`);
    console.log(`   Store URL: ${insertedStore[0].store_url}`);
    console.log(`   Store Description: ${insertedStore[0].store_description}`);
    console.log(`   Status: ${insertedStore[0].status}`);
    console.log(`   Chatbot Enabled: ${insertedStore[0].chatbot_enabled}`);
    console.log("");
    console.log("=".repeat(60));
    console.log("API CREDENTIALS");
    console.log("=".repeat(60));
    console.log(`   API Key: ${apiKey}`);
    console.log("");
    console.log("=".repeat(60));
    console.log("HOW TO USE FROM EXTERNAL CLIENT (e.g., WordPress Chatbot)");
    console.log("=".repeat(60));
    console.log("");
    console.log("1. CHECK API STATUS (GET):");
    console.log(`   GET http://localhost:3000/api/chatbot/${apiKey}`);
    console.log("");
    console.log("2. SEND A MESSAGE (POST - Non-streaming):");
    console.log(`   POST http://localhost:3000/api/chatbot/${apiKey}`);
    console.log("   Headers: { \"Content-Type\": \"application/json\" }");
    console.log("   Body:");
    console.log("   {");
    console.log("     \"message\": \"Ciao, cerco prodotti per la casa\",");
    console.log("     \"userId\": \"wp-user-123\",");
    console.log("     \"sessionId\": \"wp-session-abc\"");
    console.log("   }");
    console.log("");
    console.log("3. SEND A MESSAGE (POST - Streaming with SSE):");
    console.log(`   POST http://localhost:3000/api/chatbot/${apiKey}?stream=true`);
    console.log("   Headers: { \"Content-Type\": \"application/json\" }");
    console.log("   Body: (same as above)");
    console.log("   Response: Server-Sent Events stream");
    console.log("");
    console.log("=".repeat(60));
    console.log("WORDPRESS/JAVASCRIPT EXAMPLE CODE");
    console.log("=".repeat(60));
    console.log(`
async function sendMessage(message, userId, sessionId) {
  const response = await fetch('http://localhost:3000/api/chatbot/${apiKey}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message,
      userId: userId,
      sessionId: sessionId
    })
  });
  
  const data = await response.json();
  return data;
}

// Usage:
const reply = await sendMessage('Ciao, cosa vendete?', 'user-123', 'session-abc');
console.log(reply.data.message);
`);
    console.log("=".repeat(60));

  } catch (error) {
    console.error("Seeding failed:");
    console.error(error);
    throw error;
  } finally {
    // Close the connection
    await client.end();
    console.log("Database connection closed");
  }
}

main().catch((err) => {
  console.error("Seed process failed:");
  console.error(err);
  process.exit(1);
});