import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireUser } from '@/lib/auth';

// POST /api/orders (demo checkout, no payment) + GET /api/orders — same as legacy routes/orders.js
export async function POST(req) {
  const auth = requireUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cartRes = await client.query('SELECT id FROM cart WHERE user_id = $1', [auth.user.id]);
    if (cartRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }
    const cartId = cartRes.rows[0].id;
    const itemsRes = await client.query(
      `SELECT ci.product_id, ci.quantity, p.price
       FROM cart_items ci JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = $1`,
      [cartId]
    );
    if (itemsRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }
    const total = itemsRes.rows.reduce((s, r) => s + Number(r.price) * r.quantity, 0);
    const orderRes = await client.query(
      "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, 'pending') RETURNING *",
      [auth.user.id, total]
    );
    const order = orderRes.rows[0];
    for (const r of itemsRes.rows) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, r.product_id, r.quantity, r.price]
      );
    }
    await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    await client.query('COMMIT');
    return NextResponse.json({ message: 'Order placed.', order }, { status: 201 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('checkout error:', err.message);
    return NextResponse.json({ error: 'Could not place order.' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET(req) {
  const auth = requireUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC', [auth.user.id]);
    return NextResponse.json({ orders: result.rows });
  } catch {
    return NextResponse.json({ error: 'Could not load orders.' }, { status: 500 });
  }
}
