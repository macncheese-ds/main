CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  usuario VARCHAR(50)  UNIQUE,
  num_empleado INT UNIQUE,
  pass_hash VARBINARY(60) NOT NULL,
  rol ENUM('The Goat','admin','operador','invitado') NOT NULL
);


CREATE TABLE IF NOT EXISTS apps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ruta VARCHAR(255) NOT NULL,
  pb VARCHAR(255) NOT NULL,
  pf VARCHAR(255) NOT NULL
);

INSERT INTO apps (nombre, ruta,pb,pf) VALUES 
( 'Inventario', '10.229.52.84:80','4000','80'),
( 'SkillMatrix', '10.229.52.84:5001','5000','5001'),
( 'Registro de Perfiles', '10.229.52.84:6001','6000','6001'),
( 'Calibraciones', '10.229.52.84:7001','7000','7001'),
( 'Magazines', '10.229.52.84:8001','8000','8001');

INSERT INTO users (nombre, usuario, num_empleado, pass_hash, rol)
VALUES ('Marcelo Morales', 'mmorales', NULL, '$2a$10$3RzS17ZXoszgNFZLQYg7uON0SKxZytc4WECq7eVB4c1B25lVNRGvy', 'The Goat');
