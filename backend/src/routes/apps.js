import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';

export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Token requerido' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const getUserApps = async (req, res) => {
  try {
    const [apps] = await pool.query(
      `SELECT a.id, a.nombre, a.ruta FROM aplicaciones a
       JOIN usuario_aplicaciones ua ON ua.aplicacion_id = a.id
       WHERE ua.usuario_id = ?`,
      [req.user.id]
    );
    res.json(apps);
  } catch {
    res.status(500).json({ message: 'Error al obtener aplicaciones' });
  }
};
