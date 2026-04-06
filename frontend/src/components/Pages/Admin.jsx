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
  }, [isStaff]);

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
    setSaving(true); setError(''); setSuccess('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (scanFile) fd.append('scan', scanFile);
      await api.post(`/admin/patient/${selected}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Updated successfully!');
      setScanFile(null);
      api.get('/patient/all').then(res => setPatients(res.data.patients || []));
    } catch (err) { setError(err.message); } 
    finally { setSaving(false); }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.medId.toLowerCase().includes(search.toLowerCase()));

  if (!isStaff) return <div style={styles.denied}><h2>Staff Access Only</h2></div>;

  return (
    <div className="animate-fadeUp" style={styles.layout}>
      <style>{`
        @media (max-width: 900px) {
          .admin-layout { flex-direction: column !important; height: auto !important; }
          .admin-list { width: 100% !important; max-height: 300px; }
          .admin-form-row { grid-template-columns: 1fr !important; }
          .admin-edit-panel { padding: 16px !important; }
        }
      `}</style>

      <div style={styles.listPanel} className="admin-list">
        <div style={styles.listHeader}>
          <h2 style={styles.panelTitle}>Patients ({patients.length})</h2>
        </div>
        <div style={styles.searchWrap}>
          <input className="input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 13 }} />
        </div>
        <div style={styles.patientList}>
          {filtered.map(p => (
            <button key={p.medId} onClick={() => loadPatient(p.medId)} style={{ ...styles.patientItem, ...(selected === p.medId ? styles.patientItemActive : {}) }}>
              <div style={styles.miniAvatar}>{p.name[0]}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{p.medId}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.editPanel} className="admin-edit-panel">
        {!selected ? <div style={styles.selectPrompt}>Select a patient to edit</div> : (
          <form onSubmit={handleSave} style={styles.editForm}>
            <h2 style={styles.panelTitle}>Edit: {details?.user?.name}</h2>
            <div style={styles.formRow} className="admin-form-row">
              <div className="input-group"><label>Condition</label><input className="input" value={form.domain} onChange={set('domain')} /></div>
              <div className="input-group"><label>Status</label>
                <select className="input" value={form.currentStatus} onChange={set('currentStatus')}>
                  <option value="stable">Stable</option><option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div style={styles.formRow} className="admin-form-row">
              <div className="input-group"><label>Glucose</label><input className="input" type="number" value={form.bloodGlucose} onChange={set('bloodGlucose')} /></div>
              <div className="input-group"><label>Pressure</label><input className="input" value={form.pressure} onChange={set('pressure')} /></div>
            </div>
            <div className="input-group"><label>Report Summary</label><textarea className="input" rows={4} value={form.medicalReport} onChange={set('medicalReport')} /></div>
            <div className="input-group"><label>Upload Scan</label><input type="file" onChange={e => setScanFile(e.target.files[0])} /></div>
            {success && <div style={styles.successMsg}>{success}</div>}
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Records'}</button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', gap: 20, height: 'calc(100vh - 150px)' },
  listPanel: { width: 260, background: 'white', borderRadius: 12, border: '1px solid #eee', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  listHeader: { padding: '16px', borderBottom: '1px solid #eee' },
  panelTitle: { fontSize: 16, fontWeight: 700, margin: 0 },
  searchWrap: { padding: '10px' },
  patientList: { flex: 1, overflowY: 'auto', padding: '10px' },
  patientItem: { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: 4 },
  patientItemActive: { background: '#f0f9ff', color: '#0ea5e9' },
  miniAvatar: { width: 30, height: 30, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 },
  editPanel: { flex: 1, background: 'white', borderRadius: 12, border: '1px solid #eee', padding: '24px', overflowY: 'auto' },
  editForm: { display: 'flex', flexDirection: 'column', gap: 16 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  selectPrompt: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' },
  successMsg: { padding: '10px', background: '#dcfce7', color: '#15803d', borderRadius: 8, fontSize: 13 },
  denied: { textAlign: 'center', padding: '50px' }
};