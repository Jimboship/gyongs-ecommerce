# GYONGS E-Commerce (school project)

## Architecture (as required)
- Customer site: HTML + CSS + JS (`public/`) — NO React/Vue
- Backend: Node.js + Express (`server.js`, `routes/`)
- Database: PostgreSQL (`db/schema.sql`, `db/seed.sql`)
- Login design: `login.css` preserved; `public/login.html` reuses same panel look
- Admin: separate Java Swing app (later) on same PostgreSQL DB

## 1) Install
npm install

## 2) Edit DB password
Open `.env` and set `PGPASSWORD` to your postgres password.

## 3) Create DB + tables + products
In psql or pgAdmin:
CREATE DATABASE gyongs_db;
Then:
npm run db:init
npm run db:seed

## 4) Run backend
npm start
Open http://localhost:3000
Health: http://localhost:3000/api/health

## Flow to test
Register -> Login -> /shop.html -> product -> add to cart -> cart qty -> checkout -> My Orders -> logout.
