const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const { signToken } = require('../auth');

const router = express.Router();

function setAuthCookie(res, token) {
  res.cookie('gyongs_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // school project on http://localhost
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// POST /api/auth/register  { name, email, password, confirmPassword }
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body || {};
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Name, email, password and confirm password are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
    if (String(password).length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters.' });
    }
    const cleanEmail = String(email).trim().toLowerCase();

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'That email is already registered. Please log in.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [String(name).trim(), cleanEmail, password_hash]
    );
    const user = result.rows[0];
    const token = signToken(user);
    setAuthCookie(res, token);
    return res.status(201).json({ message: 'Registered.', token, user });
  } catch (err) {
    console.error('register error:', err);
    return res.status(500).json({ error: 'Database error during registration.' });
  }
});

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const cleanEmail = String(email).trim().toLowerCase();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    setAuthCookie(res, token);
    return res.json({
      message: 'Logged in.',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('login error:', err.message);
    return res.status(500).json({ error: 'Database error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('gyongs_token');
  return res.json({ message: 'Logged out.' });
});

// GET /api/auth/me
router.get('/me', require('../auth').requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: 'Database error.' });
  }
});

module.exports = router;
