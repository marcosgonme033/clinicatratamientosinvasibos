import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <div style={styles.brandSection}>
          <div style={styles.logoCircle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={styles.logoIcon}>
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 style={styles.title}>Clínica Médica</h1>
            <p style={styles.subtitle}>Tratamientos Invasivos</p>
          </div>
        </div>
        <div style={styles.userInfo}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={styles.userDetails}>
              <span style={styles.userName}>{user?.name}</span>
              <span style={styles.userRole}>
                {user?.role === 'admin' ? '👑 Administrador' : '🏥 Clínica'}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={styles.logoutBtn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #0066cc 0%, #004c99 100%)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '20px 0',
    marginBottom: '40px',
    position: 'relative'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  logoCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255, 255, 255, 0.2)'
  },
  logoIcon: {
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '-0.5px',
    marginBottom: '2px'
  },
  subtitle: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    letterSpacing: '0.5px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '8px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.15)'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #00a67e 0%, #008566 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  userName: {
    fontWeight: '600',
    fontSize: '14px',
    color: 'white'
  },
  userRole: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '12px',
    fontWeight: '500'
  },
  logoutBtn: {
    fontSize: '13px'
  }
};

export default Navbar;
