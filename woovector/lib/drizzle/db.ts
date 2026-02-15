import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
// No SSL for local PostgreSQL development
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
});
export const db = drizzle(client);
