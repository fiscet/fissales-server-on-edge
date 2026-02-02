import { UpstashStore } from '@mastra/upstash';
// import { LibSQLStore } from '@mastra/libsql'; // Removed - causes bundling issues with Turbopack

import dotenv from 'dotenv';

// Load environment variables first
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Use Upstash for both dev and production to avoid @libsql/client bundling issues
export const storage = new UpstashStore({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
});
