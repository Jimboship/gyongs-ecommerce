import PublicHeader from '@/components/PublicHeader';

// Same static copy as legacy public/about.html
export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <div className="wrap">
        <section className="hero">
          <h1>About <em>GYONGS</em></h1>
          <p>GYONGS is a modern fashion / lifestyle e-commerce brand for this school project. We sell trousers, shoes, accessories and a women&apos;s collection. The GYONGS logo is fictional and not connected to any real brand.</p>
        </section>
        <div className="grid">
          <div className="panel"><h3>Brand concept</h3><p>Clean streetwear: everyday trousers, sneakers, caps, bags and women&apos;s fits. Simple catalog, honest Rand prices, easy cart and checkout after login.</p></div>
          <div className="panel"><h3>What we sell</h3><p>Trousers • Shoes • Accessories • Women&apos;s Collection.</p></div>
          <div className="panel"><h3>Values</h3><p>Clear prices, real cart saved per user, orders saved in PostgreSQL, and a calm shopping experience you can explain in class.</p></div>
        </div>
      </div>
      <footer>© 2026 GYONGS • School project</footer>
    </>
  );
}
