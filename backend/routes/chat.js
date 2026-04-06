const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../db');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Build context-aware system prompt ───────────────────────────────────────
function buildSystemPrompt(patientDetails) {
  let context = '';
  if (patientDetails) {
    context = `
The patient you are speaking with has the following medical profile:
- Medical Domain / Condition: ${patientDetails.domain || 'Not specified'}
- Current Status: ${patientDetails.currentStatus || 'Unknown'}
- Doctor Handling: ${patientDetails.doctorHandling || 'Not assigned'}
- Recent Tests Done: ${patientDetails.testsDone || 'None recorded'}
- Blood Glucose: ${patientDetails.bloodGlucose || 'Not recorded'}
- Blood Pressure: ${patientDetails.pressure || 'Not recorded'}
- Summary: ${patientDetails.medicalReport || 'No report yet'}

Use this context to give personalized, relevant answers about their condition.
    `.trim();
  }

  return `You are MedBot, a compassionate and knowledgeable AI health assistant for MedCare Hospital.
Your role is to help patients understand their medical conditions, explain test results in plain language, provide general health advice, and offer emotional support.

${context}

Rules you must follow:
1. Always speak in a warm, empathetic, and easy-to-understand tone.
2. When explaining medical terms, always follow with a simple plain-language explanation.
3. Always remind patients to consult their doctor for diagnosis or treatment decisions.
4. Never prescribe medications or recommend dosages.
5. Give organized, structured answers using clear sections when appropriate.
6. Be encouraging and supportive — many patients are anxious.
7. If asked about topics unrelated to health, gently redirect to health topics.
8. Format responses cleanly with line breaks for readability.`;
}

// ─── Chat endpoint ────────────────────────────────────────────────────────────
router.post('/message', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyAzvx6FW8m_AJk1QKSCHH0BKvF7btCBB_A') {
      return res.status(503).json({
        error: 'AI service not configured',
        reply: 'The AI chatbot is not configured yet. Please add a GEMINI_API_KEY in the server .env file.'
      });
    }

    // Get patient context for personalization
    const patientDetails = db.prepare('SELECT * FROM patient_details WHERE medId = ?').get(req.user.medId);

    // Load last 10 messages for context
    const history = db.prepare(`
      SELECT role, content FROM chat_history
      WHERE medId = ? ORDER BY createdAt DESC LIMIT 10
    `).all(req.user.medId).reverse();

    // Save user message
    db.prepare('INSERT INTO chat_history (medId, role, content) VALUES (?, ?, ?)').run(
      req.user.medId, 'user', message.trim()
    );

    // Build Gemini chat
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: buildSystemPrompt(patientDetails),
    });

    const chatHistory = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : h.role,
      parts: [{ text: h.content }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    // Save assistant reply
    db.prepare('INSERT INTO chat_history (medId, role, content) VALUES (?, ?, ?)').run(
      req.user.medId, 'assistant', reply
    );

    return res.json({ reply });
  } catch (err) {
  //  console.error('Chat error:', err.message);
    return res.status(500).json({
      error: 'AI error',
      reply: 'Sorry, I encountered an error. Please try again in a moment.'
    });
  }
});

// ─── Get chat history ─────────────────────────────────────────────────────────
router.get('/history', requireAuth, (req, res) => {
  const history = db.prepare(`
    SELECT role, content, createdAt FROM chat_history
    WHERE medId = ? ORDER BY createdAt ASC LIMIT 50
  `).all(req.user.medId);
  return res.json({ history });
});

// ─── Clear chat history ───────────────────────────────────────────────────────
router.delete('/history', requireAuth, (req, res) => {
  db.prepare('DELETE FROM chat_history WHERE medId = ?').run(req.user.medId);
  return res.json({ message: 'Chat history cleared' });
});

module.exports = router;
