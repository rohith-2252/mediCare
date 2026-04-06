import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';

export default function Header({ hospitalName = 'MedCare Hospital' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header style={styles.header}>
      <style>{`
        @media (max-width: 768px) {
          .desktop-profile-info, .hospital-name-badge { display: none !important; }
          .header-container { padding: 0 16px !important; }
        }
        /* Simple animation for the dropdown */
        .profile-menu {
          animation: slideIn 0.2s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Logo Area */}
      <div style={styles.logoArea}>
        <div style={styles.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={styles.logoText}>MedCare</span>
      </div>

      {/* Hospital Name (Hidden on mobile) */}
      <div style={styles.hospitalName} className="hospital-name-badge">
        <span>{hospitalName}</span>
      </div>

      {/* Profile Section */}
      <div style={{ position: 'relative' }}>
        <div 
          style={styles.profileTrigger} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {/* Info shown only on Desktop */}
          <div style={styles.profileInfo} className="desktop-profile-info">
            <span style={styles.profileName}>{user?.name}</span>
            <span style={styles.roleBadge}>{user?.role}</span>
          </div>
          
          {/* Avatar (The clickable part) */}
          <div style={styles.avatar}>{initials}</div>
        </div>

        {/* Mobile/Desktop Dropdown Menu */}
        {menuOpen && (
          <div style={styles.dropdown} className="profile-menu">
            <div style={styles.menuHeader}>
              <p style={styles.menuName}>{user?.name}</p>
              <p style={styles.menuDetail}>{user?.email}</p>
              {user?.medId && (
                <span style={styles.medIdBadge}>ID: {user.medId}</span>
              )}
            </div>
            
            <div style={styles.menuDivider} />
            
            <button onClick={handleLogout} style={styles.menuLogoutBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Click-away backdrop to close menu */}
      {menuOpen && (
        <div 
          style={styles.backdrop} 
          onClick={() => setMenuOpen(false)} 
        />
      )}
    </header>
  );
}

const styles = {
  header: {
    height: '64px',
    background: 'white',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  },
  logoArea: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: { width: 34, height: 34, background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 18, fontWeight: 700, color: '#1e293b' },
  hospitalName: { background: '#f0f9ff', color: '#0369a1', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500 },
  
  // Profile Trigger
  profileTrigger: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '4px', borderRadius: '8px' },
  profileInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  profileName: { fontSize: 14, fontWeight: 600 },
  roleBadge: { fontSize: 10, opacity: 0.6, textTransform: 'uppercase' },
  avatar: { width: 38, height: 38, borderRadius: '50%', background: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 },

  // Dropdown Menu
  dropdown: {
    position: 'absolute',
    top: '50px',
    right: 0,
    width: '220px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
    padding: '16px',
    zIndex: 1001,
  },
  menuHeader: { display: 'flex', flexDirection: 'column', gap: 4 },
  menuName: { margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' },
  menuDetail: { margin: 0, fontSize: 12, color: '#64748b', wordBreak: 'break-all' },
  medIdBadge: { display: 'inline-block', marginTop: 8, padding: '4px 8px', background: '#f1f5f9', borderRadius: '6px', fontSize: 11, fontWeight: 600, color: '#475569', fontFamily: 'monospace' },
  menuDivider: { height: '1px', background: '#f1f5f9', margin: '12px 0' },
  menuLogoutBtn: { 
    width: '100%', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    padding: '10px', 
    background: '#fef2f2', 
    border: '1px solid #fee2e2', 
    borderRadius: '8px', 
    color: '#ef4444', 
    fontSize: 13, 
    fontWeight: 600, 
    cursor: 'pointer' 
  },
  backdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }
};