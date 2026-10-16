import Link from 'next/link';

// Public header — same links as legacy public/index.html
export default function PublicHeader() {
  return (
    <header>
      <h2 className="logo">GYONGS<span>.</span></h2>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About Us</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/login">Login</Link>
        <Link className="btn" href="/login#register-panel">Register</Link>
      </nav>
    </header>
  );
}
