import { useState, useRef, useEffect } from 'react';

const PRODUCTS = {
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

  const drawDiagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Dibujar cara base
    drawFace(ctx, width, height);

    // Dibujar puntos de inyección
    points.forEach((point, index) => {
      const isHovered = hoveredPoint === index;
      drawInjectionPoint(ctx, point, isHovered);
    });
  };

  const drawFace = (ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2 - 20;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // ============ ESTRUCTURA FACIAL REALISTA ============
    
    // Contorno facial con forma anatómica real (mandíbula, pómulos)
    ctx.strokeStyle = '#7A6F6F';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 90); // Frente
    ctx.bezierCurveTo(
      centerX - 72, centerY - 85,
      centerX - 70, centerY - 20,
      centerX - 65, centerY + 20
    );
    // Pómulo izquierdo
    ctx.bezierCurveTo(
      centerX - 62, centerY + 45,
      centerX - 50, centerY + 75,
      centerX - 30, centerY + 90
    );
    // Mandíbula izquierda
    ctx.bezierCurveTo(
      centerX - 15, centerY + 95,
      centerX - 5, centerY + 98,
      centerX, centerY + 98
    );
    // Mandíbula derecha
    ctx.bezierCurveTo(
      centerX + 5, centerY + 98,
      centerX + 15, centerY + 95,
      centerX + 30, centerY + 90
    );
    ctx.bezierCurveTo(
      centerX + 50, centerY + 75,
      centerX + 62, centerY + 45,
      centerX + 65, centerY + 20
    );
    // Pómulo derecho
    ctx.bezierCurveTo(
      centerX + 70, centerY - 20,
      centerX + 72, centerY - 85,
      centerX, centerY - 90
    );
    ctx.stroke();

    // Sombras en pómulos (izquierdo)
    ctx.strokeStyle = 'rgba(122, 111, 111, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX - 48, centerY + 15, 15, 0.3 * Math.PI, 0.7 * Math.PI);
    ctx.stroke();

    // Sombras en pómulos (derecho)
    ctx.beginPath();
    ctx.arc(centerX + 48, centerY + 15, 15, 0.3 * Math.PI, 0.7 * Math.PI);
    ctx.stroke();

    // ============ LÍNEA DEL CABELLO DETALLADA ============
    ctx.strokeStyle = '#5A4E4E';
    ctx.lineWidth = 2.2;
    
    // Contorno principal del cabello
    ctx.beginPath();
    ctx.moveTo(centerX - 70, centerY - 70);
    ctx.bezierCurveTo(
      centerX - 55, centerY - 92,
      centerX - 20, centerY - 95,
      centerX, centerY - 93
    );
    ctx.bezierCurveTo(
      centerX + 20, centerY - 95,
      centerX + 55, centerY - 92,
      centerX + 70, centerY - 70
    );
    ctx.stroke();

    // Picos del cabello (flequillo)
    ctx.lineWidth = 1.5;
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + (i * 15), centerY - 88 + Math.abs(i) * 2);
      ctx.lineTo(centerX + (i * 15), centerY - 80 + Math.abs(i) * 3);
      ctx.stroke();
    }

    // ============ CEJAS CON TEXTURA DE PELO ============
    ctx.strokeStyle = '#3D3335';
    
    // Ceja izquierda - contorno principal
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.moveTo(centerX - 45, centerY - 28);
    ctx.quadraticCurveTo(centerX - 30, centerY - 34, centerX - 16, centerY - 30);
    ctx.stroke();
    
    // Pelos individuales ceja izquierda
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 12; i++) {
      const startX = centerX - 45 + (i * 2.5);
      const startY = centerY - 28 + Math.sin(i * 0.5) * 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX - 1, startY - 5 + Math.random() * 2);
      ctx.stroke();
    }
    
    // Ceja derecha - contorno principal
    ctx.lineWidth = 3.8;
    ctx.beginPath();
    ctx.moveTo(centerX + 16, centerY - 30);
    ctx.quadraticCurveTo(centerX + 30, centerY - 34, centerX + 45, centerY - 28);
    ctx.stroke();
    
    // Pelos individuales ceja derecha
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 12; i++) {
      const startX = centerX + 16 + (i * 2.5);
      const startY = centerY - 30 + Math.sin(i * 0.5) * 2;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + 1, startY - 5 + Math.random() * 2);
      ctx.stroke();
    }

    // ============ OJOS ULTRA REALISTAS ============
    ctx.strokeStyle = '#6B5F5F';
    
    // --- OJO IZQUIERDO ---
    // Párpado superior
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 45, centerY - 12);
    ctx.bezierCurveTo(
      centerX - 40, centerY - 18,
      centerX - 28, centerY - 18,
      centerX - 22, centerY - 12
    );
    ctx.stroke();
    
    // Párpado inferior
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(centerX - 45, centerY - 12);
    ctx.bezierCurveTo(
      centerX - 40, centerY - 9,
      centerX - 28, centerY - 9,
      centerX - 22, centerY - 12
    );
    ctx.stroke();
    
    // Pliegue del párpado superior
    ctx.strokeStyle = 'rgba(107, 95, 95, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 44, centerY - 15);
    ctx.bezierCurveTo(
      centerX - 39, centerY - 20,
      centerX - 29, centerY - 20,
      centerX - 23, centerY - 15
    );
    ctx.stroke();
    
    // Globo ocular
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(centerX - 33.5, centerY - 12, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Iris con degradado
    const gradientLeft = ctx.createRadialGradient(
      centerX - 33.5, centerY - 12, 0,
      centerX - 33.5, centerY - 12, 5.5
    );
    gradientLeft.addColorStop(0, '#8B7355');
    gradientLeft.addColorStop(0.4, '#5C4A3A');
    gradientLeft.addColorStop(0.7, '#3D2E22');
    gradientLeft.addColorStop(1, '#2A1F16');
    ctx.fillStyle = gradientLeft;
    ctx.beginPath();
    ctx.arc(centerX - 33.5, centerY - 12, 5.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Detalles del iris (líneas radiales)
    ctx.strokeStyle = 'rgba(139, 115, 85, 0.5)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(
        centerX - 33.5 + Math.cos(angle) * 2,
        centerY - 12 + Math.sin(angle) * 2
      );
      ctx.lineTo(
        centerX - 33.5 + Math.cos(angle) * 5,
        centerY - 12 + Math.sin(angle) * 5
      );
      ctx.stroke();
    }
    
    // Pupila
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX - 33.5, centerY - 12, 2.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Reflejos de luz en el ojo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX - 35, centerY - 14, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(centerX - 32, centerY - 10, 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Pestañas superiores izquierda
    ctx.strokeStyle = '#2A1F1A';
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 8; i++) {
      const x = centerX - 44 + (i * 3);
      const y = centerY - 12 - Math.sin((i / 7) * Math.PI) * 6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      const angle = -Math.PI / 2 + (i - 4) * 0.15;
      ctx.lineTo(x + Math.cos(angle) * 6, y + Math.sin(angle) * 6);
      ctx.stroke();
    }
    
    // Pestañas inferiores izquierda
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 5; i++) {
      const x = centerX - 42 + (i * 4);
      const y = centerY - 9;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.random() * 1 - 0.5, y + 3);
      ctx.stroke();
    }

    // --- OJO DERECHO ---
    ctx.strokeStyle = '#6B5F5F';
    
    // Párpado superior
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX + 22, centerY - 12);
    ctx.bezierCurveTo(
      centerX + 28, centerY - 18,
      centerX + 40, centerY - 18,
      centerX + 45, centerY - 12
    );
    ctx.stroke();
    
    // Párpado inferior
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(centerX + 22, centerY - 12);
    ctx.bezierCurveTo(
      centerX + 28, centerY - 9,
      centerX + 40, centerY - 9,
      centerX + 45, centerY - 12
    );
    ctx.stroke();
    
    // Pliegue del párpado superior
    ctx.strokeStyle = 'rgba(107, 95, 95, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX + 23, centerY - 15);
    ctx.bezierCurveTo(
      centerX + 29, centerY - 20,
      centerX + 39, centerY - 20,
      centerX + 44, centerY - 15
    );
    ctx.stroke();
    
    // Globo ocular
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(centerX + 33.5, centerY - 12, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Iris con degradado
    const gradientRight = ctx.createRadialGradient(
      centerX + 33.5, centerY - 12, 0,
      centerX + 33.5, centerY - 12, 5.5
    );
    gradientRight.addColorStop(0, '#8B7355');
    gradientRight.addColorStop(0.4, '#5C4A3A');
    gradientRight.addColorStop(0.7, '#3D2E22');
    gradientRight.addColorStop(1, '#2A1F16');
    ctx.fillStyle = gradientRight;
    ctx.beginPath();
    ctx.arc(centerX + 33.5, centerY - 12, 5.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Detalles del iris
    ctx.strokeStyle = 'rgba(139, 115, 85, 0.5)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(
        centerX + 33.5 + Math.cos(angle) * 2,
        centerY - 12 + Math.sin(angle) * 2
      );
      ctx.lineTo(
        centerX + 33.5 + Math.cos(angle) * 5,
        centerY - 12 + Math.sin(angle) * 5
      );
      ctx.stroke();
    }
    
    // Pupila
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX + 33.5, centerY - 12, 2.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Reflejos de luz
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(centerX + 35, centerY - 14, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(centerX + 32, centerY - 10, 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // Pestañas superiores derecha
    ctx.strokeStyle = '#2A1F1A';
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 8; i++) {
      const x = centerX + 23 + (i * 3);
      const y = centerY - 12 - Math.sin((i / 7) * Math.PI) * 6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      const angle = -Math.PI / 2 + (i - 4) * 0.15;
      ctx.lineTo(x + Math.cos(angle) * 6, y + Math.sin(angle) * 6);
      ctx.stroke();
    }
    
    // Pestañas inferiores derecha
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 5; i++) {
      const x = centerX + 25 + (i * 4);
      const y = centerY - 9;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.random() * 1 - 0.5, y + 3);
      ctx.stroke();
    }

    // ============ NARIZ REALISTA CON VOLUMEN ============
    ctx.strokeStyle = '#7A6F6F';
    
    // Puente nasal con sombreado
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX - 6, centerY - 10);
    ctx.lineTo(centerX - 8, centerY + 18);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + 6, centerY - 10);
    ctx.lineTo(centerX + 8, centerY + 18);
    ctx.stroke();
    
    // Sombra del puente nasal
    ctx.strokeStyle = 'rgba(122, 111, 111, 0.2)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX - 2, centerY - 5);
    ctx.lineTo(centerX - 3, centerY + 15);
    ctx.stroke();
    
    ctx.strokeStyle = '#7A6F6F';
    
    // Punta de la nariz
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 18, 5, 0, Math.PI);
    ctx.stroke();
    
    // Alas de la nariz
    ctx.beginPath();
    ctx.moveTo(centerX - 8, centerY + 18);
    ctx.quadraticCurveTo(centerX - 12, centerY + 20, centerX - 11, centerY + 24);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + 8, centerY + 18);
    ctx.quadraticCurveTo(centerX + 12, centerY + 20, centerX + 11, centerY + 24);
    ctx.stroke();
    
    // Fosas nasales detalladas
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(centerX - 9, centerY + 22, 4, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX + 9, centerY + 22, 4, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    
    // Sombra interior de fosas nasales
    ctx.fillStyle = 'rgba(61, 51, 53, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX - 9, centerY + 22, 3, 2, 0, 0, Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(centerX + 9, centerY + 22, 3, 2, 0, 0, Math.PI);
    ctx.fill();

    // ============ BOCA Y LABIOS ULTRA DETALLADOS ============
    ctx.strokeStyle = '#6B5F5F';
    
    // Filtrum (surco nasolabial)
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = 'rgba(107, 95, 95, 0.3)';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 25);
    ctx.lineTo(centerX, centerY + 42);
    ctx.stroke();
    
    ctx.strokeStyle = '#6B5F5F';
    
    // Arco de Cupido (labio superior)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 24, centerY + 50);
    ctx.bezierCurveTo(
      centerX - 15, centerY + 45,
      centerX - 8, centerY + 44,
      centerX - 3, centerY + 45
    );
    ctx.bezierCurveTo(
      centerX, centerY + 42,
      centerX + 3, centerY + 45,
      centerX + 3, centerY + 45
    );
    ctx.bezierCurveTo(
      centerX + 8, centerY + 44,
      centerX + 15, centerY + 45,
      centerX + 24, centerY + 50
    );
    ctx.stroke();
    
    // Línea de cierre de labios
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX - 24, centerY + 50);
    ctx.bezierCurveTo(
      centerX - 8, centerY + 52,
      centerX + 8, centerY + 52,
      centerX + 24, centerY + 50
    );
    ctx.stroke();
    
    // Labio inferior con volumen
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 24, centerY + 50);
    ctx.bezierCurveTo(
      centerX - 16, centerY + 60,
      centerX - 8, centerY + 62,
      centerX, centerY + 62
    );
    ctx.bezierCurveTo(
      centerX + 8, centerY + 62,
      centerX + 16, centerY + 60,
      centerX + 24, centerY + 50
    );
    ctx.stroke();
    
    // Sombra del labio inferior (volumen)
    ctx.strokeStyle = 'rgba(107, 95, 95, 0.25)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX - 20, centerY + 54);
    ctx.bezierCurveTo(
      centerX - 8, centerY + 58,
      centerX + 8, centerY + 58,
      centerX + 20, centerY + 54
    );
    ctx.stroke();
    
    // Brillo en el labio inferior
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX - 12, centerY + 56);
    ctx.bezierCurveTo(
      centerX - 4, centerY + 57,
      centerX + 4, centerY + 57,
      centerX + 12, centerY + 56
    );
    ctx.stroke();
    
    // Comisuras de los labios
    ctx.strokeStyle = 'rgba(107, 95, 95, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX - 24, centerY + 50, 2, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX + 24, centerY + 50, 2, 0, Math.PI * 2);
    ctx.stroke();

    // ============ OREJAS DETALLADAS ============
    ctx.strokeStyle = '#7A6F6F';
    
    // Oreja izquierda
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(centerX - 72, centerY + 5, 9, 20, -0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    // Hélix (borde externo)
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(centerX - 72, centerY + 5, 6, 16, -0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    // Antihélix
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX - 72, centerY + 5, 4, 0.3 * Math.PI, 1.7 * Math.PI);
    ctx.stroke();
    
    // Trago
    ctx.fillStyle = 'rgba(122, 111, 111, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX - 68, centerY + 5, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Oreja derecha
    ctx.strokeStyle = '#7A6F6F';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(centerX + 72, centerY + 5, 9, 20, 0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(centerX + 72, centerY + 5, 6, 16, 0.1, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX + 72, centerY + 5, 4, 1.3 * Math.PI, 2.7 * Math.PI);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(122, 111, 111, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX + 68, centerY + 5, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // ============ CUELLO Y CLAVÍCULAS ============
    ctx.strokeStyle = '#7A6F6F';
    ctx.lineWidth = 2;
    
    // Cuello con músculo esternocleidomastoideo
    ctx.beginPath();
    ctx.moveTo(centerX - 28, centerY + 98);
    ctx.lineTo(centerX - 24, centerY + 180);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + 28, centerY + 98);
    ctx.lineTo(centerX + 24, centerY + 180);
    ctx.stroke();
    
    // Músculo esternocleidomastoideo (sombra)
    ctx.strokeStyle = 'rgba(122, 111, 111, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 22, centerY + 100);
    ctx.lineTo(centerX - 18, centerY + 160);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + 22, centerY + 100);
    ctx.lineTo(centerX + 18, centerY + 160);
    ctx.stroke();
    
    // Nuez de Adán
    ctx.strokeStyle = '#7A6F6F';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 120, 4, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    
    // Clavículas
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 98);
    ctx.quadraticCurveTo(centerX - 8, centerY + 102, centerX - 20, centerY + 100);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 98);
    ctx.quadraticCurveTo(centerX + 8, centerY + 102, centerX + 20, centerY + 100);
    ctx.stroke();
    
    // Fosa supraesternal
    ctx.fillStyle = 'rgba(107, 95, 95, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 98, 3, 0, Math.PI * 2);
    ctx.fill();

    // ============ LÍNEAS DE REFERENCIA ANATÓMICAS ============
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 6]);
    
    // Línea central
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 90);
    ctx.lineTo(centerX, centerY + 98);
    ctx.stroke();
    
    // Línea horizontal de ojos
    ctx.beginPath();
    ctx.moveTo(centerX - 50, centerY - 12);
    ctx.lineTo(centerX + 50, centerY - 12);
    ctx.stroke();
    
    // Línea horizontal de nariz
    ctx.beginPath();
    ctx.moveTo(centerX - 40, centerY + 22);
    ctx.lineTo(centerX + 40, centerY + 22);
    ctx.stroke();
    
    // Línea horizontal de boca
    ctx.beginPath();
    ctx.moveTo(centerX - 35, centerY + 50);
    ctx.lineTo(centerX + 35, centerY + 50);
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const drawInjectionPoint = (ctx, point, isHovered) => {
    const radius = isHovered ? 8 : 6;

    // Sombra
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Punto principal
    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Borde blanco
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Borde de color
    ctx.strokeStyle = point.color;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Verificar si se hizo clic en un punto existente para eliminarlo
    const clickedPointIndex = points.findIndex(point => {
      const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      return distance <= 8;
    });

    if (clickedPointIndex !== -1) {
      // Eliminar punto
      const newPoints = points.filter((_, index) => index !== clickedPointIndex);
      setPoints(newPoints);
      if (onPointsChange) onPointsChange(newPoints);
    } else {
      // Agregar nuevo punto
      const newPoint = {
        x,
        y,
        product: selectedProduct,
        color: PRODUCTS[selectedProduct].color,
        timestamp: new Date().toISOString()
      };
      const newPoints = [...points, newPoint];
      setPoints(newPoints);
      if (onPointsChange) onPointsChange(newPoints);
    }
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hoveredIndex = points.findIndex(point => {
      const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
      return distance <= 8;
    });

    setHoveredPoint(hoveredIndex !== -1 ? hoveredIndex : null);
  };

  const clearAllPoints = () => {
    setPoints([]);
    if (onPointsChange) onPointsChange([]);
  };

  const getProductCount = (product) => {
    return points.filter(p => p.product === product).length;
  };

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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px', display: 'inline-block', verticalAlign: 'middle'}}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Haz clic en la cara para marcar puntos. Clic en un punto existente para eliminarlo.
        </p>
      </div>

      {/* Selector de productos */}
      <div style={styles.productSelector}>
        {Object.keys(PRODUCTS).map(key => (
          <button
            key={key}
            onClick={() => setSelectedProduct(key)}
            style={{
              ...styles.productButton,
              ...(selectedProduct === key ? styles.productButtonActive : {}),
              borderColor: PRODUCTS[key].color,
              backgroundColor: selectedProduct === key ? PRODUCTS[key].color : '#ffffff'
            }}
          >
            <div style={{
              ...styles.productColor,
              backgroundColor: PRODUCTS[key].color
            }} />
            <span style={{
              color: selectedProduct === key ? '#ffffff' : '#2D3748',
              fontWeight: selectedProduct === key ? '700' : '600'
            }}>
              {PRODUCTS[key].name}
            </span>
            <span style={{
              ...styles.productCount,
              backgroundColor: selectedProduct === key ? 'rgba(255,255,255,0.25)' : 'var(--primary-light)',
              color: selectedProduct === key ? '#ffffff' : 'var(--primary-dark)'
            }}>
              {getProductCount(key)}
            </span>
          </button>
        ))}
      </div>

      {/* Canvas con la cara */}
      <div style={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width={300}
          height={400}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
          style={styles.canvas}
        />
      </div>

      {/* Controles */}
      <div style={styles.controls}>
        <button
          onClick={clearAllPoints}
          disabled={points.length === 0}
          style={{
            ...styles.clearButton,
            opacity: points.length === 0 ? 0.5 : 1,
            cursor: points.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px'}}>
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Limpiar Puntos
        </button>
        <div style={styles.pointCounter}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: '8px'}}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{fontWeight: '700', fontSize: '18px'}}>{points.length}</span>
          <span style={{marginLeft: '6px', color: 'var(--gray-600)'}}>puntos marcados</span>
        </div>
      </div>

      {/* Leyenda */}
      {points.length > 0 && (
        <div style={styles.legend}>
          <h4 style={styles.legendTitle}>Resumen de Productos</h4>
          <div style={styles.legendGrid}>
            {Object.keys(PRODUCTS).map(key => {
              const count = getProductCount(key);
              if (count === 0) return null;
              return (
                <div key={key} style={styles.legendItem}>
                  <div style={{
                    ...styles.legendColor,
                    backgroundColor: PRODUCTS[key].color
                  }} />
                  <span style={styles.legendLabel}>{PRODUCTS[key].name}</span>
                  <span style={styles.legendCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    background: 'var(--gray-50)',
    borderRadius: '16px',
    border: '2px solid var(--gray-200)'
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center'
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--primary)',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    fontSize: '13px',
    color: 'var(--gray-600)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px'
  },
  productSelector: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px'
  },
  productButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    border: '2px solid',
    borderRadius: '12px',
    background: '#ffffff',
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontSize: '14px'
  },
  productButtonActive: {
    transform: 'scale(1.02)',
    boxShadow: 'var(--shadow-lg)'
  },
  productColor: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexShrink: 0
  },
  productCount: {
    marginLeft: 'auto',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '700'
  },
  canvasContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)',
    border: '2px solid var(--gray-200)'
  },
  canvas: {
    cursor: 'crosshair',
    borderRadius: '12px',
    boxShadow: 'var(--shadow)'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px'
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: 'var(--shadow)',
    transition: 'var(--transition)'
  },
  pointCounter: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
    color: 'white',
    borderRadius: '10px',
    fontSize: '14px',
    boxShadow: 'var(--shadow)'
  },
  legend: {
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    border: '2px solid var(--gray-200)',
    boxShadow: 'var(--shadow)'
  },
  legendTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--gray-800)',
    marginBottom: '16px'
  },
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: 'var(--gray-50)',
    borderRadius: '8px'
  },
  legendColor: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexShrink: 0
  },
  legendLabel: {
    flex: 1,
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--gray-700)'
  },
  legendCount: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--primary)'
  }
};

export default FacialDiagram;
