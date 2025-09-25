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
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, nombre: user.nombre, usuario: user.usuario, num_empleado: user.num_empleado, rol: user.rol } });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;
