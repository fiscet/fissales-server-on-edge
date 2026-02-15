#!/usr/bin/env tsx

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { users } from "../lib/drizzle/schema/users";
import { hashPassword } from "../lib/auth/password";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Default admin user configuration
const ADMIN_USER = {
  email: "fiscet@gmail.com",
  password: "admin123",
  full_name: "Admin User",
};

async function main(): Promise<void> {
  console.log("🚀 Seeding admin user...");

  // Create PostgreSQL connection
  const client = postgres(DATABASE_URL!, {
    prepare: false,
    // No SSL for local PostgreSQL
  });
  const db = drizzle(client);

  try {
    // Check if admin user already exists
    console.log("🔍 Checking existing admin user...");
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, ADMIN_USER.email));

    if (existingAdmin.length > 0) {
      console.log(`⚠️  Admin user with email "${ADMIN_USER.email}" already exists.`);

      // Update role to admin if not already
      if (existingAdmin[0].role !== "admin") {
        console.log("📝 Updating user role to admin...");
        await db
          .update(users)
          .set({ role: "admin" })
          .where(eq(users.email, ADMIN_USER.email));
        console.log("✅ User role updated to admin!");
      } else {
        console.log("💡 User is already an admin.");
      }
      return;
    }

    // Hash the password
    console.log("🔐 Hashing password...");
    const passwordHash = await hashPassword(ADMIN_USER.password);

    // Insert admin user
    console.log(`📝 Creating admin user: ${ADMIN_USER.email}`);

    const insertedUser = await db
      .insert(users)
      .values({
        email: ADMIN_USER.email,
        password_hash: passwordHash,
        full_name: ADMIN_USER.full_name,
        role: "admin",
        email_verified: true, // Pre-verify admin email
      })
      .returning();

    console.log(`✅ Successfully created admin user!`);
    console.log("");
    console.log("📋 Admin User Details:");
    console.log(`   Email: ${insertedUser[0].email}`);
    console.log(`   Name: ${insertedUser[0].full_name}`);
    console.log(`   Role: ${insertedUser[0].role}`);
    console.log(`   ID: ${insertedUser[0].id}`);
    console.log("");
    console.log("🔐 Login Credentials:");
    console.log(`   Email: ${ADMIN_USER.email}`);
    console.log(`   Password: ${ADMIN_USER.password}`);
    console.log("");
    console.log("⚠️  IMPORTANT: Change the default password after first login!");

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
