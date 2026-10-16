'use client';
import Link from 'next/link';
import { GY } from '@/lib/client';

// Same card markup/styling as legacy index/shop/services pages.
// `actionHref` = where the button goes ("Log in to shop" for public, "View" for shop).
export default function ProductCard({ p, actionHref, actionLabel, showAdd, onAdd }) {
  const productImages = Array.isArray(p.images) && p.images.length ? p.images : [p.image || 'GYONGS.jpeg'];
  const img = GY.img(productImages[0]);
  return (
    <article className="card">
      <img src={img} alt={p.name} loading="lazy" onError={(e) => { e.currentTarget.src = GY.img('GYONGS.jpeg'); }} />
      <div className="pad">
        <span className="pill">{p.category}</span>
        <h3>{p.name}</h3>
        <div className="price">{GY.rand(p.price)}</div>
        <p>{p.description || ''}</p>
        <div className="row">
          {actionHref ? <Link className="btn ghost" href={actionHref}>{actionLabel || 'View'}</Link> : null}
          {showAdd ? <button className="btn" onClick={() => onAdd && onAdd(p.id)}>Add to Cart</button> : null}
          {!actionHref && !showAdd ? <Link className="btn" href="/login">Log in to shop</Link> : null}
        </div>
      </div>
    </article>
  );
}
