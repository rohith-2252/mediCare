import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../utils/api.js';

const FIELDS_USER = [
  { key: 'name',     label: 'Full Name',    type: 'text',     placeholder: 'John Doe' },
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
  const navigate = useNavigate();

  const [tab, setTab] = useState('user');
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password?.length < 8) return setError('Password must be at least 8 characters');
    setLoading(true);
    try {
      const endpoint = tab === 'user' ? '/auth/register/user' : '/auth/register/staff';
      const payload = { ...form, gender: form.gender || 'other', role: form.role || 'doctor' };
      const res = await api.post(endpoint, payload);
      login(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = tab === 'user' ? FIELDS_USER : FIELDS_STAFF;

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.brand}>
          <div style={styles.logo}>🏥</div>
          <span style={styles.brandName}>MedCare</span>
        </div>
        <div style={styles.leftContent}>
          <h1 style={styles.hero}>Join MedCare<br/>today.</h1>
          <p style={styles.heroSub}>Access your records and AI health insights.</p>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Fill in your details to get started</p>

          <div style={styles.tabs}>
            {['user', 'staff'].map(t => (
              <button key={t} style={{ ...styles.tabBtn, ...(tab === t ? styles.tabActive : {}) }} onClick={() => { setTab(t); setForm({}); setError(''); }}>
                {t === 'user' ? '👤 Patient' : '🏥 Staff'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={styles.formGrid}>
            {fields.map(f => (
              <div key={f.key} className="input-group" style={(f.key === 'name' || f.key === 'email') ? { gridColumn: '1 / -1' } : {}}>
                <label>{f.label}</label>
                <input className="input" type={f.type} placeholder={f.placeholder} value={form[f.key] || ''} onChange={set(f.key)} required={f.key !== 'specialty'} />
              </div>
            ))}
            
            <div className="input-group">
              <label>Gender</label>
              <select className="input" value={form.gender || ''} onChange={set('gender')} required>
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

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

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ gridColumn: '1 / -1', padding: '13px' }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={styles.switchLink}>
            Already have an account? <Link to="/login" style={{ color: '#0ea5e9', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:       { display: 'flex', minHeight: '100vh', flexWrap: 'wrap' },
  left:       { flex: '1 1 350px', background: '#0ea5e9', display: 'flex', flexDirection: 'column', padding: '40px', color: 'white' },
  brand:      { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 },
  logo:       { fontSize: 24 },
  brandName:  { fontSize: 20, fontWeight: 700 },
  leftContent:{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  hero:       { fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, marginBottom: 16 },
  heroSub:    { fontSize: 15, opacity: 0.9 },
  right:      { flex: '1 1 500px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f8fafc' },
  formCard:   { width: '100%', maxWidth: 500, background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title:      { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  subtitle:   { fontSize: 14, color: '#64748b', marginBottom: 20 },
  tabs:       { display: 'flex', background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 },
  tabBtn:     { flex: 1, padding: '8px', border: 'none', borderRadius: 8, background: 'transparent', cursor: 'pointer' },
  tabActive:  { background: 'white', color: '#0ea5e9' },
  formGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  error:      { background: '#fef2f2', color: '#b91c1c', padding: '10px', borderRadius: 8, fontSize: 13 },
  switchLink: { textAlign: 'center', marginTop: 20, fontSize: 13 },
};