import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { getOrCreateCart, cartDetails } from '@/lib/cart';

// POST /api/cart/items { product_id, quantity } — same as legacy
export async function POST(req) {
  const auth = requireUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const body = (await req.json().catch(() => ({}))) || {};
    const product_id = Number(body.product_id);
    const quantity = Number(body.quantity || 1);
    if (!Number.isInteger(product_id)) return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });
    if (!Number.isInteger(quantity) || quantity < 1) return NextResponse.json({ error: 'Quantity must be 1 or more.' }, { status: 400 });

    const prod = await pool.query('SELECT id FROM products WHERE id = $1', [product_id]);
    if (prod.rows.length === 0) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

    const cart = await getOrCreateCart(auth.user.id);
    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [cart.id, product_id, quantity]
    );
    await pool.query('UPDATE cart SET updated_at = NOW() WHERE id = $1', [cart.id]);
    return NextResponse.json({ message: 'Added to cart.', ...(await cartDetails(cart.id)) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not add to cart.' }, { status: 500 });
  }
}
