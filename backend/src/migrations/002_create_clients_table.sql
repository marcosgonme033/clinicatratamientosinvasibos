CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expediente VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),
  fecha_nacimiento DATE,
  notas_generales TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_expediente (expediente),
  INDEX idx_nombre (nombre),
  INDEX idx_apellidos (apellidos),
  INDEX idx_telefono (telefono)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
