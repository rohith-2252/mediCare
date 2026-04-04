import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../utils/api.js';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [tab, setTab]       = useState('user'); // 'user' | 'staff'
  const [form, setForm]     = useState({ email: '', password: '', hospitalId: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = tab === 'user' ? '/auth/login/user' : '/auth/login/staff';
      const payload  = tab === 'user'
        ? { email: form.email, password: form.password }
        : { hospitalId: form.hospitalId, email: form.email, password: form.password };

      const res = await api.post(endpoint, payload);
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
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
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={styles.brandName}>MedCare</span>
        </div>
        <div style={styles.leftContent}>
          <h1 style={styles.hero}>Your health,<br/>our priority.</h1>
          <p style={styles.heroSub}>Personalized care, real-time insights, and AI-powered support — all in one place.</p>
          <div style={styles.features}>
            {['AI Health Assistant', 'Real-time Patient Records', 'Secure & Private'].map(f => (
              <div key={f} style={styles.featureItem}>
                <div style={styles.featureDot} />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.leftBg} />
      </div>

      {/* Right panel */}
      <div style={styles.right}>
        <div style={styles.formCard} className="animate-fadeUp">
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your MedCare account</p>

          {/* Tab switcher */}
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
              {loading ? <><div className="spinner" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <p style={styles.switchLink}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:       { display: 'flex', minHeight: '100vh' },
  left:       { flex: 1, background: 'linear-gradient(145deg, #0369a1 0%, #0ea5e9 50%, #06b6d4 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 48px', position: 'relative', overflow: 'hidden', minHeight: '100vh' },
  brand:      { display: 'flex', alignItems: 'center', gap: 10, zIndex: 1, position: 'relative' },
  logo:       { width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' },
  brandName:  { fontSize: 22, fontWeight: 700, color: 'white', letterSpacing: '-0.3px' },
  leftContent:{ zIndex: 1, position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  hero:       { fontSize: 42, fontWeight: 700, color: 'white', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 16 },
  heroSub:    { fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: 320, marginBottom: 32 },
  features:   { display: 'flex', flexDirection: 'column', gap: 10 },
  featureItem:{ display: 'flex', alignItems: 'center', gap: 10 },
  featureDot: { width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', flexShrink: 0 },
  leftBg:     { position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' },
  right:      { width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg)' },
  formCard:   { width: '100%', maxWidth: 400, background: 'white', borderRadius: 20, padding: '36px 32px', boxShadow: '0 8px 48px rgba(14,165,233,0.12)', border: '1px solid var(--border)' },
  title:      { fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.3px' },
  subtitle:   { fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 },
  tabs:       { display: 'flex', background: 'var(--surface2)', borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 },
  tabBtn:     { flex: 1, padding: '8px 12px', border: 'none', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', fontFamily: 'var(--font)', transition: 'all 0.2s' },
  tabActive:  { background: 'white', color: 'var(--primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  error:      { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  switchLink: { textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' },
};
