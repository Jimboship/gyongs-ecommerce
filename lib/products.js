// Shared product queries — same SQL as legacy routes/products.js, reused by
// both API routes and Server Components so behavior stays identical.
import pool from './db';

const categoryImagePool = {
  trousers: [
    'gyongs_trousers_01.png',
    'gyongs_trousers_02.png',
    'gyongs_trousers_03.png',
    'gyongs_trousers_04.png',
    'gyongs_trousers_05.png',
  ],
  shoes: [
    'gyongs_shoes_01.png',
    'gyongs_shoes_02.png',
    'gyongs_shoes_03.png',
    'gyongs_shoes_04.png',
    'gyongs_shoes_05.png',
  ],
  accessories: [
    'gyongs_acc_01.png',
    'gyongs_acc_02.png',
    'gyongs_acc_03.png',
    'gyongs_acc_04.png',
    'gyongs_acc_05.png',
    'gyongs_watch_01.png',
    'gyongs_watch_02.png',
    'gyongs_watch_03.png',
    'gyongs_watch_04.png',
    'gyongs_watch_04-1.png',
  ],
  women: [
    'gyongs_active_01.png',
    'gyongs_active_02.png',
    'gyongs_active_03.png',
    'gyongs_active_04.png',
    'gyongs_active_05.png',
  ],
};

export function getProductImages(product = {}) {
  const directImages = [];

  if (Array.isArray(product.images)) {
    for (const image of product.images) {
      if (typeof image === 'string' && image.trim()) directImages.push(image.trim());
    }
  }

  if (typeof product.image === 'string' && product.image.trim()) {
    directImages.push(product.image.trim());
  }

  const category = String(product.category || '').toLowerCase();
  const fallbackImages = categoryImagePool[category] || [];
  const images = Array.from(new Set([...fallbackImages, ...directImages]));

  return images.length ? images : ['GYONGS.jpeg'];
}

export function normalizeProduct(product = {}) {
  if (!product)return null;
  const images = getProductImages(product);
  const firstImage = images[0] || 'GYONGS.jpeg';

  return {
    ...product,
    image: firstImage,
    images,
  };
}

export async function listProducts({ category, q } = {}) {
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
  return result.rows.map(normalizeProduct);
}

export async function getProduct(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return normalizeProduct(result.rows[0] || null);
}
