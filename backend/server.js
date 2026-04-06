require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes    = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const adminRoutes   = require('./routes/admin');
const chatRoutes    = require('./routes/chat');
const contentRoutes = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'https://medicare-frontend-q2po.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Static uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/admin',   adminRoutes);
app.use('/api/chat',    chatRoutes);
app.use('/api/content', contentRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🏥  MedCare Backend running on http://localhost:${PORT}`);
  console.log(`📦  Database: medcare.db`);
  console.log(`🔑  Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not set (chatbot disabled)'}`);
  console.log(`📰  Google API: ${process.env.GOOGLE_API_KEY ? '✅ Configured' : '⚠️  Not set (using mock content)'}\n`);
});

module.exports = app;
