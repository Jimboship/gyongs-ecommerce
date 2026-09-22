require('dotenv').config();
const { Pool } = require('pg');

// Simple PostgreSQL connection pool.
// Credentials come from .env (never commit .env).
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'gyongs_db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
});

pool.on('error', (err) => {
  console.error('Postgres pool error:', err.message);
});

module.exports = pool;
