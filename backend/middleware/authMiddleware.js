const { db } = require('../db');

// Verify session cookie and attach user to req
function requireAuth(req, res, next) {
  const session = req.cookies?.session;
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const parsed = JSON.parse(Buffer.from(session, 'base64').toString('utf8'));
    const { medId, role, exp } = parsed;

    if (Date.now() > exp) {
      res.clearCookie('session');
      return res.status(401).json({ error: 'Session expired' });
    }

    // Verify user still exists in DB
    let user = null;
    if (role === 'user') {
      user = db.prepare('SELECT id, medId, name, email, role FROM users WHERE medId = ?').get(medId);
    } else {
      user = db.prepare('SELECT id, medId, name, email, role, hospitalId, specialty FROM staff WHERE medId = ?').get(medId);
    }

    if (!user) {
      res.clearCookie('session');
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch {
    res.clearCookie('session');
    return res.status(401).json({ error: 'Invalid session' });
  }
}

// Staff-only middleware
function requireStaff(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'doctor' && req.user.role !== 'nurse') {
      return res.status(403).json({ error: 'Staff access only' });
    }
    next();
  });
}

// Build and set session cookie
function setSessionCookie(res, medId, role) {
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 1 day
  const payload = JSON.stringify({ medId, role, exp });
  const token = Buffer.from(payload).toString('base64');

  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('session', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
}

module.exports = { requireAuth, requireStaff, setSessionCookie };
