'use client';
import PublicHeader from '@/components/PublicHeader';

// Same demo behavior as legacy public/contact.html (no message is sent anywhere).
export default function ContactPage() {
  const onSubmit = (e) => {
    e.preventDefault();
    document.getElementById('cmsg').textContent = 'Thanks! Demo form only — your message was not sent anywhere.';
    e.target.reset();
  };
  return (
    <>
      <PublicHeader />
      <div className="wrap">
        <section className="hero"><h1>Contact <em>GYONGS</em></h1><p>Fictional school-project contact details (not personal info).</p></section>
        <div className="grid">
          <div className="panel"><h3>Customer support</h3><p>Email: support@gyongs-demo.co.za<br />Phone: +27 11 555 0142 (fictional)<br />Address: 12 Demo Street, Johannesburg, Gauteng (fictional)<br />Hours: Mon–Fri, 09:00–17:00</p></div>
          <div className="panel"><h3>Send a message</h3>
            <form id="cform" onSubmit={onSubmit}>
              <label>Name</label><input required id="cn" /><br /><br />
              <label>Email</label><input required type="email" id="ce" /><br /><br />
              <label>Message</label><textarea required id="cm" rows="4"></textarea><br /><br />
              <button className="btn" type="submit">Send (demo)</button>
              <p id="cmsg"></p>
            </form>
          </div>
        </div>
      </div>
      <footer>© 2026 GYONGS • School project</footer>
    </>
  );
}
