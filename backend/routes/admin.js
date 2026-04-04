const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../db');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Multer config for scan uploads ──────────────────────────────────────────
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${req.params.medId || 'unknown'}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs allowed'));
    }
  },
});

// Middleware: staff only
function staffOnly(req, res, next) {
  if (!['doctor', 'nurse'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Staff access only' });
  }
  next();
}

// ─── Upsert patient details ───────────────────────────────────────────────────
router.post('/patient/:medId', requireAuth, staffOnly, upload.single('scan'), (req, res) => {
  try {
    const { medId } = req.params;
    const {
      medicalReport, domain, scanType, bloodGlucose,
      pressure, doctorHandling, contact, currentStatus, testsDone
    } = req.body;

    // Verify patient exists
    const patient = db.prepare('SELECT id FROM users WHERE medId = ?').get(medId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const scanImagePath = req.file ? `/uploads/${req.file.filename}` : undefined;
    const updatedBy = req.user.name;
    const now = new Date().toISOString();

    const existing = db.prepare('SELECT id FROM patient_details WHERE medId = ?').get(medId);

    if (existing) {
      // Build dynamic update
      const updates = [];
      const values = [];

      if (medicalReport !== undefined) { updates.push('medicalReport = ?'); values.push(medicalReport); }
      if (domain !== undefined) { updates.push('domain = ?'); values.push(domain); }
      if (scanType !== undefined) { updates.push('scanType = ?'); values.push(scanType); }
      if (scanImagePath) { updates.push('scanImagePath = ?'); values.push(scanImagePath); }
      if (bloodGlucose !== undefined) { updates.push('bloodGlucose = ?'); values.push(bloodGlucose); }
      if (pressure !== undefined) { updates.push('pressure = ?'); values.push(pressure); }
      if (doctorHandling !== undefined) { updates.push('doctorHandling = ?'); values.push(doctorHandling); }
      if (contact !== undefined) { updates.push('contact = ?'); values.push(contact); }
      if (currentStatus !== undefined) { updates.push('currentStatus = ?'); values.push(currentStatus); }
      if (testsDone !== undefined) { updates.push('testsDone = ?'); values.push(testsDone); }

      updates.push('lastUpdated = ?', 'updatedBy = ?');
      values.push(now, updatedBy, medId);

      db.prepare(`UPDATE patient_details SET ${updates.join(', ')} WHERE medId = ?`).run(...values);
    } else {
      db.prepare(`
        INSERT INTO patient_details
          (medId, medicalReport, domain, scanType, scanImagePath, bloodGlucose, pressure, doctorHandling, contact, currentStatus, testsDone, lastUpdated, updatedBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        medId,
        medicalReport || '', domain || '', scanType || '',
        scanImagePath || '', bloodGlucose || '', pressure || '',
        doctorHandling || '', contact || '', currentStatus || 'stable',
        testsDone || '', now, updatedBy
      );
    }

    return res.json({ message: 'Patient details updated successfully' });
  } catch (err) {
    console.error('Update patient error:', err);
    return res.status(500).json({ error: 'Failed to update patient details' });
  }
});

// ─── Get scan image ───────────────────────────────────────────────────────────
router.get('/scan/:filename', requireAuth, (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.sendFile(filePath);
});

module.exports = router;
