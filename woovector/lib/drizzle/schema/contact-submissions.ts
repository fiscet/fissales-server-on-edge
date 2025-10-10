import { pgTable, text, uuid, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { users } from "./users";

// Minimal GDPR-friendly contact submissions table
export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    fullName: text("full_name"),
    // Store only minimal personal data: email optional (nullable) so anonymous submissions are possible
    email: text("email"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    // Explicit consent flag (false by default) - useful for GDPR auditing
    consent: boolean("consent").notNull().default(false),
    status: text("status").notNull().default("pending"),
    referenceNumber: text("reference_number").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_contact_submissions_email").on(table.email),
    index("idx_contact_submissions_created_at").on(table.createdAt),
  ]
);

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;


