// Shared PostgreSQL pool for Next.js Route Handlers / Server Components.
// Uses the SAME .env values + database as the Express app. No ORM.
import { Pool } from 'pg';

const globalForPg = globalThis;

if (!globalForPg.__gyongsPool) {
  globalForPg.__gyongsPool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 2026),
    database: process.env.PGDATABASE || 'gyongs_db',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
  });
}

const pool = globalForPg.__gyongsPool;
export default pool;
