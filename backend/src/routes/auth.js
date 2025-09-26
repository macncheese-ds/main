import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
  try {
  const [rows] = await pool.query('SELECT * FROM users WHERE usuario = ?', [usuario]);
    if (!rows.length) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    const user = rows[0];
    // pass_hash stored as VARBINARY — convert to string for bcrypt.compare
    const hash = user.pass_hash instanceof Buffer ? user.pass_hash.toString() : user.pass_hash;
    const valid = await bcrypt.compare(password, hash);
    if (!valid) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  const audience = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
  const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '8h', audience });
    res.json({ token, user: { id: user.id, nombre: user.nombre, usuario: user.usuario, num_empleado: user.num_empleado, rol: user.rol } });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;
