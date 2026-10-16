'use client';
import { useState } from 'react';
import { GY } from '@/lib/client';

// Same layout/copy as legacy product.html.
export default function ProductView({ p }) {
  const [m, setM] = useState('');
  const images = Array.isArray(p.images) && p.images.length ? p.images : [p.image || 'GYONGS.jpeg'];
  const add = async () => {
    try {
      const q = Number(document.getElementById('q').value || 1);
      await GY.api('/api/cart/items', { method: 'POST', body: JSON.stringify({ product_id: p.id, quantity: q }) });
      setM('added');
    } catch (e) {
      setM('error:' + e.message);
    }
  };
  return (
    <div className="panel">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="pgrid">
        <div>
          <img src={GY.img(images[0])} alt={p.name} style={{ width: '100%', borderRadius: 14, aspectRatio: '1/1', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = GY.img('GYONGS.jpeg'); }} />
          {images.length > 1 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10, marginTop: 12 }}>
              {images.map((image, index) => (
                <img key={`${p.id}-${image}-${index}`} src={GY.img(image)} alt={`${p.name} ${index + 1}`} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 10 }} onError={(e) => { e.currentTarget.src = GY.img('GYONGS.jpeg'); }} />
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <span className="pill">{p.category}</span>
          <h1>{p.name}</h1>
          <div className="price" style={{ fontSize: '1.8rem' }}>{GY.rand(p.price)}</div>
          <p style={{ lineHeight: 1.7, color: '#ddd' }}>{p.description || ''}</p>
          <label>Quantity</label>
          <input id="q" type="number" min="1" defaultValue={1} style={{ maxWidth: 120 }} />
          <br /><br />
          <button className="btn" onClick={add}>Add to Cart</button>{' '}
          <a className="btn ghost" href="/shop">Continue shopping</a>
          {m === 'added' ? <div className="notice">Added! <a href="/cart" style={{ color: '#ffd633' }}>View cart</a></div> : null}
          {m.startsWith('error:') ? <div className="error">{m.slice(6)}</div> : null}
        </div>
      </div>
      <style>{'@media(max-width:700px){.pgrid{grid-template-columns:1fr !important}}'}</style>
    </div>
  );
}
