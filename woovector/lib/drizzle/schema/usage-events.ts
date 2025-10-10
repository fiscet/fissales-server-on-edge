import {
  pgTable,
  timestamp,
  uuid,
  text,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";

// User usage events table - tracks individual user actions for time-window based limits
export const userUsageEvents = pgTable(
  "user_usage_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    eventType: text("event_type").notNull(), // 'conversation_started', 'product_imported', 'product_sync'
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Index for efficient time window queries
    index("idx_user_usage_events_user_id_type_time").on(
      table.userId,
      table.eventType,
      table.createdAt
    ),
    // Index for general time-based queries
    index("idx_user_usage_events_created_at").on(table.createdAt),
    // Index for user-specific queries
    index("idx_user_usage_events_user_id").on(table.userId),
  ]
);

// Zod validation schemas
export const insertUserUsageEventSchema = createInsertSchema(userUsageEvents);
export const selectUserUsageEventSchema = createSelectSchema(userUsageEvents);

// TypeScript types
export type UserUsageEvent = InferSelectModel<typeof userUsageEvents>;
export type InsertUserUsageEvent = typeof userUsageEvents.$inferInsert;

// Event type constants for WooCommerce AI SaaS
export const USAGE_EVENT_TYPES = {
  CONVERSATION_STARTED: "conversation_started", // AI chatbot conversation with customer
  PRODUCT_IMPORTED: "product_imported", // WooCommerce product import event
  PRODUCT_SYNC: "product_sync", // Product synchronization via webhook
} as const;

export type UsageEventType = typeof USAGE_EVENT_TYPES[keyof typeof USAGE_EVENT_TYPES];
