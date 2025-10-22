import { UpstashStore } from '@mastra/upstash';
import { LibSQLStore } from '@mastra/libsql';

import dotenv from 'dotenv';

// Load environment variables first
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();

}

export const storage = process.env.NODE_ENV !== 'production' ? new LibSQLStore({
  url: 'file:./memory.db'
}) : new UpstashStore({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
});
