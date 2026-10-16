import pool from '@/lib/db';

export async function getOrCreateCart(userId) {
  let cart = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
  if (cart.rows.length === 0) {
    cart = await pool.query('INSERT INTO cart (user_id) VALUES ($1) RETURNING *', [userId]);
  }
  return cart.rows[0];
}

import { normalizeProduct } from '@/lib/products';

export async function cartDetails(cartId) {
  const result = await pool.query(
    `SELECT ci.id, ci.quantity,
     p.id AS product_id,
     p.name, p.price, p.image, p.category
     FROM cart_items ci JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1 ORDER BY ci.id ASC`,
    [cartId]
  );
  const items = result.rows.map((r) => {
    const product = normalizeProduct({
      id: r.product_id,
      name: r.name,
      price: Number(r.price),
      image: r.image,
      category: r.category,
    });

    return {
      id: r.id,
      quantity: r.quantity,
      product: {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        images: product.images,
        category: product.category,
      },
      line_total: Number(r.price) * r.quantity,
    };
  });
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  return { items, subtotal, total: subtotal };
}
