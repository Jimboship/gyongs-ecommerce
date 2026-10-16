import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/health — same as legacy server.js health check
export async function GET() {
  try {
    await pool.query('SELECT 1');
    return NextResponse.json({ ok: true, db: 'connected' });
  } catch (e) {
    return NextResponse.json({ ok: false, db: 'error: ' + e.message }, { status: 500 });
  }
}
