import PublicHeader from '@/components/PublicHeader';
import ProductCard from '@/components/ProductCard';
import { listProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

// Legacy services.html: public collections with category filter (?category= / hash).
export default async function ServicesPage({ searchParams }) {
  const params= await searchParams
  const category = searchParams?.category || '';
  let products = [];
  let error = '';
  try {
    products = await listProducts({ category: category || undefined });
  } catch (e) {
    error = e.message;
  }
  const cats = [
    { label: 'All', value: '' },
    { label: 'Trousers', value: 'trousers' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Women', value: 'women' },
  ];
  return (
    <>
      <PublicHeader />
      <div className="wrap">
        <section className="hero">
          <h1>Collections / <em>Services</em></h1>
          <p>Browse the GYONGS ranges below. To add to cart and checkout you must <a href="/login" style={{ color: '#ffd633' }}>log in</a> first — that is the protected shopping area.</p>
          <div className="catbar">
            {cats.map((c) => (
              <a key={c.label} className={c.value === category ? 'active' : ''} href={c.value ? `/services?category=${c.value}` : '/services'}>{c.label}</a>
            ))}
          </div>
        </section>
        {error ? (
          <div className="panel">Start backend + DB first. ({error})</div>
        ) : (
          <div className="grid">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
        {!error && products.length === 0 ? <div className="panel">No products in this range yet.</div> : null}
        <p className="notice-small">The GYONGS logo is fictional and used only for this school project.</p>
      </div>
      <footer>© 2026 GYONGS • School project</footer>
    </>
  );
}
