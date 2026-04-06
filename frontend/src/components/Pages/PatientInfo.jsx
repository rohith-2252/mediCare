import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../utils/api.js';

const STATUS_STYLE = {
  stable:   { bg: '#dcfce7', color: '#15803d', label: 'Stable' },
  critical: { bg: '#fee2e2', color: '#b91c1c', label: 'Critical' },
  moderate: { bg: '#fef9c3', color: '#a16207', label: 'Moderate' },
  recovery: { bg: '#e0f2fe', color: '#0369a1', label: 'Recovery' },
};

export default function PatientInfo() {
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get('/patient/my-details')
      .then(res => { setDetails(res.data.details); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const status = STATUS_STYLE[details?.currentStatus?.toLowerCase()] || STATUS_STYLE.stable;

  if (loading) return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      <div className="spinner spinner-dark" style={{ width: 36, height: 36 }} />
    </div>
  );

  return (
    <div className="animate-fadeUp">
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Patient Information</h1>
          <p style={styles.pageSub}>Your complete medical profile and records</p>
        </div>
        <span className="med-id" style={{ fontSize: 14, padding: '6px 14px' }}>{user?.medId}</span>
      </div>

      {/* Patient card */}
      <div style={styles.profileCard}>
        <div style={styles.avatarLg}>
          {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div style={styles.profileMeta}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{user?.name}</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 10 }}>{user?.email}</p>
          {details?.currentStatus && (
            <span style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
              ● {status.label}
            </span>
          )}
        </div>
      </div>

      {!details ? (
        <div style={styles.emptyState}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3, marginBottom: 16 }}>
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#0ea5e9" strokeWidth="2"/>
          </svg>
          <h3 style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>No records yet</h3>
          <p style={{ fontSize: 14, color: 'var(--text-light)', textAlign: 'center', maxWidth: 300 }}>
            Your doctor will update your medical records here after your consultation.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          <InfoCard title="Diagnosis & Domain" icon="🩺">
            <Field label="Medical Domain" value={details.domain} />
            <Field label="Doctor Handling" value={details.doctorHandling} />
            <Field label="Emergency Contact" value={details.contact} />
          </InfoCard>

          <InfoCard title="Vital Signs" icon="❤️">
            <VitalBar label="Blood Glucose" value={details.bloodGlucose} unit="mg/dL" color="#f59e0b" max={300} />
            <VitalBar label="Blood Pressure" value={details.pressure} unit="mmHg" color="#ef4444" max={200} />
          </InfoCard>

          <InfoCard title="Medical Report" icon="📋" wide>
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {details.medicalReport || 'No report available.'}
            </p>
          </InfoCard>

          <InfoCard title="Tests & Diagnostics" icon="🔬">
            <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>
              {details.testsDone || 'No tests recorded.'}
            </p>
          </InfoCard>

          <InfoCard title="Imaging / Scans" icon="🖼️">
            {details.scanType && <Field label="Scan Type" value={details.scanType} />}
            {details.scanImagePath ? (
              <div style={styles.scanContainer}>
                <img src={(import.meta.env.VITE_API_URL || '') + details.scanImagePath} alt="Scan" style={styles.scanImg}
                  onError={e => e.target.style.display = 'none'} />
                <a href={(import.meta.env.VITE_API_URL || '') + details.scanImagePath} target="_blank" rel="noopener noreferrer"
                  style={styles.viewScan}>View full scan →</a>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-light)' }}>No scan uploaded yet.</p>
            )}
          </InfoCard>

          <InfoCard title="Last Updated" icon="🕐">
            <Field label="Updated by" value={details.updatedBy} />
            <Field label="Date" value={details.lastUpdated ? new Date(details.lastUpdated).toLocaleString() : '—'} />
          </InfoCard>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, icon, children, wide }) {
  return (
    <div className="card" style={{ ...(wide ? { gridColumn: '1 / -1' } : {}), ...cardStyle }}>
      <h3 style={styles.cardTitle}><span>{icon}</span> {title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{value || '—'}</p>
    </div>
  );
}

function VitalBar({ label, value, unit, color, max }) {
  const num = parseFloat(value) || 0;
  const pct = Math.min((num / max) * 100, 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color }}>{value || '—'} <span style={{ fontWeight: 400, fontSize: 11 }}>{value ? unit : ''}</span></span>
      </div>
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

const cardStyle = { transition: 'box-shadow 0.2s' };

const styles = {
  pageHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  pageTitle:    { fontSize: 26, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px', marginBottom: 4 },
  pageSub:      { fontSize: 14, color: 'var(--text-muted)' },
  profileCard:  { background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border: '1px solid #bae6fd', borderRadius: 18, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 },
  avatarLg:     { width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, flexShrink: 0 },
  profileMeta:  { flex: 1 },
  statusBadge:  { display: 'inline-block', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 99 },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
  cardTitle:    { fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  emptyState:   { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', background: 'white', borderRadius: 18, border: '1px dashed var(--border)' },
  scanContainer:{ display: 'flex', flexDirection: 'column', gap: 8 },
  scanImg:      { width: '100%', borderRadius: 8, maxHeight: 160, objectFit: 'cover' },
  viewScan:     { fontSize: 13, color: 'var(--primary)', fontWeight: 500 },
};
