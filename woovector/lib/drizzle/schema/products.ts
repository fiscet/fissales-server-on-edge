import { pgTable, text, timestamp, decimal, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";

// Products table - for WooCommerce products sync
export const products = pgTable("products", {
  id: text("id").primaryKey(), // WooCommerce product ID
  name: text("name").notNull(),
  description: text("description"),
  descriptionExtra: text("description_extra"), // Extra description field (empty initially)
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  imageUrl: text("image_url"),
  productUrl: text("product_url"),
  categories: jsonb("categories").$type<Array<{ id: number; name: string; slug: string; }>>().default([]), // WooCommerce categories

  // Metadata
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Zod validation schemas
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

// TypeScript types
export type Product = InferSelectModel<typeof products>;

