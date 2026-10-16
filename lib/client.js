// Frontend helpers — same behavior as legacy public/app.js.
export const GY = {
  img: (name) => (name ? '/assets/' + encodeURIComponent(name) : '/assets/gyongs_active_01.png'),
  rand: (n) => 'R ' + Number(n).toFixed(2),
  token() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('gyongs_token');
  },
  headers(extra = {}) {
    const h = { 'Content-Type': 'application/json', ...extra };
    const t = this.token();
    if (t) h.Authorization = 'Bearer ' + t;
    return h;
  },
  async api(path, opts = {}) {
    const res = await fetch(path, { ...opts, headers: this.headers(opts.headers) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || ('Request failed: ' + res.status));
    return data;
  },
  logout() {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      try {
         localStorage.removeItem('gyongs_token'); }
          catch {}
      window.location.href = '/';
    });
  },
};
