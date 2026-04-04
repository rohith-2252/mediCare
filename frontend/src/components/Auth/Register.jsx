import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../utils/api.js';

const FIELDS_USER = [
  { key: 'name',     label: 'Full Name',     type: 'text',     placeholder: 'John Doe' },
  { key: 'phone',    label: 'Phone Number',  type: 'tel',      placeholder: '+91 9876543210' },
  { key: 'email',    label: 'Email',         type: 'email',    placeholder: 'you@example.com' },
  { key: 'password', label: 'Password',      type: 'password', placeholder: 'Min 8 characters' },
  { key: 'dob',      label: 'Date of Birth', type: 'date',     placeholder: '' },
];

const FIELDS_STAFF = [
  { key: 'hospitalId', label: 'Hospital ID',   type: 'text',     placeholder: '@MedCare2024' },
  { key: 'name',       label: 'Full Name',     type: 'text',     placeholder: 'Dr. Smith' },
  { key: 'phone',      label: 'Phone Number',  type: 'tel',      placeholder: '+91 9876543210' },
  { key: 'email',      label: 'Email',         type: 'email',    placeholder: 'doctor@hospital.com' },
  { key: 'password',   label: 'Password',      type: 'password', placeholder: 'Min 8 characters' },
  { key: 'dob',        label: 'Date of Birth', type: 'date',     placeholder: '' },
  { key: 'specialty',  label: 'Specialty',     type: 'text',     placeholder: 'e.g. Cardiology' },
];

export default function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [tab, setTab]     = useState('user');
  const [form, setForm]   = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password && form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const endpoint = tab === 'user' ? '/auth/register/user' : '/auth/register/staff';
      const payload  = { ...form, gender: form.gender || 'other', role: form.role || 'doctor' };
      const res = await api.post(endpoint, payload);
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = tab === 'user' ? FIELDS_USER : FIELDS_STAFF;

  return (
    <div style={styles.page}>
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
          <h1 style={styles.hero}>Join MedCare<br/>today.</h1>
          <p style={styles.heroSub}>Get access to your personalized health dashboard, AI assistant, and real-time medical records.</p>
          <div style={styles.infoBox}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500, marginBottom: 6 }}>🔐 Your unique MedID</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              After registration, you will receive a unique <strong>MED-XXXXXX</strong> ID that securely identifies you across all hospital systems.
            </p>
          </div>
        </div>
        <div style={styles.leftBg} />
      </div>

      <div style={styles.right}>
        <div style={styles.formCard} className="animate-fadeUp">
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Fill in your details to get started</p>

          <div style={styles.tabs}>
            {['user', 'staff'].map(t => (
              <button key={t} style={{ ...styles.tabBtn, ...(tab === t ? styles.tabActive : {}) }}
                onClick={() => { setTab(t); setForm({}); setError(''); }}>
                {t === 'user' ? '👤 Patient' : '🏥 Staff'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={styles.formGrid}>
            {fields.map(f => (
              <div key={f.key} className="input-group" style={f.key === 'name' || f.key === 'email' ? { gridColumn: '1 / -1' } : {}}>
                <label>{f.label}</label>
                <input className="input" type={f.type} placeholder={f.placeholder} value={form[f.key] || ''} onChange={set(f.key)} required={f.key !== 'specialty'} />
              </div>
            ))}

            {/* Gender */}
            <div className="input-group">
              <label>Gender</label>
              <select className="input" value={form.gender || ''} onChange={set('gender')} required>
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Role (staff only) */}
            {tab === 'staff' && (
              <div className="input-group">
                <label>Role</label>
                <select className="input" value={form.role || 'doctor'} onChange={set('role')}>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                </select>
              </div>
            )}

            {error && <div style={{ ...styles.error, gridColumn: '1 / -1' }}>{error}</div>}

            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ gridColumn: '1 / -1', justifyContent: 'center', padding: '13px 20px', marginTop: 4 }}>
              {loading ? <><div className="spinner" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p style={styles.switchLink}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
              Sign in
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
  logo:       { width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName:  { fontSize: 22, fontWeight: 700, color: 'white' },
  leftContent:{ zIndex: 1, position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  hero:       { fontSize: 38, fontWeight: 700, color: 'white', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 16 },
  heroSub:    { fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, maxWidth: 300, marginBottom: 28 },
  infoBox:    { background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' },
  leftBg:     { position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' },
  right:      { width: 560, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg)', overflowY: 'auto' },
  formCard:   { width: '100%', maxWidth: 500, background: 'white', borderRadius: 20, padding: '36px 32px', boxShadow: '0 8px 48px rgba(14,165,233,0.12)', border: '1px solid var(--border)' },
  title:      { fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.3px' },
  subtitle:   { fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 },
  tabs:       { display: 'flex', background: 'var(--surface2)', borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 },
  tabBtn:     { flex: 1, padding: '8px 12px', border: 'none', borderRadius: 8, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', fontFamily: 'var(--font)', transition: 'all 0.2s' },
  tabActive:  { background: 'white', color: 'var(--primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  formGrid:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  error:      { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  switchLink: { textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' },
};
