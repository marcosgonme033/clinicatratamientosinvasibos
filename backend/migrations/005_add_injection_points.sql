-- Migración: Agregar campos para puntos de inyección facial
-- Fecha: 2026-01-26
-- Descripción: Añade campos para almacenar puntos de inyección y productos utilizados en cada sesión

-- Agregar columna para almacenar los puntos de inyección (JSON)
ALTER TABLE sessions 
ADD COLUMN injection_points JSON COMMENT 'Puntos de inyección facial con coordenadas y tipo de producto' AFTER notas;

-- Agregar columna para productos utilizados (para búsquedas rápidas)
ALTER TABLE sessions 
ADD COLUMN products_used VARCHAR(50) COMMENT 'Lista de productos usados (A,B,C,D)' AFTER injection_points;

-- Agregar índice para búsquedas por productos
ALTER TABLE sessions 
ADD INDEX idx_products_used (products_used);

-- Comentarios sobre la estructura esperada en injection_points:
-- [
--   {
--     "x": 150,           // Coordenada X en el canvas
--     "y": 100,           // Coordenada Y en el canvas
--     "product": "A",     // Tipo de producto (A, B, C, D)
--     "color": "#FF6B6B", // Color del punto
--     "area": "frente"    // Área facial (frente, nariz, mejilla, etc)
--   }
-- ]
