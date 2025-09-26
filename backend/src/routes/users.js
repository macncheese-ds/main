import bcrypt from 'bcryptjs';
import { authMiddleware } from './apps.js';
import pool from '../utils/db.js';

// POST /api/users  -> create new user (only admin or The Goat)
export const createUser = async (req, res) => {
  try {
    const caller = req.user;
    if (!caller || !['admin', 'The Goat'].includes(caller.rol)) {
      return res.status(403).json({ message: 'Permisos insuficientes' });
    }

    // Only allow requests coming from the configured frontend origin (browser)
    const origin = req.headers.origin;
  const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:9001';
    if (origin && origin !== allowedOrigin) {
      return res.status(403).json({ message: 'Origen no permitido' });
    }

    const { nombre, usuario, num_empleado, password, rol } = req.body;
    if (!nombre || !usuario || !password || !rol) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const hashed = await bcrypt.hash(password, 10);
    // store hash into VARBINARY pass_hash
    const [result] = await pool.query(
      'INSERT INTO users (nombre, usuario, num_empleado, pass_hash, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, usuario, num_empleado || null, Buffer.from(hashed), rol]
    );
    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('createUser error', err);
    return res.status(500).json({ message: 'Error creando usuario' });
  }
};

export default function usersRouter(app) {
  app.post('/api/users', authMiddleware, createUser);
}
