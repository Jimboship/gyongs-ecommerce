const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../auth');

const router = express.Router();
router.use(requireAuth);

// POST /api/orders  (checkout: cart -> orders + order_items, then clear cart)
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cartRes = await client.query('SELECT id FROM cart WHERE user_id = $1', [req.user.id]);
    if (cartRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Your cart is empty.' });
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
      return res.status(400).json({ error: 'Your cart is empty.' });
    }
    const total = itemsRes.rows.reduce((s, r) => s + Number(r.price) * r.quantity, 0);
    const orderRes = await client.query(
      "INSERT INTO orders (user_id, total, status) VALUES ($1, $2, 'pending') RETURNING *",
      [req.user.id, total]
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
    return res.status(201).json({ message: 'Order placed.', order });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('checkout error:', err.message);
    return res.status(500).json({ error: 'Could not place order.' });
  } finally {
    client.release();
  }
});

// GET /api/orders  (only my orders)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC', [req.user.id]);
    return res.json({ orders: result.rows });
  } catch (err) {
    return res.status(500).json({ error: 'Could not load orders.' });
  }
});

// GET /api/orders/:id  (only my single order + items)
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (orderRes.rows.length === 0) return res.status(404).json({ error: 'Order not found.' });
    const itemsRes = await pool.query(
      `SELECT oi.quantity, oi.price, p.name, p.image
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [id]
    );
    return res.json({ order: orderRes.rows[0], items: itemsRes.rows });
  } catch (err) {
    return res.status(500).json({ error: 'Could not load order.' });
  }
});

module.exports = router;
