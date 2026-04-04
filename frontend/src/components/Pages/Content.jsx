import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../utils/api.js';

const CATEGORIES = ['All', 'Nutrition', 'Mental Health', 'Exercise', 'Prevention', 'Remedies'];

export default function ContentPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [domain, setDomain]     = useState('');
  const [isMock, setIsMock]     = useState(false);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async (cat) => {
    setLoading(true);
    try {
      const q = cat && cat !== 'All' ? cat : undefined;
      const res = await api.get('/content/news', { params: q ? { domain: q } : {} });
      setArticles(res.data.articles || []);
      setDomain(res.data.domain || 'general health');
      setIsMock(res.data.isMock || false);
    } catch {
      setArticles(FALLBACK_ARTICLES);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    fetchContent(cat === 'All' ? '' : cat);
  };

  return (
    <div className="animate-fadeUp">
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Health Content</h1>
          <p style={styles.pageSub}>
            Personalized articles &amp; news for your wellbeing
            {domain && <span style={styles.domainBadge}>{domain}</span>}
          </p>
        </div>
        {isMock && (
          <div style={styles.mockNote}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#a16207" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="#a16207" strokeWidth="2"/>
              <circle cx="12" cy="16" r="1" fill="#a16207"/>
            </svg>
            Sample content — add Google API key for live news
          </div>
        )}
      </div>

      {/* Greeting card */}
      <div style={styles.greetingCard}>
        <div style={styles.greetingText}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>Good day,</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>{user?.name} 👋</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5 }}>
            Here is your personalized health content. Stay informed, stay healthy.
          </p>
        </div>
        <div style={styles.greetingIllustration}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.08)"/>
            <path d="M40 20c-11 0-20 9-20 20s9 20 20 20 20-9 20-20S51 20 40 20z" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
            <path d="M32 40l5 5 11-11" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Category filter */}
      <div style={styles.categories}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => handleCategory(c)}
            style={{ ...styles.catBtn, ...(category === c ? styles.catActive : {}) }}>
            {c}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {loading ? (
        <div style={styles.grid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={styles.skeletonCard}>
              <div className="skeleton" style={{ height: 140, borderRadius: 10, marginBottom: 14 }} />
              <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 12, width: '70%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.grid}>
          {articles.map((article, i) => (
            <ArticleCard key={i} article={article} delay={i * 80} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article, delay }) {
  return (
    <a href={article.link !== '#' ? article.link : undefined} target="_blank" rel="noopener noreferrer"
      style={{ ...styles.articleCard, animationDelay: `${delay}ms` }}
      className="animate-fadeUp">
      {article.image ? (
        <img src={article.image} alt="" style={styles.articleImg} onError={e => e.target.style.display = 'none'} />
      ) : (
        <div style={styles.articleImgPlaceholder}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0z" stroke="#0ea5e9" strokeWidth="1.5"/>
            <path d="M1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" stroke="#0ea5e9" strokeWidth="1.5"/>
          </svg>
        </div>
      )}
      <div style={styles.articleBody}>
        <p style={styles.articleSource}>{article.source}</p>
        <h3 style={styles.articleTitle}>{article.title}</h3>
        <p style={styles.articleSnippet}>{article.snippet}</p>
        <div style={styles.readMore}>Read more →</div>
      </div>
    </a>
  );
}

const FALLBACK_ARTICLES = [
  { title: '10 Ways to Boost Your Immune System', snippet: 'Discover evidence-based strategies including diet, sleep, and lifestyle changes.', link: '#', source: 'healthline.com', image: null },
  { title: 'The Importance of Regular Health Check-ups', snippet: 'Regular preventive screenings can catch conditions early when most treatable.', link: '#', source: 'mayoclinic.org', image: null },
  { title: 'Mindfulness and Physical Health', snippet: 'Research shows mindfulness reduces stress, lowers blood pressure, and improves wellbeing.', link: '#', source: 'webmd.com', image: null },
  { title: 'Nutrition Guidelines for Optimal Health', snippet: 'A balanced diet rich in fruits, vegetables, and whole grains is the foundation of good health.', link: '#', source: 'who.int', image: null },
];

const styles = {
  pageHeader:        { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  pageTitle:         { fontSize: 26, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px', marginBottom: 4 },
  pageSub:           { fontSize: 14, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 },
  domainBadge:       { background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 99, textTransform: 'capitalize' },
  mockNote:          { display: 'flex', alignItems: 'center', gap: 6, background: '#fef9c3', color: '#a16207', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 500 },
  greetingCard:      { background: 'linear-gradient(135deg, #0369a1, #0ea5e9 60%, #06b6d4)', borderRadius: 18, padding: '24px 28px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden' },
  greetingText:      { flex: 1 },
  greetingIllustration: { opacity: 0.8 },
  categories:        { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  catBtn:            { padding: '7px 16px', border: '1.5px solid var(--border)', borderRadius: 99, background: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s', fontFamily: 'var(--font)' },
  catActive:         { background: 'var(--primary)', borderColor: 'var(--primary)', color: 'white', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' },
  grid:              { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
  skeletonCard:      { background: 'white', borderRadius: 14, padding: 16, border: '1px solid var(--border)' },
  articleCard:       { background: 'white', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'pointer', boxShadow: 'var(--shadow)' },
  articleImg:        { width: '100%', height: 140, objectFit: 'cover' },
  articleImgPlaceholder: { height: 120, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  articleBody:       { padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' },
  articleSource:     { fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 },
  articleTitle:      { fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 },
  articleSnippet:    { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, flex: 1, marginBottom: 12 },
  readMore:          { fontSize: 12, color: 'var(--primary)', fontWeight: 600 },
};
