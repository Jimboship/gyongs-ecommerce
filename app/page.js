import PublicHeader from '@/components/PublicHeader';
import ProductCard from '@/components/ProductCard';
import { listProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

// Legacy public/index.html behavior: fetch all products, show first 8 as preview.
export default async function HomePage() {
  let products = [];
  let error = '';
  try {
    products = await listProducts({});
  } catch (e) {
    error = e.message;
  }
  const featured = products.slice(0, 8);
  return (
    <>
      <PublicHeader />
      <div className="wrap">
        <section className="hero">
          <h1>Wear <em>GYONGS.</em> Own the street.</h1>
          <p>GYONGS is a modern fashion / lifestyle store: trousers, shoes, accessories, and a women&apos;s collection. The GYONGS logo is fictional and was created for this school project. Register, log in, then shop the protected store.</p>
          <div className="hero-actions">
            <a className="btn" href="/login#register-panel">Create account</a>
            <a className="btn ghost" href="/login">Log in to shop</a>
            <a className="btn ghost" href="/services">View collections</a>
          </div>
        </section>

        <h2 style={{ marginTop: 26 }}>Featured products</h2>
        <p className="notice-small">Full shopping (add to cart / checkout) unlocks after login. Featured items below are a preview.</p>
        {error ? (
          <div className="panel">Could not load products yet. Start the DB, then run <b>db/schema.sql</b> + <b>db/seed.sql</b>. ({error})</div>
        ) : (
          <div className="grid">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}

        <section className="panel" style={{ marginTop: 22 }}>
          <h2>Collections</h2>
          <div className="catbar">
            <a href="/services#trousers">Trousers</a><a href="/services#shoes">Shoes</a>
            <a href="/services#accessories">Accessories</a><a href="/services#women">Women</a>
          </div>
          <p className="notice-small">The GYONGS logo is fictional and used only for this school project.</p>
        </section>
      </div>
      <footer>© 2026 GYONGS • School project demo store • Prices in Rand (R)</footer>
    </>
  );
}
