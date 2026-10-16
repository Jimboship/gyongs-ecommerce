import ShopHeader from '@/components/ShopHeader';
import CartView from './CartView';
import { getUserFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Legacy cart.html: protected table with qty +/- , remove, subtotal/total.
export default async function CartPage() {
  const user = getUserFromCookies();
  if (!user) redirect('/login?next=/cart');
  return (
    <>
      <ShopHeader />
      <div className="wrap">
        <section className="hero"><h1>Your <em>Cart</em></h1><p>Saved in PostgreSQL for your account only.</p></section>
        <CartView />
      </div>
      <footer>© 2026 GYONGS</footer>
    </>
  );
}
