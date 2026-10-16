import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { getOrCreateCart, cartDetails } from '@/lib/cart';

// GET /api/cart — same as legacy routes/cart.js
export async function GET(req) {
  const auth = requireUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const cart = await getOrCreateCart(auth.user.id);
    return NextResponse.json({ cart_id: cart.id, ...(await cartDetails(cart.id)) });
  } catch {
    return NextResponse.json({ error: 'Could not load cart.' }, { status: 500 });
  }
}
