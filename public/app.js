// Shared GYONGS frontend helpers (no framework).
const GY = {
  // images live in project root, served at /assets/<filename>
  img: (name) => (name ? '/assets/' + encodeURIComponent(name) : '/assets/gyongs_active_01.png'),
  rand: (n) => 'R ' + Number(n).toFixed(2),
  token() { return localStorage.getItem('gyongs_token'); },
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
  async requireUser() {
    try {
      const d = await this.api('/api/auth/me');
      return d.user;
    } catch (e) {
      localStorage.removeItem('gyongs_token');
      location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search);
      throw e;
    }
  },
  logout() {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      localStorage.removeItem('gyongs_token');
      location.href = '/';
    });
  },
};
