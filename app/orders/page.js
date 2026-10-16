import ShopHeader from '@/components/ShopHeader';
import OrdersView from './OrdersView';
import { getUserFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Legacy orders.html: only my orders + view details.
export default async function OrdersPage() {
  const user = getUserFromCookies();
  if (!user) redirect('/login?next=/orders');
  return (
    <>
      <ShopHeader />
      <div className="wrap">
        <section className="hero">
          <h1>My <em>Orders</em></h1>
          <p>Only your own orders are shown.</p>
        </section>
        <OrdersView />
      </div>
      <footer>© 2026 GYONGS</footer>
    </>
  );
}
