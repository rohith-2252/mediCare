import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../utils/api.js';

export default function PatientInfo() {
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patient/my-details')
      .then(res => setDetails(res.data.details))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div className="animate-fadeUp">
      <style>{`
        @media (max-width: 600px) {
          .profile-card { flex-direction: column !important; text-align: center; }
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={styles.profileCard} className="profile-card">
        <div style={styles.avatarLg}>{user?.name?.[0]}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>{user?.name}</h2>
          <p style={{ color: '#64748b', margin: '4px 0' }}>{user?.medId}</p>
          <span style={styles.statusBadge}>{details?.currentStatus || 'Stable'}</span>
        </div>
      </div>

      <div style={styles.grid} className="info-grid">
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🩺 Vitals</h3>
          <div style={styles.vitalRow}>
            <span>Glucose</span>
            <b>{details?.bloodGlucose || '--'} mg/dL</b>
          </div>
          <div style={styles.vitalRow}>
            <span>Pressure</span>
            <b>{details?.pressure || '--'}</b>
          </div>
        </div>

        <div style={{ ...styles.card, gridColumn: '1 / -1' }}>
          <h3 style={styles.cardTitle}>📋 Medical Report</h3>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{details?.medicalReport || 'No report yet.'}</p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🔬 Tests</h3>
          <p style={{ fontSize: 14 }}>{details?.testsDone || 'None'}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  profileCard: { background: '#f0f9ff', borderRadius: 16, padding: '24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, border: '1px solid #bae6fd' },
  avatarLg: { width: 60, height: 60, borderRadius: '50%', background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 },
  statusBadge: { padding: '4px 12px', background: '#dcfce7', color: '#15803d', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 },
  card: { background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #eee' },
  cardTitle: { fontSize: 16, margin: '0 0 16px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' },
  vitalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }
};