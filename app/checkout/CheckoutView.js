'use client';
import { useEffect, useState } from 'react';
import { GY } from '@/lib/client';

// Same review + confirm behavior as legacy checkout.html.
export default function CheckoutView() {
  const [cart, setCart] = useState(null);
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const t = GY.token();
        if (!t) { window.location.href = '/login?next=' + encodeURIComponent('/checkout'); return; }
        await GY.api('/api/auth/me');
        const c = await GY.api('/api/cart');
        setCart(c);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const go = async () => {
    try {
      const o = await GY.api('/api/orders', { method: 'POST' });
      setDone(o.order);
    } catch (e) {
      setError(e.message);
    }
  };

  if (error && !cart && !done) return <div className="panel" style={{ marginTop: 16 }}><div className="error">{error}</div></div>;
  if (done) {
    return (
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="notice">
          <h2>Order #{done.id} confirmed!</h2>
          <p>Total {GY.rand(done.total)} • Status: {done.status}</p>
          <a className="btn" href="/orders">View My Orders</a> <a className="btn ghost" href="/shop">Keep shopping</a>
        </div>
      </div>
    );
  }
  if (!cart) return <div className="panel" style={{ marginTop: 16 }}>Loading…</div>;
  if (!cart.items.length) {
    return <div className="panel" style={{ marginTop: 16 }}><p>Your cart is empty.</p><a className="btn" href="/shop">Continue shopping</a></div>;
  }
  return (
    <div className="panel" style={{ marginTop: 16 }}>
      {cart.items.map((i) => <p key={i.id}>{i.quantity} × {i.product.name} — {GY.rand(i.line_total)}</p>)}
      <h2>Total: {GY.rand(cart.total)}</h2>
      <button className="btn" onClick={go}>Confirm order</button>
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}
