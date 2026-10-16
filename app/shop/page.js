import ShopHeader from '@/components/ShopHeader';
import ShopGrid from './ShopGrid';
import pool from '@/lib/db';
import { getUserFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Legacy shop.html: protected, greeting, category bar, View + Add to Cart.
export default async function ShopPage({ searchParams }) {
  const user =  await  getUserFromCookies();
  if (!user) redirect('/login?next=/shop');
  const me = await pool.query('SELECT id, name FROM users WHERE id = $1',
     [user.id]).then(r => r.rows[0]).catch(() => null);
  const params=await searchParams
  const category = params?.category || '';
  return (
    <>
      <ShopHeader />
      <div className="wrap">
        <section className="hero">
          <h1>Hi {me?.name || user.name} — shop <em>GYONGS</em></h1>
          <p>Protected shopping area — you are logged in. Pick a range, view a product, add to cart.</p>
          <div className="catbar">
            <a className={!category ? 'active' : ''} href="/shop">All</a>
            <a className={category === 'trousers' ? 'active' : ''} href="/shop?category=trousers">Trousers</a>
            <a className={category === 'shoes' ? 'active' : ''} href="/shop?category=shoes">Shoes</a>
            <a className={category === 'accessories' ? 'active' : ''} href="/shop?category=accessories">Accessories</a>
            <a className={category === 'women' ? 'active' : ''} href="/shop?category=women">Women</a>
          </div>
        </section>
        <ShopGrid category={category} />
      </div>
      <footer>© 2026 GYONGS • Prices in Rand (R)</footer>
    </>
  );
}
