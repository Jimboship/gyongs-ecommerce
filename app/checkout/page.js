import ShopHeader from '@/components/ShopHeader';
import CheckoutView from './CheckoutView';
import { getUserFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Legacy checkout.html: demo checkout, no real payment.
export default async function CheckoutPage() {
  const user = getUserFromCookies();
  if (!user) redirect('/login?next=/checkout');
  return (
    <>
      <ShopHeader />
      <div className="wrap">
        <section className="hero"><h1>Check<em>out</em></h1><p>Review your cart, confirm, and we save the order in PostgreSQL. No real payment — demo checkout.</p></section>
        <CheckoutView />
      </div>
      <footer>© 2026 GYONGS</footer>
    </>
  );
}
