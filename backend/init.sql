CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  num_empleado INT NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin','operador','invitado') NOT NULL,
  accesos varchar(250)
-- Schema for usuarios and aplicaciones
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  num_empleado INT NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin','operador','invitado') NOT NULL
);

CREATE TABLE IF NOT EXISTS aplicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ruta VARCHAR(255) NOT NULL
);

-- Optional mapping of which apps each role can access
CREATE TABLE IF NOT EXISTS role_aplicaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rol ENUM('admin','operador','invitado') NOT NULL,
  aplicacion_id INT NOT NULL,
  FOREIGN KEY (aplicacion_id) REFERENCES aplicaciones(id)
);
