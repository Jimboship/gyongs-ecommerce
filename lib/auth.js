// Auth helpers ported 1:1 from legacy auth.js (Express).
// JWT lives in httpOnly cookie gyongs_token OR Authorization: Bearer <token>.
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    },
    SECRET,
    { 
    expiresIn: EXPIRES
     }
  );
}

export function getTokenFromRequest(req) {
  const cookieToken = req.cookies?.get?.('gyongs_token')?.value || null;
  const h = req.headers.get('authorization') || '';
  const bearer = h.startsWith('Bearer ') ? h.slice(7) : null;
  return cookieToken || bearer;
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

export function requireUser(req) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return { error: 'Please log in first.', status: 401 };
  }
  try {
    const user = verifyToken(token);
    return { user };
  } catch {
    return { error: 'Session expired. Please log in again.', status: 401 };
  }
}

// For Server Components that need the logged user (shop/product/cart/orders pages).
export async function getUserFromCookies() {
  try {
    const token = (await cookies()).get('gyongs_token')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getAdminUser() {
  const user = getUserFromCookies();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gyongs.local').trim().toLowerCase();
  if (!user || !user.email) return null;
  return String(user.email).trim().toLowerCase() === adminEmail ? user : null;
}

export function authCookie(token) {
  return `gyongs_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearAuthCookie() {
  return `gyongs_token=; HttpOnly; Path=/; Max-Age=0`;
}
