import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireUser } from '@/lib/auth';

// GET /api/orders/:id — same as legacy (only my order + items)
export async function GET(req, { params }) {
  const auth = requireUser(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const id = Number(params.id);
    const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [id, auth.user.id]);
    if (orderRes.rows.length === 0) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    const itemsRes = await pool.query(
      `SELECT oi.quantity, oi.price, p.name, p.image
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [id]
    );
    return NextResponse.json({ order: orderRes.rows[0], items: itemsRes.rows });
  } catch {
    return NextResponse.json({ error: 'Could not load order.' }, { status: 500 });
  }
}
