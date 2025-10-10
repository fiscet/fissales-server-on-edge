import { pgTable, text, timestamp, uuid, index, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";

// Vendor Stores table - stores vendor API keys and configuration for external chatbot integration
export const vendorStores = pgTable(
  "vendor_stores",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Relations
    user_id: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    // Store identification and API access
    store_name: text("store_name").notNull(),
    store_url: text("store_url"), // WooCommerce store URL
    api_key: text("api_key").notNull().unique(), // API key for external chatbot authentication

    // Store configuration
    brand_voice: text("brand_voice"), // JSON string with brand voice configuration
    store_description: text("store_description"), // Store description for AI context
    default_language: text("default_language").default("en").notNull(),

    // WooCommerce integration
    wc_consumer_key: text("wc_consumer_key"), // WooCommerce API consumer key
    wc_consumer_secret: text("wc_consumer_secret"), // WooCommerce API consumer secret
    wc_api_url: text("wc_api_url"), // WooCommerce REST API base URL

    // Chatbot configuration
    chatbot_enabled: boolean("chatbot_enabled").default(true).notNull(),
    max_session_length: text("max_session_length").default("30m").notNull(), // 30 minutes default

    // Status and metadata
    status: text("status").default("active").notNull(), // 'active', 'inactive', 'suspended'
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    // Indexes for efficient queries
    index("idx_vendor_stores_user_id").on(t.user_id),
    index("idx_vendor_stores_api_key").on(t.api_key),
    index("idx_vendor_stores_status").on(t.status),
    index("idx_vendor_stores_chatbot_enabled").on(t.chatbot_enabled),
  ]
);

// Zod validation schemas
export const insertVendorStoreSchema = createInsertSchema(vendorStores);
export const selectVendorStoreSchema = createSelectSchema(vendorStores);

// Update schema - useful for PATCH requests
export const updateVendorStoreSchema = insertVendorStoreSchema.partial();

// TypeScript types
export type VendorStore = InferSelectModel<typeof vendorStores>;
export type InsertVendorStore = typeof vendorStores.$inferInsert;
export type UpdateVendorStore = Partial<VendorStore>;

// Store status constants
export const STORE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

export type StoreStatus = typeof STORE_STATUS[keyof typeof STORE_STATUS];

// Brand voice configuration type (stored as JSON string)
export type BrandVoiceConfig = {
  tone?: "professional" | "friendly" | "casual" | "formal";
  personality?: string[];
  guidelines?: string[];
  doNotMention?: string[];
  preferredPhrases?: string[];
  customInstructions?: string;
};

// API key generation helper
export function generateApiKey(): string {
  const prefix = "wv_"; // WooVector prefix
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 12);
  return `${prefix}${timestamp}_${random}`;
}

// Validate API key format
export function isValidApiKeyFormat(apiKey: string): boolean {
  return /^wv_[a-z0-9]+_[a-z0-9]{10}$/.test(apiKey);
}

