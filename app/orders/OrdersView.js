'use client';
import { useEffect, useState } from 'react';
import { GY } from '@/lib/client';

// Same list + View-details behavior as legacy orders.html.
export default function OrdersView() {
  const [orders, setOrders] = useState(null);
  const [det, setDet] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const t = GY.token();
        if (!t) { window.location.href = '/login?next=' + encodeURIComponent('/orders'); return; }
        await GY.api('/api/auth/me');
        const d = await GY.api('/api/orders');
        setOrders(d.orders);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const view = async (id) => {
    const d = await GY.api('/api/orders/' + id);
    setDet(d);
  };

  if (error) return <div className="panel" style={{ marginTop: 16 }}>
    <div className="error">{error}
    </div>
    </div>;
  if (!orders) return <div className="panel" style={{ marginTop: 16 }}>Loading…</div>;
  if (!orders.length) {
    return <div className="panel" style={{ marginTop: 16 }}><p>No orders yet.</p><a className="btn" href="/shop">Start shopping</a></div>;
  }
  return (
    <div className="panel" style={{ marginTop: 16 }}>
      <table>
        <tbody>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
            </tr>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{new Date(o.created_at).toLocaleString()}</td>
              <td>{GY.rand(o.total)}</td>
              <td>{o.status}</td>
              <td><button className="btn ghost" onClick={() => view(o.id)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {det ? (
        <div>
          <h3>Order #{det.order.id}</h3>
          {det.items.map((i, idx) => <p key={idx}>{i.quantity} × {i.name} @ {GY.rand(i.price)}</p>)}
        </div>
      ) : null}
    </div>
  );
}
