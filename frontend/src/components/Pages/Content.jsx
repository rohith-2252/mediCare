import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../utils/api.js';

const CATEGORIES = ['All', 'Nutrition', 'Mental Health', 'Exercise', 'Prevention'];

export default function ContentPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [category, setCategory] = useState('All');

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async (cat) => {
    setLoading(true);
    try {
      const q = cat && cat !== 'All' ? cat : undefined;
      const res = await api.get('/content/news', { params: q ? { domain: q } : {} });
      setArticles(res.data.articles || []);
    } catch { setArticles([]); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fadeUp">
      <style>{`
        @media (max-width: 600px) {
          .greeting-card { flex-direction: column !important; text-align: center; }
          .greeting-illus { display: none; }
          .content-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={styles.greetingCard} className="greeting-card">
        <div>
          <h2 style={{ color: 'white', margin: 0 }}>Hello, {user?.name?.split(' ')[0]} 👋</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Latest health insights for you.</p>
        </div>
        <div style={styles.greetingIllustration} className="greeting-illus">🏥</div>
      </div>

      <div style={styles.categories}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c); fetchContent(c); }}
            style={{ ...styles.catBtn, ...(category === c ? styles.catActive : {}) }}>{c}</button>
        ))}
      </div>

      <div style={styles.grid} className="content-grid">
        {loading ? <p>Loading articles...</p> : articles.map((article, i) => (
          <div key={i} style={styles.articleCard}>
            <div style={styles.articleImgPlaceholder}>📰</div>
            <div style={{ padding: '12px' }}>
              <p style={styles.articleSource}>{article.source}</p>
              <h3 style={styles.articleTitle}>{article.title}</h3>
              <p style={styles.articleSnippet}>{article.snippet}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  greetingCard: { background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', borderRadius: 16, padding: '24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  greetingIllustration: { fontSize: 40, opacity: 0.5 },
  categories: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: '12px', marginBottom: 12 },
  catBtn: { padding: '6px 14px', borderRadius: 20, border: '1px solid #eee', background: 'white', cursor: 'pointer', whiteSpace: 'nowrap' },
  catActive: { background: '#0ea5e9', color: 'white', borderColor: '#0ea5e9' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  articleCard: { background: 'white', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden' },
  articleImgPlaceholder: { height: 120, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 },
  articleSource: { fontSize: 10, color: '#64748b', textTransform: 'uppercase' },
  articleTitle: { fontSize: 15, fontWeight: 700, margin: '4px 0' },
  articleSnippet: { fontSize: 13, color: '#475569', lineHeight: 1.4 }
};