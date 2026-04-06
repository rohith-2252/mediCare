import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../utils/api.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('user'); 
  const [form, setForm] = useState({ email: '', password: '', hospitalId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = tab === 'user' ? '/auth/login/user' : '/auth/login/staff';
      const payload = tab === 'user'
        ? { email: form.email, password: form.password }
        : { hospitalId: form.hospitalId, email: form.email, password: form.password };

      const res = await api.post(endpoint, payload);
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={styles.brandName}>MedCare</span>
        </div>
        <div style={styles.leftContent}>
          <h1 style={styles.hero}>Your health,<br/>our priority.</h1>
          <p style={styles.heroSub}>Personalized care, real-time insights, and AI-powered support.</p>
        </div>
        <div style={styles.leftBg} />
      </div>

      {/* Right panel */}
      <div style={styles.right}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your MedCare account</p>

          <div style={styles.tabs}>
            {['user', 'staff'].map(t => (
              <button key={t} style={{ ...styles.tabBtn, ...(tab === t ? styles.tabActive : {}) }} onClick={() => { setTab(t); setError(''); }}>
                {t === 'user' ? '👤 Patient' : '🏥 Staff'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {tab === 'staff' && (
              <div className="input-group">
                <label>Hospital ID</label>
                <input className="input" type="text" placeholder="e.g. @MedCare2024" value={form.hospitalId} onChange={set('hospitalId')} required />
              </div>
            )}
            <div className="input-group">
              <label>Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ marginTop: 4, justifyContent: 'center', padding: '13px 20px' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={styles.switchLink}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:       { display: 'flex', minHeight: '100vh', flexWrap: 'wrap' },
  left:       { flex: '1 1 350px', background: 'linear-gradient(145deg, #0369a1 0%, #0ea5e9 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', position: 'relative', overflow: 'hidden' },
  brand:      { display: 'flex', alignItems: 'center', gap: 10, zIndex: 1 },
  logo:       { width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' },
  brandName:  { fontSize: 20, fontWeight: 700, color: 'white' },
  leftContent:{ zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  hero:       { fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 16 },
  heroSub:    { fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 320 },
  leftBg:     { position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' },
  right:      { flex: '1 1 450px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8fafc' },
  formCard:   { width: '100%', maxWidth: 400, background: 'white', borderRadius: 20, padding: '32px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' },
  title:      { fontSize: 24, fontWeight: 700, marginBottom: 4 },
  subtitle:   { fontSize: 14, color: '#64748b', marginBottom: 24 },
  tabs:       { display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 },
  tabBtn:     { flex: 1, padding: '8px', border: 'none', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500 },
  tabActive:  { background: 'white', color: '#0ea5e9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  error:      { background: '#fef2f2', color: '#b91c1c', padding: '10px', borderRadius: 8, fontSize: 13 },
  switchLink: { textAlign: 'center', marginTop: 20, fontSize: 13 },
};