const jwt = require('jsonwebtoken');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'dev-secret-change-me',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Reads JWT from httpOnly cookie OR Authorization: Bearer <token>
function requireAuth(req, res, next) {
  const fromCookie = req.cookies && req.cookies.gyongs_token;
  const header = req.headers.authorization || '';
  const fromHeader = header.startsWith('Bearer ') ? header.slice(7) : null;
  const token = fromCookie || fromHeader;

  if (!token) return res.status(401).json({ error: 'Please log in first.' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-me');
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}

module.exports = { signToken, requireAuth };
