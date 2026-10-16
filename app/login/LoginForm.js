'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Same forms/behavior/messages as legacy public/auth.html + auth-ui.js.
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lmsg, setLmsg] = useState('');
  const [rmsg, setRmsg] = useState('');

  const onLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email');
    email.value = email.value.trim().toLowerCase();
    if (!email.checkValidity()) { email.reportValidity(); return; }
    setLmsg('Logging in...');
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: document.getElementById('password').value }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Login failed.');
      localStorage.setItem('gyongs_token', d.token);
      setLmsg('Welcome! Opening shop...');
      const n = searchParams.get('next');
      setTimeout(() => { router.push(n && n.startsWith('/') ? n : '/shop'); }, 600);
    } catch (err) {
      setLmsg(err.message);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    const pw = document.getElementById('register-password').value;
    if (pw !== document.getElementById('register-confirm').value) {
      setRmsg('Passwords do not match.');
      return;
    }
    setRmsg('Creating account...');
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: document.getElementById('username').value.trim(),
          email: document.getElementById('register-email').value.trim().toLowerCase(),
          password: pw,
          confirmPassword: document.getElementById('register-confirm').value,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Registration failed.');
      localStorage.setItem('gyongs_token', d.token);
      setRmsg('Account created! Opening shop...');
      setTimeout(() => { router.push('/shop'); }, 600);
    } catch (err) {
      setRmsg(err.message);
    }
  };

  return (
    <>
      <a id="close" aria-hidden="true"></a>
      <header>
        <h2 className="logo">GYONGS |</h2>
        <nav className="navigation">
          <a href="/">Home</a>
          <a href="/contact">Contact</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="#login-panel" className="btnlogin">login</a>
        </nav>
      </header>
      <div className="auth-wrapper">
        <div className="container register-container panel" id="register-panel">
          <a href="#close" className="icon-close" aria-label="Close">X</a>
          <div className="reg-container">
            <form id="rf" method="post" onSubmit={onRegister}>
              <h2 className="h2log">Registration</h2>
              <div className="input-box">
                <input className="input" id="username" required />
                <label htmlFor="username">Name</label>
              </div>
              <div className="input-box">
                <input className="input" id="register-email" type="email" required />
                <label htmlFor="register-email">Email</label>
              </div>
              <div className="input-box">
                <input className="input" id="register-password" type="password" required minLength={3} />
                <label htmlFor="register-password">Password</label>
              </div>
              <div className="input-box">
                <input className="input" id="register-confirm" type="password" required minLength={3} />
                <label htmlFor="register-confirm">Confirm Password</label>
              </div>
              <p id="rmsg">{rmsg}</p>
              <button className="btn" type="submit">Create account</button>
              <p>Have an account? <a href="#login-panel" className="toggle-link">Login</a></p>
            </form>
          </div>
        </div>
        <div className="container panel" id="login-panel">
          <a href="#close" className="icon-close" aria-label="Close">X</a>
          <main id="login">
            <form id="lf" method="post" onSubmit={onLogin}>
              <h2 className="h2log">GYONGS login</h2>
              <div className="input-box">
                <input className="input" id="email" type="email" required />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-box">
                <input className="input" id="password" type="password" required />
                <label htmlFor="password">Password</label>
              </div>
              <p id="lmsg">{lmsg}</p>
              <button className="btn" type="submit">Log in</button>
              <p>No account? <a href="#register-panel" className="toggle-link">Register</a></p>
            </form>
          </main>
        </div>
      </div>
    </>
  );
}
