import { PRODUCTS } from './FacialDiagram';

const ProductsSummary = ({ points = [], onPointsChange }) => {
  if (points.length === 0) return null;

  const handleRemovePoint = (index) => {
    onPointsChange(points.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...points];
    updated[index] = { ...updated[index], [field]: value };
    onPointsChange(updated);
  };

  const getTotalMl = (product) =>
    points.filter(p => p.product === product).reduce((sum, p) => sum + (parseFloat(p.ml) || 0), 0);

  return (
    <div style={styles.wrap}>
      <h4 style={styles.title}>Resumen de Productos</h4>
      {Object.keys(PRODUCTS).map(key => {
        const pts = points.map((p, i) => ({ ...p, _i: i })).filter(p => p.product === key);
        if (!pts.length) return null;
        return (
          <div key={key} style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={{ ...styles.dot, backgroundColor: PRODUCTS[key].color }} />
              <span style={styles.name}>{PRODUCTS[key].name}</span>
              <span style={styles.count}>{pts.length} pts</span>
              <span style={styles.ml}>{getTotalMl(key).toFixed(1)} ml</span>
            </div>
            <div style={styles.list}>
              {pts.map(p => (
                <div key={p._i} style={styles.pointCard}>
                  <div style={styles.pointHeader}>
                    <span style={{ ...styles.idx, backgroundColor: PRODUCTS[key].color }}>{p._i + 1}</span>
                    <div style={styles.pointHeaderInfo}>
                      <span style={styles.pointLabel}>Punto de Inyección #{p._i + 1}</span>
                      <div style={styles.mlField}>
                        <label style={styles.mlLabel}>Cantidad (ml):</label>
                        <input type="number" step="0.1" min="0" value={p.ml || ''} placeholder="0.0"
                          onChange={e => handleFieldChange(p._i, 'ml', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                          style={styles.mlInput} />
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemovePoint(p._i)} style={styles.del} title="Eliminar punto">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <div style={styles.observationField}>
                    <label style={styles.observationLabel}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{marginRight: '4px'}}>
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Observaciones del punto:
                    </label>
                    <textarea 
                      value={p.observation || ''} 
                      placeholder="Escribe aquí las observaciones específicas de este punto de inyección..."
                      onChange={e => handleFieldChange(p._i, 'observation', e.target.value)}
                      style={styles.observationInput}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  wrap: { padding: '16px', background: 'white', borderRadius: '12px', border: '2px solid var(--gray-200)', boxShadow: 'var(--shadow)' },
  title: { fontSize: '14px', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '12px' },
  dot: { width: '14px', height: '14px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flexShrink: 0 },
  section: { marginBottom: '12px', padding: '12px', background: 'var(--gray-50)', borderRadius: '10px', border: '1px solid var(--gray-200)' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid var(--gray-200)' },
  name: { fontSize: '13px', fontWeight: '700', color: 'var(--gray-800)', flex: 1 },
  count: { fontSize: '11px', fontWeight: '600', color: 'var(--gray-500)', padding: '2px 8px', background: 'var(--gray-200)', borderRadius: '6px' },
  ml: { fontSize: '12px', fontWeight: '700', color: 'var(--primary)', padding: '2px 8px', background: 'var(--primary-light)', borderRadius: '6px' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  
  // Estilos para la tarjeta de cada punto
  pointCard: { 
    background: 'white', 
    borderRadius: '10px', 
    border: '2px solid var(--gray-200)', 
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  pointHeader: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    padding: '10px 12px',
    background: 'var(--gray-50)',
    borderBottom: '1px solid var(--gray-200)'
  },
  idx: { 
    width: '28px', 
    height: '28px', 
    borderRadius: '50%', 
    color: 'white', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontSize: '12px', 
    fontWeight: '700', 
    flexShrink: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
  },
  pointHeaderInfo: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    gap: '6px'
  },
  pointLabel: { 
    fontSize: '12px', 
    fontWeight: '700', 
    color: 'var(--gray-800)' 
  },
  mlField: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '8px' 
  },
  mlLabel: { 
    fontSize: '11px', 
    fontWeight: '600', 
    color: 'var(--gray-600)' 
  },
  mlInput: { 
    width: '80px', 
    padding: '4px 8px', 
    border: '1.5px solid var(--gray-300)', 
    borderRadius: '6px', 
    fontSize: '12px', 
    fontFamily: 'inherit', 
    outline: 'none', 
    background: 'white' 
  },
  del: { 
    width: '32px', 
    height: '32px', 
    borderRadius: '8px', 
    border: '1.5px solid var(--gray-200)', 
    background: 'white', 
    color: '#EF4444', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    cursor: 'pointer', 
    flexShrink: 0,
    transition: 'all 0.2s',
    ':hover': { background: '#FEE2E2', borderColor: '#EF4444' }
  },
  
  // Estilos para el campo de observaciones (más prominente)
  observationField: {
    padding: '12px',
    background: 'white'
  },
  observationLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--primary)',
    marginBottom: '6px'
  },
  observationInput: {
    width: '100%',
    padding: '8px 10px',
    border: '2px solid var(--primary-light)',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'var(--gray-50)',
    resize: 'vertical',
    minHeight: '50px',
    lineHeight: '1.4',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: 'var(--primary)',
      background: 'white'
    }
  }
};

export default ProductsSummary;
