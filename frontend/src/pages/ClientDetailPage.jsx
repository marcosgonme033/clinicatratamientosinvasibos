import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import FacialDiagram from '../components/FacialDiagram';
import { clientService, sessionService } from '../services/services';
import { useAuth } from '../context/AuthContext';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const [formData, setFormData] = useState({
    fecha: '',
    profesional: '',
    tratamiento: '',
    zona: '',
    cantidad: '',
    observaciones: '',
    incidencias: '',
    proxima_revision: '',
    injection_points: [],
    face_view: 'front'
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientRes, sessionsRes] = await Promise.all([
        clientService.getById(id),
        clientService.getSessions(id)
      ]);
      setClient(clientRes.data);
      setSessions(sessionsRes.data);
      setError('');
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (session = null) => {
    if (session) {
      setEditingSession(session);
      // Parsear injection_points si es string
      let injectionPoints = [];
      if (session.injection_points) {
        if (typeof session.injection_points === 'string') {
          try {
            injectionPoints = JSON.parse(session.injection_points);
          } catch (e) {
            console.warn('Failed to parse injection_points:', e);
          }
        } else if (Array.isArray(session.injection_points)) {
          injectionPoints = session.injection_points;
        }
      }

      setFormData({
        fecha: session.fecha?.split('.')[0] || '',
        profesional: session.profesional,
        tratamiento: session.tratamiento,
        zona: session.zona,
        cantidad: session.cantidad || '',
        observaciones: session.observaciones || '',
        incidencias: session.incidencias || '',
        proxima_revision: session.proxima_revision?.split('T')[0] || '',
        injection_points: injectionPoints,
        face_view: session.face_view || 'front'
      });
    } else {
      setEditingSession(null);
      const now = new Date();
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setFormData({
        fecha: localDateTime,
        profesional: user?.name || '',
        tratamiento: '',
        zona: '',
        producto: '',
        lote: '',
        cantidad: '',
        cantidad_revision: '',
        injection_points: [],
        face_view: 'front'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSession(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calcular products_used a partir de injection_points
      const productsUsed = formData.injection_points.length > 0
        ? [...new Set(formData.injection_points.map(p => p.product).filter(Boolean))].sort().join(', ')
        : null;

      const data = {
        ...formData,
        client_id: parseInt(id),
        cantidad: formData.cantidad ? parseFloat(formData.cantidad) : null,
        injection_points: formData.injection_points, // Enviar como array, backend lo convertirá
        products_used: productsUsed
      };

      if (editingSession) {
        await sessionService.update(editingSession.id, data);
      } else {
        await sessionService.create(data);
      }

      handleCloseModal();
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar sesión');
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('¿Eliminar esta sesión?')) return;

    try {
      await sessionService.delete(sessionId);
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar sesión');
    }
  };

  const handleInjectionPointsChange = (points, faceView) => {
    setFormData({
      ...formData,
      injection_points: points,
      face_view: faceView
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loader">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  if (!client) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="alert alert-error">Cliente no encontrado</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <button onClick={() => navigate('/clientes')} className="btn btn-secondary" style={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver a Pacientes
        </button>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card" style={styles.clientCard}>
          <div style={styles.clientHeader}>
            <div style={styles.avatar}>
              {client.nombre?.charAt(0)}{client.apellidos?.charAt(0)}
            </div>
            <div style={styles.clientHeaderInfo}>
              <h1 style={styles.clientName}>
                {client.nombre} {client.apellidos}
              </h1>
              <div style={styles.expedienteInfo}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Expediente #{client.expediente}
              </div>
            </div>
          </div>
          
          <div style={styles.clientInfoGrid}>
            <div style={styles.infoCard}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.infoIcon}>
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <div style={styles.infoLabel}>Teléfono</div>
                <div style={styles.infoValue}>{client.telefono || 'No especificado'}</div>
              </div>
            </div>
            
            <div style={styles.infoCard}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.infoIcon}>
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div>
                <div style={styles.infoLabel}>Email</div>
                <div style={styles.infoValue}>{client.email || 'No especificado'}</div>
              </div>
            </div>
            
            {client.fecha_nacimiento && (
              <div style={styles.infoCard}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.infoIcon}>
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <div style={styles.infoLabel}>Fecha de Nacimiento</div>
                  <div style={styles.infoValue}>
                    {new Date(client.fecha_nacimiento).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {client.notas_generales && (
            <div style={styles.notasSection}>
              <div style={styles.notasHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <strong>Notas Generales</strong>
              </div>
              <p style={styles.notasText}>{client.notas_generales}</p>
            </div>
          )}
        </div>

        <div style={styles.sessionsHeader}>
          <div>
            <h2 style={styles.sessionsTitle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{marginRight: '8px'}}>
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Historial de Sesiones
            </h2>
            <p style={styles.sessionsSubtitle}>{sessions.length} sesiones registradas</p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn btn-primary" style={styles.addSessionBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nueva Sesión
          </button>
        </div>

        <div className="card" style={styles.sessionsCard}>
          {sessions.length === 0 ? (
            <div style={styles.emptyState}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={styles.emptyIcon}>
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3 style={styles.emptyTitle}>Sin sesiones registradas</h3>
              <p style={styles.emptyText}>Comienza agregando la primera sesión del paciente</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{marginTop: '16px'}}>
                Crear Primera Sesión
              </button>
            </div>
          ) : (
            <div style={styles.timeline}>
              {sessions.map((session) => (
                <div key={session.id} style={styles.sessionCard}>
                  <div style={styles.sessionIndicator}></div>
                  <div style={styles.sessionContent}>
                    <div style={styles.sessionHeader}>
                      <div>
                        <h3 style={styles.sessionTitle}>
                          <span style={styles.sessionBadge}>{session.tratamiento}</span>
                          <span style={styles.zonaBadge}>{session.zona}</span>
                        </h3>
                        <div style={styles.sessionDate}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          {formatDate(session.fecha)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenModal(session)}
                          className="btn btn-secondary"
                          style={styles.sessionBtn}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Editar
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(session.id)}
                            className="btn btn-danger"
                            style={styles.sessionBtn}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={styles.sessionDetails}>
                      <div style={styles.detailItem}>
                        <strong>Profesional:</strong> {session.profesional}
                      </div>
                      {session.cantidad && (
                        <div style={styles.detailItem}>
                          <strong>Cantidad:</strong> {session.cantidad} ml
                        </div>
                      )}
                      {session.observaciones && (
                        <div style={styles.detailItem}>
                          <strong>Observaciones:</strong> {session.observaciones}
                        </div>
                      )}
                      {session.incidencias && (
                        <div style={{...styles.detailItem, color: 'var(--warning)'}}>
                          <strong>Incidencias:</strong> {session.incidencias}
                        </div>
                      )}
                      {session.proxima_revision && (
                        <div style={{...styles.detailItem, color: 'var(--primary)'}}>
                          <strong>Próxima Revisión:</strong>{' '}
                          {new Date(session.proxima_revision).toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingSession ? 'Editar Sesión' : 'Nueva Sesión'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Fecha y Hora *</label>
              <input
                type="datetime-local"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Profesional *</label>
              <input
                type="text"
                name="profesional"
                value={formData.profesional}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tratamiento *</label>
              <input
                type="text"
                name="tratamiento"
                value={formData.tratamiento}
                onChange={handleChange}
                placeholder="Ej: Relleno ácido hialurónico"
                required
              />
            </div>

            <div className="form-group">
              <label>Zona *</label>
              <input
                type="text"
                name="zona"
                value={formData.zona}
                onChange={handleChange}
                placeholder="Ej: Labios, Pómulos"
                required
              />
            </div>

            <div className="form-group">
              <label>Cantidad (ml)</label>
              <input
                type="number"
                step="0.1"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Observaciones</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Incidencias</label>
              <textarea
                name="incidencias"
                value={formData.incidencias}
                onChange={handleChange}
              />
            </div>

            {/* Mapa Facial Interactivo */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <FacialDiagram injectionPoints={formData.injection_points} onPointsChange={handleInjectionPointsChange} />
            </div>

            <div className="form-group">
              <label>Próxima Revisión</label>
              <input
                type="date"
                name="proxima_revision"
                value={formData.proxima_revision}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

const styles = {
  backBtn: {
    marginBottom: '28px'
  },
  clientCard: {
    marginBottom: '32px',
    padding: '32px'
  },
  clientHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '2px solid var(--gray-100)'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '28px',
    fontWeight: '700',
    boxShadow: 'var(--shadow-lg)',
    letterSpacing: '1px'
  },
  clientHeaderInfo: {
    flex: 1
  },
  clientName: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--gray-900)',
    marginBottom: '8px'
  },
  expedienteInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    color: 'var(--primary)',
    fontWeight: '600'
  },
  clientInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  infoCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '20px',
    background: 'var(--primary-light)',
    borderRadius: '12px',
    border: '1px solid #cce5ff'
  },
  infoIcon: {
    color: 'var(--primary)',
    flexShrink: 0,
    marginTop: '2px'
  },
  infoLabel: {
    fontSize: '12px',
    color: 'var(--gray-600)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  infoValue: {
    fontSize: '15px',
    color: 'var(--gray-900)',
    fontWeight: '600'
  },
  notasSection: {
    marginTop: '24px',
    padding: '20px',
    background: 'var(--gray-50)',
    borderRadius: '12px',
    border: '1px solid var(--gray-200)'
  },
  notasHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    color: 'var(--gray-700)',
    fontSize: '14px'
  },
  notasText: {
    fontSize: '14px',
    color: 'var(--gray-700)',
    lineHeight: '1.6',
    margin: 0
  },
  sessionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  sessionsTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--gray-900)',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center'
  },
  sessionsSubtitle: {
    fontSize: '14px',
    color: 'var(--gray-500)',
    fontWeight: '500'
  },
  addSessionBtn: {
    padding: '14px 28px'
  },
  sessionsCard: {
    padding: '0'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center'
  },
  emptyIcon: {
    color: 'var(--gray-300)',
    marginBottom: '20px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--gray-800)',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '15px',
    color: 'var(--gray-500)'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    padding: '24px'
  },
  sessionCard: {
    position: 'relative',
    padding: '24px',
    paddingLeft: '48px',
    borderLeft: '3px solid var(--primary-light)',
    marginBottom: '20px',
    transition: 'var(--transition)'
  },
  sessionIndicator: {
    position: 'absolute',
    left: '-8px',
    top: '28px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    border: '3px solid white',
    boxShadow: '0 0 0 2px var(--primary-light)'
  },
  sessionContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--gray-100)'
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  sessionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  sessionBadge: {
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.3px'
  },
  zonaBadge: {
    background: 'var(--secondary)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600'
  },
  sessionDate: {
    fontSize: '13px',
    color: 'var(--gray-500)',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  sessionDetails: {
    fontSize: '14px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    color: 'var(--gray-700)'
  },
  detailItem: {
    padding: '12px',
    background: 'var(--gray-50)',
    borderRadius: '8px',
    fontSize: '13px'
  },
  sessionBtn: {
    padding: '8px 16px',
    fontSize: '13px'
  }
};

export default ClientDetailPage;
