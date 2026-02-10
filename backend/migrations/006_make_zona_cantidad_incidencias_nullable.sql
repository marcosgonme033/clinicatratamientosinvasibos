-- ============================================================
-- Migración 006: Hacer zona, cantidad e incidencias nullable
-- Estos campos se han movido al diagrama facial (injection_points JSON)
-- SAFE: No se pierden datos existentes
-- ============================================================

-- Hacer las columnas nullable (sin perder datos)
ALTER TABLE sessions MODIFY COLUMN zona VARCHAR(255) NULL DEFAULT NULL;
ALTER TABLE sessions MODIFY COLUMN cantidad DECIMAL(10,2) NULL DEFAULT NULL;
ALTER TABLE sessions MODIFY COLUMN incidencias TEXT NULL DEFAULT NULL;

-- ============================================================
-- OPCIONAL / DESTRUCTIVO: Si deseas eliminar las columnas por completo
-- ⚠️  SOLO ejecutar si estás seguro de que no necesitas los datos históricos
-- Descomenta las líneas siguientes bajo tu responsabilidad:
-- ============================================================
-- ALTER TABLE sessions DROP COLUMN zona;
-- ALTER TABLE sessions DROP COLUMN cantidad;
-- ALTER TABLE sessions DROP COLUMN incidencias;
