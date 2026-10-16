import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireUser } from '@/lib/auth';

// GET /api/auth/me — same as legacy
export async function GET(req) {
  const auth = requireUser(req);
  if (auth.error) 
    return NextResponse.json({ error: auth.error },
     { status: auth.status });
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', 
      [auth.user.id]);
    if (result.rows.length === 0)
       return NextResponse.json({ error: 'User not found.' }, 
      { status: 404 });
    return NextResponse.json({ user: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'Database error.' }, { status: 500 });
  }
}
