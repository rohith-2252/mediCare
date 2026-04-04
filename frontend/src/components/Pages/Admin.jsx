import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import api from '../../utils/api.js';

export default function AdminPage() {
  const { user } = useAuth();
  const [patients, setPatients]     = useState([]);
  const [selected, setSelected]     = useState(null);
  const [details, setDetails]       = useState(null);
  const [form, setForm]             = useState({});
  const [scanFile, setScanFile]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [search, setSearch]         = useState('');
  const [success, setSuccess]       = useState('');
  const [error, setError]           = useState('');

  const isStaff = ['doctor', 'nurse'].includes(user?.role);

  useEffect(() => {
    if (!isStaff) return;
    api.get('/patient/all')
      .then(res => setPatients(res.data.patients || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadPatient = async (medId) => {
    setSelected(medId);
    setSuccess('');
    setError('');
    try {
      const res = await api.get(`/patient/${medId}`);
      const d = res.data.details || {};
      setDetails(res.data);
      setForm({
        domain:          d.domain          || '',
        medicalReport:   d.medicalReport   || '',
        scanType:        d.scanType        || '',
        bloodGlucose:    d.bloodGlucose    || '',
        pressure:        d.pressure        || '',
        doctorHandling:  d.doctorHandling  || user.name,
        contact:         d.contact         || '',
        currentStatus:   d.currentStatus   || 'stable',
        testsDone:       d.testsDone       || '',
      });
    } catch { setError('Failed to load patient details'); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (scanFile) fd.append('scan', scanFile);

      await api.post(`/admin/patient/${selected}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Patient details updated successfully!');
      setScanFile(null);
      // Refresh list
      const res = await api.get('/patient/all');
      setPatients(res.data.patients || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.medId.toLowerCase().includes(search.toLowerCase())
  );

  if (!isStaff) {
    return (
      <div style={styles.denied}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginTop: 16 }}>Staff Access Only</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>This portal is for hospital doctors and nurses.</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeUp" style={styles.layout}>
      {/* Patient list panel */}
      <div style={styles.listPanel}>
        <div style={styles.listHeader}>
          <h2 style={styles.panelTitle}>Patients</h2>
          <span style={styles.countBadge}>{patients.length}</span>
        </div>
        <div style={styles.searchWrap}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input className="input" placeholder="Search by name or MedID…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, fontSize: 13 }} />
        </div>

        {loading ? (
          <div style={{ padding: 20 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 56, borderRadius: 8, marginBottom: 8 }} />
            ))}
          </div>
        ) : (
          <div style={styles.patientList}>
            {filtered.map(p => (
              <button key={p.medId} onClick={() => loadPatient(p.medId)}
                style={{ ...styles.patientItem, ...(selected === p.medId ? styles.patientItemActive : {}) }}>
                <div style={{ ...styles.miniAvatar, background: selected === p.medId ? 'var(--primary)' : 'var(--primary-light)', color: selected === p.medId ? 'white' : 'var(--primary)' }}>
                  {p.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                  <p style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text-light)' }}>{p.medId}</p>
                </div>
                {p.currentStatus && (
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 99, background: p.currentStatus === 'critical' ? '#fee2e2' : '#dcfce7', color: p.currentStatus === 'critical' ? '#b91c1c' : '#15803d' }}>
                    {p.currentStatus}
                  </span>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-light)', textAlign: 'center', padding: 20 }}>No patients found</p>
            )}
          </div>
        )}
      </div>

      {/* Edit panel */}
      <div style={styles.editPanel}>
        {!selected ? (
          <div style={styles.selectPrompt}>
            <div style={{ fontSize: 40 }}>👈</div>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 12 }}>Select a patient to edit their records</p>
          </div>
        ) : (
          <>
            <div style={styles.editHeader}>
              <div>
                <h2 style={styles.panelTitle}>{details?.user?.name}</h2>
                <span className="med-id">{selected}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Editing as {user.name}</span>
            </div>

            <form onSubmit={handleSave} style={styles.editForm}>
              <div style={styles.formRow}>
                <div className="input-group">
                  <label>Medical Domain / Condition</label>
                  <input className="input" placeholder="e.g. Diabetes, Hypertension" value={form.domain} onChange={set('domain')} />
                </div>
                <div className="input-group">
                  <label>Current Status</label>
                  <select className="input" value={form.currentStatus} onChange={set('currentStatus')}>
                    <option value="stable">Stable</option>
                    <option value="moderate">Moderate</option>
                    <option value="critical">Critical</option>
                    <option value="recovery">Recovery</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div className="input-group">
                  <label>Blood Glucose (mg/dL)</label>
                  <input className="input" type="number" placeholder="e.g. 110" value={form.bloodGlucose} onChange={set('bloodGlucose')} />
                </div>
                <div className="input-group">
                  <label>Blood Pressure (mmHg)</label>
                  <input className="input" placeholder="e.g. 120/80" value={form.pressure} onChange={set('pressure')} />
                </div>
              </div>

              <div style={styles.formRow}>
                <div className="input-group">
                  <label>Doctor Handling</label>
                  <input className="input" placeholder="Doctor name" value={form.doctorHandling} onChange={set('doctorHandling')} />
                </div>
                <div className="input-group">
                  <label>Emergency Contact</label>
                  <input className="input" placeholder="Phone number" value={form.contact} onChange={set('contact')} />
                </div>
              </div>

              <div className="input-group">
                <label>Tests Performed</label>
                <input className="input" placeholder="e.g. CBC, MRI, X-Ray, Urine Test" value={form.testsDone} onChange={set('testsDone')} />
              </div>

              <div className="input-group">
                <label>Medical Report / Summary</label>
                <textarea className="input" rows={5} placeholder="Write detailed medical notes, diagnosis, treatment plan..."
                  value={form.medicalReport} onChange={set('medicalReport')}
                  style={{ resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={styles.formRow}>
                <div className="input-group">
                  <label>Scan Type</label>
                  <select className="input" value={form.scanType} onChange={set('scanType')}>
                    <option value="">None</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="MRI">MRI</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Ultrasound">Ultrasound</option>
                    <option value="ECG">ECG</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Upload Scan Image / PDF</label>
                  <input type="file" accept="image/*,.pdf" onChange={e => setScanFile(e.target.files[0])}
                    style={{ ...styles.fileInput }} />
                  {scanFile && <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4 }}>📎 {scanFile.name}</p>}
                </div>
              </div>

              {success && <div style={styles.successMsg}>✅ {success}</div>}
              {error   && <div style={styles.errorMsg}>❌ {error}</div>}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner" /> Saving…</> : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  layout:          { display: 'flex', gap: 24, height: 'calc(100vh - var(--header-h) - 56px)', minHeight: 600 },
  listPanel:       { width: 280, background: 'white', borderRadius: 18, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 },
  listHeader:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 16px 12px', borderBottom: '1px solid var(--border)' },
  panelTitle:      { fontSize: 16, fontWeight: 700, color: 'var(--text)' },
  countBadge:      { background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 99 },
  searchWrap:      { padding: '12px 12px 8px', position: 'relative' },
  patientList:     { flex: 1, overflowY: 'auto', padding: '4px 8px 12px' },
  patientItem:     { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s', marginBottom: 2 },
  patientItemActive:{ background: 'var(--primary-light)' },
  miniAvatar:      { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  editPanel:       { flex: 1, background: 'white', borderRadius: 18, border: '1px solid var(--border)', padding: '24px 28px', overflowY: 'auto' },
  editHeader:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' },
  editForm:        { display: 'flex', flexDirection: 'column', gap: 16 },
  formRow:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  fileInput:       { width: '100%', padding: '9px 14px', fontSize: 13, color: 'var(--text-muted)', background: 'var(--surface2)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font)' },
  successMsg:      { background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  errorMsg:        { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  selectPrompt:    { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 },
  denied:          { textAlign: 'center', padding: '80px 20px' },
};
