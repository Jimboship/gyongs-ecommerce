import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import { getAdminUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function addProduct(formData) {
  'use server';

  if (!getAdminUser()) redirect('/login?next=/admin');

  const name = String(formData.get('name') || '').trim();
  const category = String(formData.get('category') || '').trim().toLowerCase();
  const price = Number(formData.get('price') || 0);
  const image = String(formData.get('image') || '').trim();

  if (!name || !category || !Number.isFinite(price) || price <= 0 || !image) {
    redirect('/admin?error=Please+fill+all+product+fields');
  }

  await pool.query(
    'INSERT INTO products (name, description, category, price, image) VALUES ($1, $2, $3, $4, $5)',
    [name, `${name} collection piece`, category, price, image]
  );

  redirect('/admin');
}

async function deleteProduct(formData) {
  'use server';

  if (!getAdminUser()) redirect('/login?next=/admin');

  const id = Number(formData.get('id'));
  if (!id) redirect('/admin?error=Invalid+product');

  await pool.query('DELETE FROM products WHERE id = $1', [id]);
  redirect('/admin');
}

async function updateOrderStatus(formData) {
  'use server';

  if (!getAdminUser()) redirect('/login?next=/admin');

  const id = Number(formData.get('id'));
  const status = String(formData.get('status') || '').trim();
  if (!id || !status) redirect('/admin?error=Invalid+order+status');

  await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
  redirect('/admin');
}

export default async function AdminPage() {
  const admin = getAdminUser();
  if (!admin) {
    redirect('/login?next=/admin');
  }

  const [productsRes, usersRes, ordersRes] = await Promise.all([
    pool.query('SELECT id, name, category, price, image FROM products ORDER BY id ASC'),
    pool.query('SELECT id, name, email, created_at FROM users ORDER BY id ASC'),
    pool.query(
      `SELECT o.id, u.name AS customer_name, u.email, o.total, o.status, o.created_at
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.id DESC`
    )
  ]);

  const products = productsRes.rows;
  const users = usersRes.rows;
  const orders = ordersRes.rows;

  return (
    <>
      <header>
        <div className="logo">GYONGS <span>ADMIN</span></div>
        <nav>
          <a href="/">Storefront</a>
          <a href="/shop">Shop</a>
          <a href="/admin">Admin</a>
        </nav>
      </header>

      <main className="wrap admin-page">
        <section className="hero admin-hero">
          <h1>Admin dashboard</h1>
          <p>Manage products, customers and orders from the Next.js admin screen connected to the same PostgreSQL database.</p>
        </section>

        <section className="admin-grid">
          <div className="panel">
            <h2>Add product</h2>
            <form action={addProduct} className="stack-form">
              <label>
                Product name
                <input name="name" placeholder="GYONGS Sneakers" required />
              </label>
              <div className="two-col">
                <label>
                  Category
                  <input name="category" placeholder="shoes" required />
                </label>
                <label>
                  Price
                  <input name="price" type="number" min="1" step="0.01" placeholder="1299.99" required />
                </label>
              </div>
              <label>
                Image filename
                <input name="image" placeholder="gyongs_shoes_01.png" required />
              </label>
              <button className="btn" type="submit">Add product</button>
            </form>
          </div>

          <div className="panel admin-metrics">
            <h2>Quick stats</h2>
            <div className="stat-box">
              <strong>{products.length}</strong>
              <span>Products</span>
            </div>
            <div className="stat-box">
              <strong>{users.length}</strong>
              <span>Customers</span>
            </div>
            <div className="stat-box">
              <strong>{orders.length}</strong>
              <span>Orders</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Products</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>R {Number(product.price).toFixed(2)}</td>
                    <td>{product.image}</td>
                    <td>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" className="btn danger">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-grid lower-grid">
          <div className="panel">
            <h2>Customers</h2>
            <div className="table-wrap small-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <h2>Orders</h2>
            <div className="table-wrap small-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td>R {Number(order.total).toFixed(2)}</td>
                      <td>
                        <form action={updateOrderStatus} className="inline-form">
                          <input type="hidden" name="id" value={order.id} />
                          <select name="status" defaultValue={order.status || 'pending'}>
                            <option value="pending">pending</option>
                            <option value="paid">paid</option>
                            <option value="shipped">shipped</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                          <button type="submit" className="btn tiny">Update</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
