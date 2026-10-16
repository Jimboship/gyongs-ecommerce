/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js is standalone: product images are served from
  // public/assets/* and login styles from public/login.css.
  // No legacy Express dependency remains.
  // PostgreSQL via lib/db.js (pg Pool, no ORM).
};
module.exports = nextConfig;
