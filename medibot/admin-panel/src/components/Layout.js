import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { admin, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/appointments', label: 'Appointments' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/clinics', label: 'Clinics' },
    { path: '/schedule', label: 'Schedule' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.logo}>MediBot Admin</div>
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navLink,
                ...(location.pathname === item.path ? styles.activeLink : {}),
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div style={styles.main}>
        <header style={styles.header}>
          <span>Welcome, {admin?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </header>
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1a237e',
    color: '#fff',
    padding: '20px 0',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '0 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 0',
  },
  navLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    padding: '12px 20px',
    transition: 'all 0.2s',
  },
  activeLink: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderLeft: '3px solid #64b5f6',
  },
  main: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#ef5350',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    padding: '30px',
  },
};

export default Layout;
