import { useState, useRef, useEffect } from 'react';

export const PRODUCTS = {
  A: { name: 'Producto A', color: '#FF6B6B' },
  B: { name: 'Producto B', color: '#4ECDC4' },
  C: { name: 'Producto C', color: '#FFE66D' },
  D: { name: 'Producto D', color: '#9D4EDD' }
};

const FacialDiagram = ({ injectionPoints = [], onPointsChange }) => {
  const canvasRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState('A');
  const [points, setPoints] = useState(injectionPoints);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    drawDiagram();
  }, [points, hoveredPoint]);

  const updatePoints = (newPoints) => {
    setPoints(newPoints);
    if (onPointsChange) onPointsChange(newPoints);
  };

  const drawDiagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    drawFace(ctx, width, height);
    points.forEach((point, index) => {
      drawInjectionPoint(ctx, point, hoveredPoint === index, index);
    });
  };

  const drawFace = (ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2 - 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Contorno facial
    ctx.strokeStyle = '#7A6F6F';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 90);
    ctx.bezierCurveTo(centerX - 72, centerY - 85, centerX - 70, centerY - 20, centerX - 65, centerY + 20);
    ctx.bezierCurveTo(centerX - 62, centerY + 45, centerX - 50, centerY + 75, centerX - 30, centerY + 90);
    ctx.bezierCurveTo(centerX - 15, centerY + 95, centerX - 5, centerY + 98, centerX, centerY + 98);
    ctx.bezierCurveTo(centerX + 5, centerY + 98, centerX + 15, centerY + 95, centerX + 30, centerY + 90);
    ctx.bezierCurveTo(centerX + 50, centerY + 75, centerX + 62, centerY + 45, centerX + 65, centerY + 20);
    ctx.bezierCurveTo(centerX + 70, centerY - 20, centerX + 72, centerY - 85, centerX, centerY - 90);
    ctx.stroke();

    // Sombras pómulos
    ctx.strokeStyle = 'rgba(122, 111, 111, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(centerX - 48, centerY + 15, 15, 0.3 * Math.PI, 0.7 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(centerX + 48, centerY + 15, 15, 0.3 * Math.PI, 0.7 * Math.PI); ctx.stroke();

    // Cabello
    ctx.strokeStyle = '#5A4E4E';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(centerX - 70, centerY - 70);
    ctx.bezierCurveTo(centerX - 55, centerY - 92, centerX - 20, centerY - 95, centerX, centerY - 93);
    ctx.bezierCurveTo(centerX + 20, centerY - 95, centerX + 55, centerY - 92, centerX + 70, centerY - 70);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * 15, centerY - 88 + Math.abs(i) * 2);
      ctx.lineTo(centerX + i * 15, centerY - 80 + Math.abs(i) * 3);
      ctx.stroke();
    }

    // Cejas
    ctx.strokeStyle = '#3D3335';
    ctx.lineWidth = 3.8;
    ctx.beginPath(); ctx.moveTo(centerX - 45, centerY - 28); ctx.quadraticCurveTo(centerX - 30, centerY - 34, centerX - 16, centerY - 30); ctx.stroke();
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 12; i++) { const sx = centerX - 45 + i * 2.5, sy = centerY - 28 + Math.sin(i * 0.5) * 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - 1, sy - 5 + Math.random() * 2); ctx.stroke(); }
    ctx.lineWidth = 3.8;
    ctx.beginPath(); ctx.moveTo(centerX + 16, centerY - 30); ctx.quadraticCurveTo(centerX + 30, centerY - 34, centerX + 45, centerY - 28); ctx.stroke();
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 12; i++) { const sx = centerX + 16 + i * 2.5, sy = centerY - 30 + Math.sin(i * 0.5) * 2; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 1, sy - 5 + Math.random() * 2); ctx.stroke(); }

    // Ojos
    const drawEye = (cx) => {
      const sign = cx < centerX ? -1 : 1;
      const eyeX = centerX + sign * 33.5;
      const outerL = centerX + sign * (sign < 0 ? -45 : 22);
      const outerR = centerX + sign * (sign < 0 ? -22 : 45);

      ctx.strokeStyle = '#6B5F5F'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(outerL, centerY - 12);
      ctx.bezierCurveTo(outerL + sign * 5, centerY - 18, outerR - sign * 6, centerY - 18, outerR, centerY - 12); ctx.stroke();
      ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(outerL, centerY - 12);
      ctx.bezierCurveTo(outerL + sign * 5, centerY - 9, outerR - sign * 6, centerY - 9, outerR, centerY - 12); ctx.stroke();

      ctx.strokeStyle = 'rgba(107,95,95,0.4)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(outerL + sign * 1, centerY - 15);
      ctx.bezierCurveTo(outerL + sign * 6, centerY - 20, outerR - sign * 5, centerY - 20, outerR - sign * 1, centerY - 15); ctx.stroke();

      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(eyeX, centerY - 12, 9, 6, 0, 0, Math.PI * 2); ctx.fill();

      const grad = ctx.createRadialGradient(eyeX, centerY - 12, 0, eyeX, centerY - 12, 5.5);
      grad.addColorStop(0, '#8B7355'); grad.addColorStop(0.4, '#5C4A3A'); grad.addColorStop(0.7, '#3D2E22'); grad.addColorStop(1, '#2A1F16');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(eyeX, centerY - 12, 5.5, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = 'rgba(139,115,85,0.5)'; ctx.lineWidth = 0.5;
      for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; ctx.beginPath(); ctx.moveTo(eyeX + Math.cos(a) * 2, centerY - 12 + Math.sin(a) * 2); ctx.lineTo(eyeX + Math.cos(a) * 5, centerY - 12 + Math.sin(a) * 5); ctx.stroke(); }

      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(eyeX, centerY - 12, 2.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(eyeX + sign * 1.5, centerY - 14, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(eyeX - sign * 1.5, centerY - 10, 0.8, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = '#2A1F1A'; ctx.lineWidth = 1.3;
      for (let i = 0; i < 8; i++) { const x = outerL + i * 3 * sign; const y = centerY - 12 - Math.sin((i / 7) * Math.PI) * 6; ctx.beginPath(); ctx.moveTo(x, y); const a = -Math.PI / 2 + (i - 4) * 0.15; ctx.lineTo(x + Math.cos(a) * 6, y + Math.sin(a) * 6); ctx.stroke(); }
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 5; i++) { const x = (sign < 0 ? centerX - 42 : centerX + 25) + i * 4; ctx.beginPath(); ctx.moveTo(x, centerY - 9); ctx.lineTo(x + Math.random() - 0.5, centerY - 6); ctx.stroke(); }
    };
    drawEye(centerX - 33.5);
    drawEye(centerX + 33.5);

    // Nariz
    ctx.strokeStyle = '#7A6F6F'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(centerX - 6, centerY - 10); ctx.lineTo(centerX - 8, centerY + 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX + 6, centerY - 10); ctx.lineTo(centerX + 8, centerY + 18); ctx.stroke();
    ctx.strokeStyle = 'rgba(122,111,111,0.2)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(centerX - 2, centerY - 5); ctx.lineTo(centerX - 3, centerY + 15); ctx.stroke();
    ctx.strokeStyle = '#7A6F6F'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(centerX, centerY + 18, 5, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX - 8, centerY + 18); ctx.quadraticCurveTo(centerX - 12, centerY + 20, centerX - 11, centerY + 24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX + 8, centerY + 18); ctx.quadraticCurveTo(centerX + 12, centerY + 20, centerX + 11, centerY + 24); ctx.stroke();
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(centerX - 9, centerY + 22, 4, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(centerX + 9, centerY + 22, 4, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    ctx.fillStyle = 'rgba(61,51,53,0.3)';
    ctx.beginPath(); ctx.ellipse(centerX - 9, centerY + 22, 3, 2, 0, 0, Math.PI); ctx.fill();
    ctx.beginPath(); ctx.ellipse(centerX + 9, centerY + 22, 3, 2, 0, 0, Math.PI); ctx.fill();

    // Boca
    ctx.strokeStyle = 'rgba(107,95,95,0.3)'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(centerX, centerY + 25); ctx.lineTo(centerX, centerY + 42); ctx.stroke();
    ctx.strokeStyle = '#6B5F5F'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 24, centerY + 50);
    ctx.bezierCurveTo(centerX - 15, centerY + 45, centerX - 8, centerY + 44, centerX - 3, centerY + 45);
    ctx.bezierCurveTo(centerX, centerY + 42, centerX + 3, centerY + 45, centerX + 3, centerY + 45);
    ctx.bezierCurveTo(centerX + 8, centerY + 44, centerX + 15, centerY + 45, centerX + 24, centerY + 50);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(centerX - 24, centerY + 50); ctx.bezierCurveTo(centerX - 8, centerY + 52, centerX + 8, centerY + 52, centerX + 24, centerY + 50); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 24, centerY + 50);
    ctx.bezierCurveTo(centerX - 16, centerY + 60, centerX - 8, centerY + 62, centerX, centerY + 62);
    ctx.bezierCurveTo(centerX + 8, centerY + 62, centerX + 16, centerY + 60, centerX + 24, centerY + 50);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(107,95,95,0.25)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(centerX - 20, centerY + 54); ctx.bezierCurveTo(centerX - 8, centerY + 58, centerX + 8, centerY + 58, centerX + 20, centerY + 54); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(centerX - 12, centerY + 56); ctx.bezierCurveTo(centerX - 4, centerY + 57, centerX + 4, centerY + 57, centerX + 12, centerY + 56); ctx.stroke();
    ctx.strokeStyle = 'rgba(107,95,95,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(centerX - 24, centerY + 50, 2, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(centerX + 24, centerY + 50, 2, 0, Math.PI * 2); ctx.stroke();

    // Orejas
    ctx.strokeStyle = '#7A6F6F';
    ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(centerX - 72, centerY + 5, 9, 20, -0.1, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1.3; ctx.beginPath(); ctx.ellipse(centerX - 72, centerY + 5, 6, 16, -0.1, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(centerX - 72, centerY + 5, 4, 0.3 * Math.PI, 1.7 * Math.PI); ctx.stroke();
    ctx.fillStyle = 'rgba(122,111,111,0.3)'; ctx.beginPath(); ctx.ellipse(centerX - 68, centerY + 5, 2, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#7A6F6F';
    ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(centerX + 72, centerY + 5, 9, 20, 0.1, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1.3; ctx.beginPath(); ctx.ellipse(centerX + 72, centerY + 5, 6, 16, 0.1, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(centerX + 72, centerY + 5, 4, 1.3 * Math.PI, 2.7 * Math.PI); ctx.stroke();
    ctx.fillStyle = 'rgba(122,111,111,0.3)'; ctx.beginPath(); ctx.ellipse(centerX + 68, centerY + 5, 2, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Cuello
    ctx.strokeStyle = '#7A6F6F'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(centerX - 28, centerY + 98); ctx.lineTo(centerX - 24, centerY + 180); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX + 28, centerY + 98); ctx.lineTo(centerX + 24, centerY + 180); ctx.stroke();
    ctx.strokeStyle = 'rgba(122,111,111,0.2)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(centerX - 22, centerY + 100); ctx.lineTo(centerX - 18, centerY + 160); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX + 22, centerY + 100); ctx.lineTo(centerX + 18, centerY + 160); ctx.stroke();
    ctx.strokeStyle = '#7A6F6F'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(centerX, centerY + 120, 4, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(centerX, centerY + 98); ctx.quadraticCurveTo(centerX - 8, centerY + 102, centerX - 20, centerY + 100); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX, centerY + 98); ctx.quadraticCurveTo(centerX + 8, centerY + 102, centerX + 20, centerY + 100); ctx.stroke();
    ctx.fillStyle = 'rgba(107,95,95,0.3)'; ctx.beginPath(); ctx.arc(centerX, centerY + 98, 3, 0, Math.PI * 2); ctx.fill();

    // Líneas de referencia
    ctx.strokeStyle = 'rgba(200,200,200,0.3)'; ctx.lineWidth = 0.5; ctx.setLineDash([3, 6]);
    ctx.beginPath(); ctx.moveTo(centerX, centerY - 90); ctx.lineTo(centerX, centerY + 98); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX - 50, centerY - 12); ctx.lineTo(centerX + 50, centerY - 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX - 40, centerY + 22); ctx.lineTo(centerX + 40, centerY + 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX - 35, centerY + 50); ctx.lineTo(centerX + 35, centerY + 50); ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawInjectionPoint = (ctx, point, isHovered, index) => {
    const radius = isHovered ? 8 : 6;
    ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 4; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
    ctx.fillStyle = point.color;
    ctx.beginPath(); ctx.arc(point.x, point.y, radius, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = point.color; ctx.lineWidth = 1; ctx.stroke();
    // Número
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 9px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(index + 1, point.x, point.y);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Solo agregar (eliminar se hace con botón en el resumen)
    const newPoint = {
      x, y,
      product: selectedProduct,
      color: PRODUCTS[selectedProduct].color,
      ml: 0,
      observation: '',
      timestamp: new Date().toISOString()
    };
    updatePoints([...points, newPoint]);
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const idx = points.findIndex(p => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) <= 8);
    setHoveredPoint(idx !== -1 ? idx : null);
  };

  const clearAllPoints = () => updatePoints([]);

  const handleRemovePoint = (index) => updatePoints(points.filter((_, i) => i !== index));

  const handlePointFieldChange = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    updatePoints(newPoints);
  };

  const getProductCount = (product) => points.filter(p => p.product === product).length;

  const getProductTotalMl = (product) =>
    points.filter(p => p.product === product).reduce((sum, p) => sum + (parseFloat(p.ml) || 0), 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '8px', display: 'inline-block', verticalAlign: 'middle'}}>
            <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 14a8 8 0 00-8 8h16a8 8 0 00-8-8z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Diagrama de Puntos de Inyección Facial
        </h3>
        <p style={styles.subtitle}>
          Haz clic en la cara para marcar puntos. Usa los botones ✕ del resumen para eliminarlos.
        </p>
      </div>

      {/* Selector de productos */}
      <div style={styles.productSelector}>
        {Object.keys(PRODUCTS).map(key => (
          <button key={key} type="button" onClick={() => setSelectedProduct(key)}
            style={{ ...styles.productButton, ...(selectedProduct === key ? styles.productButtonActive : {}), borderColor: PRODUCTS[key].color, backgroundColor: selectedProduct === key ? PRODUCTS[key].color : '#ffffff' }}>
            <div style={{ ...styles.productColor, backgroundColor: PRODUCTS[key].color }} />
            <span style={{ color: selectedProduct === key ? '#fff' : '#2D3748', fontWeight: selectedProduct === key ? '700' : '600' }}>{PRODUCTS[key].name}</span>
            <span style={{ ...styles.productCount, backgroundColor: selectedProduct === key ? 'rgba(255,255,255,0.25)' : 'var(--primary-light)', color: selectedProduct === key ? '#fff' : 'var(--primary-dark)' }}>{getProductCount(key)}</span>
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div style={styles.canvasContainer}>
        <canvas ref={canvasRef} width={300} height={400} onClick={handleCanvasClick} onMouseMove={handleCanvasMouseMove} onMouseLeave={() => setHoveredPoint(null)} style={styles.canvas} />
      </div>

      {/* Controles */}
      <div style={styles.controls}>
        <button type="button" onClick={clearAllPoints} disabled={points.length === 0}
          style={{ ...styles.clearButton, opacity: points.length === 0 ? 0.5 : 1, cursor: points.length === 0 ? 'not-allowed' : 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px'}}>
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Limpiar Puntos
        </button>
        <div style={styles.pointCounter}>
          <span style={{fontWeight: '700', fontSize: '18px'}}>{points.length}</span>
          <span style={{marginLeft: '6px'}}>puntos marcados</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', background: 'var(--gray-50)', borderRadius: '16px', border: '2px solid var(--gray-200)' },
  header: { marginBottom: '16px', textAlign: 'center' },
  title: { fontSize: '16px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  subtitle: { fontSize: '12px', color: 'var(--gray-600)' },
  productSelector: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' },
  productButton: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '2px solid', borderRadius: '10px', background: '#fff', cursor: 'pointer', transition: 'var(--transition)', fontSize: '13px' },
  productButtonActive: { transform: 'scale(1.02)', boxShadow: 'var(--shadow-lg)' },
  productColor: { width: '16px', height: '16px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexShrink: 0 },
  productCount: { marginLeft: 'auto', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' },
  canvasContainer: { display: 'flex', justifyContent: 'center', marginBottom: '16px', background: 'white', borderRadius: '12px', padding: '12px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)', border: '2px solid var(--gray-200)' },
  canvas: { cursor: 'crosshair', borderRadius: '8px', boxShadow: 'var(--shadow)' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  clearButton: { display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', boxShadow: 'var(--shadow)', transition: 'var(--transition)' },
  pointCounter: { display: 'flex', alignItems: 'center', padding: '10px 16px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', borderRadius: '10px', fontSize: '13px', boxShadow: 'var(--shadow)' }
};

export default FacialDiagram;
