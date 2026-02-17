import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create PostgreSQL connection for query purposes
const client = postgres(DATABASE_URL, {
  prepare: false,
});

// Create Drizzle ORM instance
export const db = drizzle(client, { schema });
