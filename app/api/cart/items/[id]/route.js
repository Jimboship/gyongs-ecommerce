import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { getOrCreateCart, cartDetails } from '@/lib/cart';

// PUT /api/cart/items/:id { quantity } — same as legacy
export async function PUT(req, { params }) {
  const auth = requireUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const id = Number(params.id);
    const body = (await req.json().catch(() => ({}))) || {};
    const quantity = Number(body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be 1 or more.' }, { status: 400 });
    }
    const cart = await getOrCreateCart(auth.user.id);
    const check = await pool.query('SELECT id FROM cart_items WHERE id = $1 AND cart_id = $2', [id, cart.id]);
    if (check.rows.length === 0) return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
    await pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [quantity, id]);
    return NextResponse.json({ message: 'Quantity updated.', ...(await cartDetails(cart.id)) });
  } catch {
    return NextResponse.json({ error: 'Could not update cart.' }, { status: 500 });
  }
}

// DELETE /api/cart/items/:id — same as legacy
export async function DELETE(req, { params }) {
  const auth = requireUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const id = Number(params.id);
    const cart = await getOrCreateCart(auth.user.id);
    await pool.query('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [id, cart.id]);
    return NextResponse.json({ message: 'Removed.', ...(await cartDetails(cart.id)) });
  } catch {
    return NextResponse.json({ error: 'Could not remove item.' }, { status: 500 });
  }
}
