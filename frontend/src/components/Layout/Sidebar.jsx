import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const NAV_ITEMS = [
  { to: '/dashboard/content', label: 'Home', icon: '🏠', roles: ['user', 'doctor', 'nurse'] },
  { to: '/dashboard/patient-info', label: 'Profile', icon: '👤', roles: ['user', 'doctor', 'nurse'] },
  { to: '/dashboard/admin', label: 'Admin', icon: '⚙️', roles: ['doctor', 'nurse'] },
  { to: '/dashboard/chatbot', label: 'Chat', icon: '💬', roles: ['user', 'doctor', 'nurse'] },
];

export default function Sidebar() {
  const { user } = useAuth();
  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  return (
    <aside style={styles.sidebar} className="sidebar-root">
      {/* Forcing the bar to the bottom on mobile screens */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-root {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            top: auto !important; /* This cancels the top: 64px from desktop */
            width: 100% !important;
            height: 65px !important;
            flex-direction: row !important;
            padding: 0 !important;
            border-right: none !important;
            border-top: 1px solid #eee !important;
            background: white !important;
            z-index: 10000 !important;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.05) !important;
          }
          .sidebar-nav {
            flex-direction: row !important;
            width: 100% !important;
            justify-content: space-around !important;
            gap: 0 !important;
          }
          .nav-item {
            flex-direction: column !important;
            padding: 8px !important;
            flex: 1 !important;
            gap: 2px !important;
            border-radius: 0 !important;
          }
          .nav-label {
            font-size: 10px !important;
            margin: 0 !important;
          }
          .sidebar-footer { display: none !important; }
        }
      `}</style>

      <nav style={styles.nav} className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
            className="nav-item"
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span style={styles.navLabel} className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.sidebarFooter} className="sidebar-footer">
        <span style={{ fontSize: 11, color: '#94a3b8' }}>MedCare v1.0</span>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: { width: '240px', background: 'white', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 12px', position: 'sticky', top: '64px', height: 'calc(100vh - 64px)' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  navItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, textDecoration: 'none', color: '#64748b', fontSize: 14, fontWeight: 500, transition: '0.2s', textAlign: 'center' },
  navItemActive: { background: '#f0f9ff', color: '#0ea5e9' },
  navIcon: { fontSize: '20px' },
  navLabel: { flex: 1 },
  sidebarFooter: { padding: '16px', borderTop: '1px solid #eee', textAlign: 'center' }
};