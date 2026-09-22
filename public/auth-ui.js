document.getElementById('lf').addEventListener('submit', async (e) => {
  e.preventDefault();

  const m = document.getElementById('lmsg');
  const submit = e.currentTarget.querySelector('button[type="submit"]');
  const email = document.getElementById('email');

  email.value = email.value.trim().toLowerCase();

  if (!email.checkValidity()) {
    email.reportValidity();
    return;
  }

  submit.disabled = true;
  m.textContent = 'Logging in...';

  try {
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: document.getElementById('password').value
      })
    });

    const d = await r.json();

    if (!r.ok) throw new Error(d.error || 'Login failed.');

    localStorage.setItem('gyongs_token', d.token);
    m.textContent = 'Welcome! Opening shop...';

    const n = new URLSearchParams(location.search).get('next');

    setTimeout(() => {
      location.href = (n && n.startsWith('/')) ? n : '/shop.html';
    }, 600);

  } catch (err) {
    m.textContent = err.message;
    submit.disabled = false;
  }
});


document.getElementById('rf').addEventListener('submit', async (e) => {
  e.preventDefault();

  const m = document.getElementById('rmsg');
  const submit = e.currentTarget.querySelector('button[type="submit"]');
  const email = document.getElementById('register-email');

  const pw = document.getElementById('register-password').value;

  if (pw !== document.getElementById('register-confirm').value) {
    m.textContent = 'Passwords do not match.';
    return;
  }

  submit.disabled = true;
  m.textContent = 'Creating account...';

  try {
    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('username').value.trim(),
        email: email.value.trim().toLowerCase(),
        password: pw,
        confirmPassword: document.getElementById('register-confirm').value
      })
    });

    const d = await r.json();

    if (!r.ok) throw new Error(d.error || 'Registration failed.');

    localStorage.setItem('gyongs_token', d.token);
    m.textContent = 'Account created! Opening shop...';

    setTimeout(() => {
      location.href = '/shop.html';
    }, 600);

  } catch (err) {
    m.textContent = err.message;
    submit.disabled = false;
  }
});