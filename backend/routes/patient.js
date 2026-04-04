const express = require('express');
const { db } = require('../db');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Get patient details for the logged-in user ───────────────────────────────
router.get('/my-details', requireAuth, (req, res) => {
  try {
    const details = db.prepare('SELECT * FROM patient_details WHERE medId = ?').get(req.user.medId);
    if (!details) {
      return res.json({ details: null, message: 'No medical records found yet. A doctor will update your records.' });
    }
    return res.json({ details });
  } catch (err) {
    console.error('Get patient details error:', err);
    return res.status(500).json({ error: 'Failed to fetch patient details' });
  }
});

// ─── Get all patients (staff only) ───────────────────────────────────────────
router.get('/all', requireAuth, (req, res) => {
  try {
    if (!['doctor', 'nurse'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Staff access only' });
    }
    const patients = db.prepare(`
      SELECT u.medId, u.name, u.email, u.phone, u.dob, u.gender, u.createdAt,
             pd.domain, pd.currentStatus, pd.doctorHandling, pd.lastUpdated
      FROM users u
      LEFT JOIN patient_details pd ON u.medId = pd.medId
      ORDER BY u.createdAt DESC
    `).all();
    return res.json({ patients });
  } catch (err) {
    console.error('Get all patients error:', err);
    return res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// ─── Get specific patient details (staff only) ────────────────────────────────
router.get('/:medId', requireAuth, (req, res) => {
  try {
    if (!['doctor', 'nurse'].includes(req.user.role)) {
      // Users can only see their own
      if (req.params.medId !== req.user.medId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const user = db.prepare('SELECT id, medId, name, email, phone, dob, gender FROM users WHERE medId = ?').get(req.params.medId);
    if (!user) return res.status(404).json({ error: 'Patient not found' });

    const details = db.prepare('SELECT * FROM patient_details WHERE medId = ?').get(req.params.medId);
    return res.json({ user, details: details || null });
  } catch (err) {
    console.error('Get patient error:', err);
    return res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

module.exports = router;
