import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { signToken, authCookie } from '@/lib/auth';

// POST /api/auth/register  { name, email, password, confirmPassword }
// Same validation + messages as legacy routes/auth.js
export async function POST(req) {
  try {
    const { name, email, password, confirmPassword } = (await req.json().catch(() => ({}))) || {};
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Name, email, password and confirm password are required.' }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }
    if (String(password).length < 3) {
      return NextResponse.json({ error: 'Password must be at least 3 characters.' }, { status: 400 });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: 'That email is already registered. Please log in.' }, { status: 409 });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [String(name).trim(), cleanEmail, password_hash]
    );
    const user = result.rows[0];
    const token = signToken(user);
    const res = NextResponse.json({ message: 'Registered.', token, user }, { status: 201 });
    res.headers.set('Set-Cookie', authCookie(token));
    return res;
  } catch (err) {
    console.error('register error:', err);
    return NextResponse.json({ error: 'Database error during registration.' }, { status: 500 });
  }
}
