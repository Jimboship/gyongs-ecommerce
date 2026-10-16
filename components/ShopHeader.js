'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Protected header — same links as legacy shop/product/cart/checkout/orders pages
export default function ShopHeader() {
  const router = useRouter();
  const logout = async (e) => {
    e.preventDefault();
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    try { localStorage.removeItem('gyongs_token'); } catch {}
    router.push('/');
  };
  return (
    <header>
      <h2 className="logo">GYONGS<span>.</span></h2>
      <nav>
        <Link href="/shop">Shop</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/orders">My Orders</Link>
        <a href="#" onClick={logout}>Logout</a>
      </nav>
    </header>
  );
}
