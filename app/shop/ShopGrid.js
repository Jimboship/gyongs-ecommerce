'use client';
import { useEffect, useState } from 'react';
import { GY } from '@/lib/client';
import ProductCard from '@/components/ProductCard';

// Client grid so Add to Cart can use the stored token (same as legacy shop.html).
export default function ShopGrid({ category }) {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const t = GY.token();
        if (!t) { window.location.href = '/login?next=' + encodeURIComponent('/shop' + (category ? '?category=' + category : '')); return; }
        await GY.api('/api/auth/me');
        const d = await GY.api('/api/products' + (category ? '?category=' + category : ''));
        if (alive) setProducts(d.products);
      } catch (e) {
        if (alive) setError(e.message);
      }
    })();
    return () => { alive = false; };
  }, [category]);

  const addCart = async (id) => {
    try {
      await GY.api('/api/cart/items', { method: 'POST', body: JSON.stringify({ product_id: id, quantity: 1 }) });
      setMsg('added');
    } catch (e) {
      setError(e.message);
    }
  };

  if (error) return <div className="error">{error}</div>;
  return (
    <>
      {msg ? <div className="notice">Added to cart. <a href="/cart" style={{ color: '#ffd633' }}>View cart</a></div> : null}
      <div className="grid" style={{ marginTop: 16 }}>
        {products.map((p) => (
          <ProductCard key={p.id} p={{ ...p, description: p.description }} actionHref={`/product/${p.id}`} actionLabel="View" showAdd onAdd={addCart} />
        ))}
      </div>
    </>
  );
}
