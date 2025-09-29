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
  } catch (err) {
    console.error('authMiddleware error', err);
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Obtiene las aplicaciones a partir del campo `accesos` del usuario
export const getUserApps = async (req, res) => {
  try {
    // Simplified: return all apps for any authenticated user
    const appId = req.query.appId ? parseInt(req.query.appId, 10) : null;
    if (appId) {
      const [apps] = await pool.query('SELECT id, nombre, ruta FROM apps WHERE id = ?', [appId]);
      return res.json(apps.length ? apps : []);
    }
    const [apps] = await pool.query('SELECT id, nombre, ruta FROM apps');
    return res.json(apps);
  } catch (err) {
    console.error('getUserApps error', err);
    res.status(500).json({ message: 'Error al obtener aplicaciones' });
  }
};
