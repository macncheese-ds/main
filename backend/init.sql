-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  num_empleado VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin','operador','invitado') NOT NULL
);

-- Tabla de aplicaciones
CREATE TABLE IF NOT EXISTS aplicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ruta VARCHAR(255) NOT NULL
);

-- Relación usuario-aplicaciones
CREATE TABLE IF NOT EXISTS usuario_aplicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  aplicacion_id INT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (aplicacion_id) REFERENCES aplicaciones(id)
);
