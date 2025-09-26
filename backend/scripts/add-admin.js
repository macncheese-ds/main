import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pool from '../src/utils/db.js';

dotenv.config();

async function addAdmin() {
  const nombre = process.argv[2] || 'Administrador';
  const usuario = process.argv[3] || 'admin';
  const num_empleado = process.argv[4] ? parseInt(process.argv[4], 10) : 1;
  const password = process.argv[5] || 'admin123';

  const hashed = await bcrypt.hash(password, 10);
  try {
    // quick test connection
    await pool.query('SELECT 1');
  } catch (err) {
    console.error('No se pudo conectar a la base de datos. Verifica c:\\app\\main\\backend\\.env y las credenciales.');
    console.error(err.message || err);
    process.exit(1);
  }

  try {
    // store hash into VARBINARY column `pass_hash`
    const [result] = await pool.query('INSERT INTO users (nombre, usuario, num_empleado, pass_hash, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, usuario, num_empleado, Buffer.from(hashed), 'admin']);
    console.log('Admin creado con id', result.insertId);
    process.exit(0);
  } catch (err) {
    console.error('Error creando admin:', err.message || err);
    process.exit(1);
  }
}

addAdmin();
