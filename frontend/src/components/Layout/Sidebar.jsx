import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const NAV_ITEMS = [
  {
    to: '/dashboard/content',
    label: 'Content',
    roles: ['user', 'doctor', 'nurse'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 10h16M4 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <rect x="14" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/patient-info',
    label: 'Patient Info',
    roles: ['user', 'doctor', 'nurse'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/admin',
    label: 'Admin',
    roles: ['doctor', 'nurse'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/chatbot',
    label: 'AI Chat Bot',
    roles: ['user', 'doctor', 'nurse'],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="10" r="1" fill="currentColor"/>
        <circle cx="12" cy="10" r="1" fill="currentColor"/>
        <circle cx="15" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { user } = useAuth();

  const visibleItems = NAV_ITEMS.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <aside style={styles.sidebar}>
      <nav style={styles.nav}>
        {visibleItems.map((item, idx) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
              animationDelay: `${idx * 60}ms`,
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{
                  ...styles.navIcon,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                }}>
                  {item.icon}
                </span>
                <span style={styles.navLabel}>{item.label}</span>
                {isActive && <div style={styles.activeDot} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={styles.sidebarFooter}>
        <div style={styles.footerInfo}>
          <div style={styles.footerDot} />
          <span style={{ fontSize: 11, color: 'var(--text-light)' }}>System Online</span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
          MedCare v1.0.0
        </p>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-w)',
    background: 'white',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px 12px',
    flexShrink: 0,
    position: 'sticky',
    top: 'var(--header-h)',
    height: 'calc(100vh - var(--header-h))',
    overflowY: 'auto',
  },
  nav:           { display: 'flex', flexDirection: 'column', gap: 4 },
  navItem:       {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
    borderRadius: 10, textDecoration: 'none', color: 'var(--text-muted)',
    fontSize: 14, fontWeight: 500, transition: 'all 0.2s', position: 'relative',
    animation: 'fadeUp 0.4s ease both',
  },
  navItemActive: { background: 'var(--primary-light)', color: 'var(--primary-dark)' },
  navIcon:       { display: 'flex', alignItems: 'center', flexShrink: 0 },
  navLabel:      { flex: 1 },
  activeDot:     { width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' },
  sidebarFooter: { padding: '12px 14px', borderTop: '1px solid var(--border)' },
  footerInfo:    { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 },
  footerDot:     { width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulse-ring 2s ease infinite' },
};
