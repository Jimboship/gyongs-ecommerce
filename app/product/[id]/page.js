import ShopHeader from '@/components/ShopHeader';
import ProductView from './ProductView';
import { getProduct } from '@/lib/products';
import { getUserFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Legacy product.html: protected details + quantity + Add to Cart.
export default async function ProductPage({ params }) {
  const user = getUserFromCookies();
  if (!user) redirect('/login?next=/product/' + params.id);
  const p = await getProduct(Number(params.id)).catch(() => null);
  return (
    <>
      <ShopHeader />
      <div className="wrap">
        {!p ? <div className="error">Product not found.</div> : <ProductView p={p} />}
      </div>
      <footer>© 2026 GYONGS</footer>
    </>
  );
}
