import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { signToken, authCookie } from '@/lib/auth';

// POST /api/auth/login  { email, password } — same as legacy routes/auth.js
export async function POST(req) {
  try {
    const { email, password } = (await req.json().catch(() => ({}))) || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    const token = signToken({ id: user.id, email: user.email, name: user.name });
    const res = NextResponse.json({
      message: 'Logged in.',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
    res.headers.set('Set-Cookie', authCookie(token));
    return res;
  } catch (err) {
    console.error('login error:', err.message);
    return NextResponse.json({ error: 'Database error during login.' }, { status: 500 });
  }
}
