const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/products?category=shoes&q=sneaker
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query;
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
    return res.json({ products: result.rows });
  } catch (err) {
    console.error('products list error:', err);
    return res.status(500).json({ error: 'Could not load products.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid product id.' });
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found.' });
    return res.json({ product: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: 'Could not load product.' });
  }
});

module.exports = router;
