import { PostgresStore } from '@mastra/pg';

import dotenv from 'dotenv';

// Load environment variables first
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Use PostgreSQL for storage (same database as the main application)
export const storage = new PostgresStore({
  id: 'woovector-store',
  connectionString: process.env.DATABASE_URL!
});
