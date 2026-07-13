// de-pee/src/libs/db.ts
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for connection pooling inside edge runtimes/serverless environments
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing from your environment variables configuration.');
}

// Global variable configuration prevents Next.js hot-reloads from exhausting database connections during local development
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

export const db = globalForDb.pool ?? new Pool({ 
  connectionString,
  max: 10, // Maintain a modest connection threshold for serverless workflows
  idleTimeoutMillis: 30000,
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = db;
}