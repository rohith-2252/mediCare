import { useAuth } from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';

export default function Header({ hospitalName = 'MedCare Hospital' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const roleLabel = { user: 'Patient', doctor: 'Doctor', nurse: 'Nurse' }[user?.role] || user?.role;
  const roleBadgeColor = user?.role === 'user' ? '#dbeafe' : '#dcfce7';
  const roleBadgeText  = user?.role === 'user' ? '#1d4ed8' : '#15803d';

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logoArea}>
        <div style={styles.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={styles.logoText}>MedCare</span>
      </div>

      {/* Hospital Name */}
      <div style={styles.hospitalName}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#0369a1" strokeWidth="2"/>
          <polyline points="9,22 9,12 15,12 15,22" stroke="#0369a1" strokeWidth="2"/>
        </svg>
        <span>{hospitalName}</span>
      </div>

      {/* User Profile */}
      <div style={styles.profile}>
        <div style={styles.profileInfo}>
          <span style={styles.profileName}>{user?.name}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ ...styles.roleBadge, background: roleBadgeColor, color: roleBadgeText }}>
              {roleLabel}
            </span>
            {user?.medId && <span className="med-id">{user.medId}</span>}
          </div>
        </div>
        <div style={styles.avatar}>{initials}</div>
        <button onClick={handleLogout} style={styles.logoutBtn} title="Sign out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 'var(--header-h)',
    background: 'white',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 8px rgba(14,165,233,0.06)',
  },
  logoArea:     { display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 },
  logoIcon:     { width: 36, height: 36, background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText:     { fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' },
  hospitalName: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500, color: '#0369a1', background: 'var(--primary-light)', padding: '8px 16px', borderRadius: 99, border: '1px solid #bae6fd' },
  profile:      { display: 'flex', alignItems: 'center', gap: 12, minWidth: 140, justifyContent: 'flex-end' },
  profileInfo:  { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 },
  profileName:  { fontSize: 14, fontWeight: 600, color: 'var(--text)' },
  roleBadge:    { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, letterSpacing: '0.4px', textTransform: 'uppercase' },
  avatar:       { width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, animation: 'pulse-ring 2s ease infinite' },
  logoutBtn:    { width: 34, height: 34, borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', transition: 'all 0.2s' },
};
