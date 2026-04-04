const express = require('express');
const axios = require('axios');
const { db } = require('../db');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// ─── Get personalized health content ─────────────────────────────────────────
router.get('/news', requireAuth, async (req, res) => {
  try {
    const patientDetails = db.prepare('SELECT domain FROM patient_details WHERE medId = ?').get(req.user.medId);
    const domain = req.query.domain || patientDetails?.domain || 'general health';

    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || apiKey === 'your_google_api_key_here') {
      // Return mock content when API key not set
      return res.json({ articles: getMockContent(domain), domain, isMock: true });
    }

    const query = `${domain} health tips remedies latest news 2024`;
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: { key: apiKey, cx, q: query, num: 8, safe: 'active' },
    });

    const articles = (response.data.items || []).map(item => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
      image: item.pagemap?.cse_image?.[0]?.src || null,
      source: item.displayLink,
    }));

    return res.json({ articles, domain });
  } catch (err) {
    console.error('News fetch error:', err.message);
    return res.json({ articles: getMockContent('health'), domain: 'health', isMock: true });
  }
});

// ─── Mock content for when API key is not set ─────────────────────────────────
function getMockContent(domain) {
  const mockMap = {
    default: [
      {
        title: '10 Ways to Boost Your Immune System Naturally',
        snippet: 'Discover evidence-based strategies to strengthen your immune system including diet, sleep, and lifestyle changes that can help protect your health.',
        link: '#',
        source: 'healthline.com',
        image: null,
      },
      {
        title: 'The Importance of Regular Health Check-ups',
        snippet: 'Regular preventive screenings can catch conditions early when they are most treatable. Learn which check-ups you need and how often to get them.',
        link: '#',
        source: 'mayoclinic.org',
        image: null,
      },
      {
        title: 'Mindfulness and Its Impact on Physical Health',
        snippet: 'Research shows that practicing mindfulness regularly can reduce stress, lower blood pressure, and improve overall well-being.',
        link: '#',
        source: 'webmd.com',
        image: null,
      },
      {
        title: 'Nutrition Guidelines for Optimal Health',
        snippet: 'A balanced diet rich in fruits, vegetables, whole grains, and lean proteins forms the foundation of good health. Here is what experts recommend.',
        link: '#',
        source: 'who.int',
        image: null,
      },
    ],
  };

  return mockMap[domain.toLowerCase()] || mockMap.default;
}

module.exports = router;
