require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 2027;
const ROOT = __dirname;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Public pages FIRST (before static) so /login and /login.html always serve the working page,
// never the old truncated stub.
app.get('/', (req, res) => res.sendFile(path.join(ROOT, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(ROOT, 'public', 'auth.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(ROOT, 'public', 'auth.html')));

// Serve ONLY image files from project root (your photos).
// Blocked: .env, .js source, .sql, etc. are never served.
const IMAGE_EXTS = new Set(['.jpeg', '.jpg', '.png', '.webp', '.avif', '.gif']);
const IMAGE_ALIASES = {
  'GYONGS TROUSERS (1).jpeg': 'gyongs_trousers_01.png',
  'GYONGS TROUSERS (2).jpeg': 'gyongs_trousers_02.png',
  'GYONGS TROUSERS (1).webp': 'gyongs_trousers_03.png',
  'GYONGS SHOES (2).webp': 'gyongs_shoes_02.png',
  'GYONGS SHOES (3).webp': 'gyongs_shoes_03.png',
  'GYONGS SHOES (5).webp': 'gyongs_shoes_05.png',
  'GYONGS ACCESSORIES (3).jpeg': 'gyongs_acc_03.png',
  'GYONGS ACCESSORIES (11).jpeg': 'gyongs_acc_04.png',
  'GYONGS ACCESSORIES (1).jpeg': 'gyongs_acc_01.png',
  'GYONGS ACCESSORIES (8).jpeg': 'gyongs_watch_01.png',
  'GYONGS (4).jpeg': 'gyongs_active_04.png',
  'GYONGS (7).jpeg': 'gyongs_active_02.png',
  'GYONGS (8).jpeg': 'gyongs_active_03.png',
  'GYONGS.jpeg': 'gyongs_active_01.png'
};
app.use('/assets', (req, res, next) => {
  if (!IMAGE_EXTS.has(path.extname(req.path).toLowerCase())) {
    return res.status(404).send('Not found');
  }
  const alias = IMAGE_ALIASES[decodeURIComponent(req.path.slice(1))];
  if (alias) req.url = '/' + alias;
  next();
}, express.static(ROOT));
app.use(express.static(path.join(ROOT, 'public'), { index: 'index.html' }));
// Keep old files working:
app.use('/templates', express.static(path.join(ROOT, 'templates')));
app.use('/login.css', (req, res) => res.sendFile(path.join(ROOT, 'login.css')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Health check (tests DB connection)
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'error: ' + e.message });
  }
});

app.listen(PORT, () => {
  console.log(`GYONGS server running: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
