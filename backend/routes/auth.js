const express = require('express');
const bcrypt = require('bcryptjs');
const { db, getUniqueMedId } = require('../db');
const { setSessionCookie, requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();
const SALT_ROUNDS = 12;
const HOSPITAL_PREFIX = process.env.HOSPITAL_SECRET_PREFIX || '@MedCare';

// ─── Register User ────────────────────────────────────────────────────────────
router.post('/register/user', async (req, res) => {
  try {
    const { name, phone, email, password, dob, gender } = req.body;

    if (!name || !phone || !email || !password || !dob || !gender) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const medId = getUniqueMedId();

    db.prepare(`
      INSERT INTO users (medId, name, phone, email, password, dob, gender)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(medId, name.trim(), phone.trim(), email.toLowerCase().trim(), hashedPassword, dob, gender);

    setSessionCookie(res, medId, 'user');

    return res.status(201).json({
      message: 'Account created successfully',
      user: { medId, name, email, role: 'user' }
    });
  } catch (err) {
    console.error('Register user error:', err);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// ─── Register Staff (Doctor / Nurse) ─────────────────────────────────────────
router.post('/register/staff', async (req, res) => {
  try {
    const { hospitalId, name, phone, email, password, dob, gender, role, specialty } = req.body;

    if (!hospitalId || !name || !phone || !email || !password || !dob || !gender) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!hospitalId.startsWith(HOSPITAL_PREFIX)) {
      return res.status(403).json({ error: `Invalid Hospital ID. Must start with ${HOSPITAL_PREFIX}` });
    }

    const existingEmail = db.prepare('SELECT id FROM staff WHERE email = ?').get(email.toLowerCase());
    if (existingEmail) return res.status(409).json({ error: 'Email already registered' });

    const existingHospId = db.prepare('SELECT id FROM staff WHERE hospitalId = ?').get(hospitalId);
    if (existingHospId) return res.status(409).json({ error: 'Hospital ID already in use' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const medId = getUniqueMedId();
    const staffRole = ['doctor', 'nurse'].includes(role) ? role : 'doctor';

    db.prepare(`
      INSERT INTO staff (medId, hospitalId, name, phone, email, password, dob, gender, role, specialty)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(medId, hospitalId, name.trim(), phone.trim(), email.toLowerCase().trim(), hashedPassword, dob, gender, staffRole, specialty || '');

    setSessionCookie(res, medId, staffRole);

    return res.status(201).json({
      message: 'Staff account created successfully',
      user: { medId, name, email, role: staffRole }
    });
  } catch (err) {
    console.error('Register staff error:', err);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// ─── Login User ───────────────────────────────────────────────────────────────
router.post('/login/user', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    setSessionCookie(res, user.medId, user.role);

    return res.json({
      message: 'Login successful',
      user: { medId: user.medId, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// ─── Login Staff ──────────────────────────────────────────────────────────────
router.post('/login/staff', async (req, res) => {
  try {
    const { hospitalId, email, password } = req.body;
    if (!hospitalId || !email || !password) {
      return res.status(400).json({ error: 'Hospital ID, email and password required' });
    }

    const staff = db.prepare('SELECT * FROM staff WHERE hospitalId = ? AND email = ?')
      .get(hospitalId, email.toLowerCase().trim());
    if (!staff) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, staff.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    setSessionCookie(res, staff.medId, staff.role);

    return res.json({
      message: 'Login successful',
      user: { medId: staff.medId, name: staff.name, email: staff.email, role: staff.role, specialty: staff.specialty }
    });
  } catch (err) {
    console.error('Staff login error:', err);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('session');
  return res.json({ message: 'Logged out successfully' });
});

// ─── Get current session user ─────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
