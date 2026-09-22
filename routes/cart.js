const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth);

async function getOrCreateCart(userId) {
  let cart = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
  if (cart.rows.length === 0) {
    cart = await pool.query('INSERT INTO cart (user_id) VALUES ($1) RETURNING *', [userId]);
  }
  return cart.rows[0];
}

async function cartDetails(cartId) {
  const result = await pool.query(
    `SELECT ci.id, ci.quantity, p.id AS product_id, p.name, p.price, p.image, p.category
     FROM cart_items ci JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1 ORDER BY ci.id ASC`,
    [cartId]
  );
  const items = result.rows.map((r) => ({
    id: r.id,
    quantity: r.quantity,
    product: { id: r.product_id, name: r.name, price: Number(r.price), image: r.image, category: r.category },
    line_total: Number(r.price) * r.quantity,
  }));
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);
  return { items, subtotal, total: subtotal };
}

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    return res.json({ cart_id: cart.id, ...(await cartDetails(cart.id)) });
  } catch (err) {
    return res.status(500).json({ error: 'Could not load cart.' });
  }
});

// POST /api/cart/items { product_id, quantity }
router.post('/items', async (req, res) => {
  try {
    const product_id = Number(req.body.product_id);
    const quantity = Number(req.body.quantity || 1);
    if (!Number.isInteger(product_id)) return res.status(400).json({ error: 'Invalid product id.' });
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: 'Quantity must be 1 or more.' });

    const prod = await pool.query('SELECT id FROM products WHERE id = $1', [product_id]);
    if (prod.rows.length === 0) return res.status(404).json({ error: 'Product not found.' });

    const cart = await getOrCreateCart(req.user.id);
    await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [cart.id, product_id, quantity]
    );
    await pool.query('UPDATE cart SET updated_at = NOW() WHERE id = $1', [cart.id]);
    return res.status(201).json({ message: 'Added to cart.', ...(await cartDetails(cart.id)) });
  } catch (err) {
    return res.status(500).json({ error: 'Could not add to cart.' });
  }
});

// PUT /api/cart/items/:id { quantity }
router.put('/items/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: 'Quantity must be 1 or more.' });
    const cart = await getOrCreateCart(req.user.id);
    const check = await pool.query('SELECT id FROM cart_items WHERE id = $1 AND cart_id = $2', [id, cart.id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Cart item not found.' });
    await pool.query('UPDATE cart_items SET quantity = $1 WHERE id = $2', [quantity, id]);
    return res.json({ message: 'Quantity updated.', ...(await cartDetails(cart.id)) });
  } catch (err) {
    return res.status(500).json({ error: 'Could not update cart.' });
  }
});

// DELETE /api/cart/items/:id
router.delete('/items/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cart = await getOrCreateCart(req.user.id);
    await pool.query('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [id, cart.id]);
    return res.json({ message: 'Removed.', ...(await cartDetails(cart.id)) });
  } catch (err) {
    return res.status(500).json({ error: 'Could not remove item.' });
  }
});

module.exports = router;
