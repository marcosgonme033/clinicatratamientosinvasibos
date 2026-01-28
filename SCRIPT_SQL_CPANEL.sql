-- =====================================================
-- SCRIPT PARA CPANEL - AGREGAR PUNTOS DE INYECCIÓN
-- =====================================================
-- Copiar y pegar este script en phpMyAdmin o SQL de cPanel
-- Base de datos: ysqytyxn_dbclinica_tratamientos_invasivos
-- =====================================================

-- Crear tabla audit_logs si no existe
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id INT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_entity (entity, entity_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar columna para almacenar los puntos de inyección (JSON)
ALTER TABLE sessions 
ADD COLUMN injection_points JSON COMMENT 'Puntos de inyección facial con coordenadas y tipo de producto' AFTER observaciones;

-- Agregar columna para productos utilizados (para búsquedas rápidas)
ALTER TABLE sessions 
ADD COLUMN products_used VARCHAR(50) COMMENT 'Lista de productos usados (A,B,C,D)' AFTER injection_points;

-- Agregar índice para búsquedas por productos
ALTER TABLE sessions 
ADD INDEX idx_products_used (products_used);

-- =====================================================
-- VERIFICAR QUE SE AGREGARON LAS COLUMNAS
-- =====================================================
-- Ejecutar después de aplicar el script:
-- DESCRIBE sessions;
-- Deberías ver las nuevas columnas: injection_points y products_used
-- =====================================================
