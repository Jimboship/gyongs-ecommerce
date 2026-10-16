import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { normalizeProduct } from '@/lib/products';

// GET /api/products/:id — same as legacy
export async function GET(req, { params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    return NextResponse.json({ product: normalizeProduct(result.rows[0]) });
  } catch {
    return NextResponse.json({ error: 'Could not load product.' }, { status: 500 });
  }
}
