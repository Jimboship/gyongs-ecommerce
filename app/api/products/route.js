import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { normalizeProduct } from '@/lib/products';

// GET /api/products?category=shoes&q=sneaker — same SQL/filtering as legacy routes/products.js
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const where = [];
    const params = [];
    if (category) {
      where.push(`category = $${params.length + 1}`);
      params.push(String(category).toLowerCase());
    }
    if (q) {
      where.push(`(name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`);
      params.push(`%${q}%`);
    }
    const sql = `SELECT * FROM products ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id ASC`;
    const result = await pool.query(sql, params);
    return NextResponse.json({ products: result.rows.map(normalizeProduct) });
  } catch (err) {
    console.error('products list error:', err);
    return NextResponse.json({ error: 'Could not load products.' }, { status: 500 });
  }
}
