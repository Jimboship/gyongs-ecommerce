'use client';
import { useEffect, useState } from 'react';
import { GY } from '@/lib/client';

// Same table/markup/math as legacy cart.html.
export default function CartView() {
  const [box, setBox] = useState('Loading cart…');
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const t = GY.token();
      if (!t) { window.location.href = '/login?next=' + encodeURIComponent('/cart'); return; }
      await GY.api('/api/auth/me');
      const c = await GY.api('/api/cart');
      setCart(c);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const ch = async (id, q) => {
    if (q < 1) return rm(id);
    await GY.api('/api/cart/items/' + id, { method: 'PUT', body: JSON.stringify({ quantity: q }) });
    load();
  };
  const rm = async (id) => {
    await GY.api('/api/cart/items/' + id, { method: 'DELETE' });
    load();
  };

  if (error) return <div className="panel" style={{ marginTop: 16 }}><div className="error">{error}</div></div>;
  if (!cart) return <div className="panel" style={{ marginTop: 16 }}>{box}</div>;
  if (!cart.items.length) {
    return <div className="panel" style={{ marginTop: 16 }}><p>Your cart is empty.</p><a className="btn" href="/shop">Continue shopping</a></div>;
  }
  return (
    <div className="panel" style={{ marginTop: 16 }}>
      <table>
        <tbody>
          <tr><th></th><th>Item</th><th>Price</th><th>Qty</th><th>Line total</th><th></th></tr>
          {cart.items.map((i) => (
            <tr key={i.id}>
              <td><img className="cart-img" src={GY.img(i.product.image)} onError={(e) => { e.currentTarget.src = GY.img('GYONGS.jpeg'); }} /></td>
              <td>{i.product.name}<br /><span className="notice-small">{i.product.category}</span></td>
              <td>{GY.rand(i.product.price)}</td>
              <td><span className="qty"><button onClick={() => ch(i.id, i.quantity - 1)}>−</button>{i.quantity}<button onClick={() => ch(i.id, i.quantity + 1)}>+</button></span></td>
              <td>{GY.rand(i.line_total)}</td>
              <td><button className="btn ghost" onClick={() => rm(i.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Subtotal: {GY.rand(cart.subtotal)}</h2>
      <h2>Total: {GY.rand(cart.total)}</h2>
      <a className="btn ghost" href="/shop">Continue shopping</a> <a className="btn" href="/checkout">Proceed to checkout</a>
    </div>
  );
}
