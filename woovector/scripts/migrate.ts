#!/usr/bin/env tsx

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import fs from "fs";
import path from "path";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

interface MigrationEntry {
  tag: string;
  when: number;
}

function checkDownMigrations(): { total: number; missing: string[]; } {
  const migrationsDir = path.join(process.cwd(), "drizzle", "migrations");
  const journalPath = path.join(migrationsDir, "meta", "_journal.json");

  if (!fs.existsSync(journalPath)) {
    return { total: 0, missing: [] };
  }

  const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));
  const entries: MigrationEntry[] = journal.entries || [];
  const missing: string[] = [];

  for (const entry of entries) {
    const downPath = path.join(migrationsDir, entry.tag, "down.sql");
    if (!fs.existsSync(downPath)) {
      missing.push(entry.tag);
    }
  }

  return { total: entries.length, missing };
}

async function main() {
  console.log("🚀 Running migrations...");

  // Check for missing down migrations
  const { total, missing } = checkDownMigrations();

  if (total > 0) {
    console.log(`🔍 Checking rollback safety: ${total} migration(s) found`);

    if (missing.length > 0) {
      console.log("⚠️  WARNING: Missing down migration files:");
      for (const migrationTag of missing) {
        console.log(`   ❌ ${migrationTag}/down.sql`);
      }
      console.log("");
      console.log("💡 Consider creating down migrations for rollback safety:");
      console.log("   Use: ai_docs/templates/drizzle_down_migration.md");
      console.log("");

      // Give user a chance to see the warning
      console.log("⏳ Proceeding in 5 seconds... (Ctrl+C to cancel)");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } else {
      console.log("✅ All migrations have rollback files");
    }
  }

  // Create PostgreSQL connection - no SSL for local PostgreSQL
  const client = postgres(DATABASE_URL!, {
    prepare: false,
    // No SSL for local PostgreSQL
  });
  const db = drizzle(client);

  try {
    console.log("📁 Migration folder: drizzle/migrations");

    await migrate(db, { migrationsFolder: "drizzle/migrations" });

    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
    throw error;
  } finally {
    // Close the connection
    await client.end();
    console.log("🔌 Database connection closed");
  }
}

main().catch((err) => {
  console.error("💥 Migration process failed:");
  console.error(err);
  process.exit(1);
});
