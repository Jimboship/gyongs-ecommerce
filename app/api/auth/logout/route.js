import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

// POST /api/auth/logout — same as legacy
export async function POST() {
  const res = NextResponse.json({ message: 'Logged out.' });
  res.headers.set('Set-Cookie', clearAuthCookie());
  return res;
}
