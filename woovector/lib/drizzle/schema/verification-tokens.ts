import { pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "./users";

// Verification tokens for email verification and password reset
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    type: text("type", {
      enum: ["email_verification", "password_reset"],
    }).notNull(),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("idx_verification_tokens_token").on(t.token),
    index("idx_verification_tokens_user_id").on(t.user_id),
  ]
);

// Zod validation schemas
export const insertVerificationTokenSchema =
  createInsertSchema(verificationTokens);
export const selectVerificationTokenSchema =
  createSelectSchema(verificationTokens);

// TypeScript types
export type VerificationToken = InferSelectModel<typeof verificationTokens>;
export type VerificationTokenType = "email_verification" | "password_reset";
