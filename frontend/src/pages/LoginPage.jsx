import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/clientes');
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        if (status === 401) {
          setError(message || 'Email o contraseña incorrectos');
        } else if (status === 400) {
          setError(message || 'Datos inválidos');
        } else if (status === 500) {
          setError('Error del servidor. Por favor, contacte al administrador.');
        } else {
          setError(message || 'Error al iniciar sesión');
        }
      } else if (err.request) {
        setError('No se pudo conectar con el servidor');
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Fondo con gradiente y patrón */}
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.loginBox}>
        {/* Logo y Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <svg style={styles.logo} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 style={styles.title}>Clínica Tratamientos Invasivos</h1>
          <p style={styles.subtitle}>Sistema de Gestión Médica</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.errorBox}>
              <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <div style={styles.inputContainer}>
              <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="ejemplo@clinica.com"
                required
                autoFocus
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputContainer}>
              <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePassword}
              >
                {showPassword ? (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg style={styles.spinner} viewBox="0 0 24 24">
                  <circle style={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
                <svg style={styles.submitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Sistema seguro con encriptación de extremo a extremo
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    opacity: 0.4
  },
  loginBox: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    padding: '48px',
    maxWidth: '440px',
    width: '100%',
    position: 'relative',
    animation: 'fadeIn 0.6s ease-out',
    backdropFilter: 'blur(10px)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  logoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    marginBottom: '24px',
    boxShadow: '0 10px 25px rgba(102, 126, 234, 0.4)'
  },
  logo: {
    width: '48px',
    height: '48px',
    color: '#ffffff'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px',
    lineHeight: '1.2'
  },
  subtitle: {
    fontSize: '15px',
    color: '#718096',
    fontWeight: '500',
    letterSpacing: '0.5px'
  },
  form: {
    marginBottom: '24px'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
    letterSpacing: '0.3px'
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    width: '20px',
    height: '20px',
    color: '#a0aec0',
    pointerEvents: 'none',
    zIndex: 1
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#f7fafc',
    color: '#2d3748',
    fontFamily: 'inherit'
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a0aec0',
    transition: 'color 0.2s ease',
    borderRadius: '6px'
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    marginTop: '32px',
    letterSpacing: '0.5px'
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  submitIcon: {
    width: '20px',
    height: '20px'
  },
  spinner: {
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite'
  },
  spinnerCircle: {
    opacity: 0.25,
    fill: 'none'
  },
  spinnerPath: {
    opacity: 0.75
  },
  errorBox: {
    backgroundColor: '#fed7d7',
    border: '1px solid #fc8181',
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#c53030',
    fontSize: '14px',
    fontWeight: '500',
    animation: 'fadeIn 0.3s ease-out'
  },
  errorIcon: {
    width: '20px',
    height: '20px',
    flexShrink: 0
  },
  footer: {
    textAlign: 'center',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0'
  },
  footerText: {
    fontSize: '13px',
    color: '#718096',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  }
};

export default LoginPage;
