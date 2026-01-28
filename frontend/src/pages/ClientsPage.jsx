import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { clientService } from '../services/services';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    expediente: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    fecha_nacimiento: '',
    notas_generales: ''
  });

  useEffect(() => {
    loadClients();
  }, [search]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAll(search);
      setClients(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        expediente: client.expediente,
        nombre: client.nombre,
        apellidos: client.apellidos,
        telefono: client.telefono || '',
        email: client.email || '',
        fecha_nacimiento: client.fecha_nacimiento?.split('T')[0] || '',
        notas_generales: client.notas_generales || ''
      });
    } else {
      setEditingClient(null);
      setFormData({
        expediente: '',
        nombre: '',
        apellidos: '',
        telefono: '',
        email: '',
        fecha_nacimiento: '',
        notas_generales: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientService.update(editingClient.id, formData);
      } else {
        await clientService.create(formData);
      }
      handleCloseModal();
      loadClients();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al guardar cliente');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={styles.icon}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Gestión de Pacientes
            </h1>
            <p style={styles.pageSubtitle}>Administra los expedientes de tus pacientes</p>
          </div>
          <button onClick={() => handleOpenModal()} className="btn btn-primary" style={styles.newBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nuevo Paciente
          </button>
        </div>

        <div className="card" style={styles.searchCard}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por expediente, nombre, apellidos o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Cargando pacientes...</p>
          </div>
        ) : (
          <div className="card" style={styles.tableCard}>
            {clients.length === 0 ? (
              <div style={styles.emptyState}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={styles.emptyIcon}>
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 108 0 4 4 0 00-8 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <h3 style={styles.emptyTitle}>No hay pacientes registrados</h3>
                <p style={styles.emptyText}>Comienza agregando tu primer paciente</p>
                <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{marginTop: '16px'}}>
                  Crear Paciente
                </button>
              </div>
            ) : (
              <>
                <div style={styles.tableHeader}>
                  <h3 style={styles.tableTitle}>Pacientes Registrados</h3>
                  <span style={styles.tableCount}>{clients.length} total</span>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Expediente</th>
                      <th>Nombre Completo</th>
                      <th>Teléfono</th>
                      <th>Email</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td>
                          <span style={styles.expediente}>#{client.expediente}</span>
                        </td>
                        <td>
                          <strong style={styles.clientName}>{client.nombre} {client.apellidos}</strong>
                        </td>
                        <td style={styles.contactInfo}>{client.telefono || '-'}</td>
                        <td style={styles.contactInfo}>{client.email || '-'}</td>
                        <td>
                          <div style={styles.actionButtons}>
                            <button
                              onClick={() => navigate(`/clientes/${client.id}`)}
                              className="btn btn-primary"
                              style={styles.viewBtn}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              Ver
                            </button>
                            <button
                              onClick={() => handleOpenModal(client)}
                              className="btn btn-secondary"
                              style={styles.editBtn}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Expediente *</label>
              <input
                type="text"
                name="expediente"
                value={formData.expediente}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Apellidos *</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Notas Generales</label>
              <textarea
                name="notas_generales"
                value={formData.notas_generales}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px'
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--gray-900)',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  icon: {
    color: 'var(--primary)'
  },
  pageSubtitle: {
    fontSize: '15px',
    color: 'var(--gray-500)',
    fontWeight: '500'
  },
  newBtn: {
    fontSize: '14px',
    padding: '14px 28px'
  },
  searchCard: {
    marginBottom: '28px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  searchIcon: {
    color: 'var(--gray-400)',
    flexShrink: 0
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: 'var(--gray-700)',
    fontWeight: '500'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '20px'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid var(--gray-200)',
    borderTop: '4px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '16px',
    color: 'var(--gray-500)',
    fontWeight: '500'
  },
  tableCard: {
    padding: '0',
    overflow: 'hidden'
  },
  tableHeader: {
    padding: '24px 28px',
    borderBottom: '1px solid var(--gray-100)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--gray-900)'
  },
  tableCount: {
    fontSize: '14px',
    color: 'var(--gray-500)',
    fontWeight: '600',
    background: 'var(--primary-light)',
    padding: '6px 14px',
    borderRadius: '20px'
  },
  expediente: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, var(--primary-light) 0%, #cce5ff 100%)',
    color: 'var(--primary-dark)',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  clientName: {
    color: 'var(--gray-800)',
    fontSize: '15px'
  },
  contactInfo: {
    color: 'var(--gray-600)',
    fontSize: '14px'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  viewBtn: {
    padding: '8px 16px',
    fontSize: '13px'
  },
  editBtn: {
    padding: '8px 16px',
    fontSize: '13px'
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
  }
};

export default ClientsPage;
