const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'medcare.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Generate unique MedID ────────────────────────────────────────────────────
function generateMedId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const random = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `MED-${random}`;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    medId       TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    dob         TEXT NOT NULL,
    gender      TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'user',
    createdAt   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS staff (
    id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    medId       TEXT UNIQUE NOT NULL,
    hospitalId  TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    dob         TEXT NOT NULL,
    gender      TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'doctor',
    specialty   TEXT,
    createdAt   TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS patient_details (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    medId           TEXT UNIQUE NOT NULL,
    medicalReport   TEXT,
    domain          TEXT,
    scanType        TEXT,
    scanImagePath   TEXT,
    bloodGlucose    TEXT,
    pressure        TEXT,
    doctorHandling  TEXT,
    contact         TEXT,
    currentStatus   TEXT DEFAULT 'stable',
    testsDone       TEXT,
    lastUpdated     TEXT DEFAULT (datetime('now')),
    updatedBy       TEXT
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id        TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    medId     TEXT NOT NULL,
    role      TEXT NOT NULL,
    content   TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  );
`);

// ─── Helper: create medId that doesn't collide ────────────────────────────────
function getUniqueMedId() {
  let medId;
  let attempts = 0;
  do {
    medId = generateMedId();
    const existsUser  = db.prepare('SELECT 1 FROM users WHERE medId = ?').get(medId);
    const existsStaff = db.prepare('SELECT 1 FROM staff WHERE medId = ?').get(medId);
    if (!existsUser && !existsStaff) break;
    attempts++;
  } while (attempts < 20);
  return medId;
}

module.exports = { db, getUniqueMedId };
