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
    // If role is admin, return all apps
  const [userRows] = await pool.query('SELECT rol FROM users WHERE id = ?', [req.user.id]);
    if (!userRows.length) return res.status(404).json([]);
    const rol = userRows[0].rol;

    // Optional: check single app access by query param appId
    const appId = req.query.appId ? parseInt(req.query.appId, 10) : null;

    if (rol === 'admin') {
      if (appId) {
        const [apps] = await pool.query('SELECT id, nombre, ruta FROM apps WHERE id = ?', [appId]);
        return res.json(apps.length ? apps : []);
      }
      const [apps] = await pool.query('SELECT id, nombre, ruta FROM apps');
      return res.json(apps);
    }

    // For non-admin roles, check role mapping tables (role_aplicaciones or role_apps)
    let allowed = [];
    try {
      const [rows] = await pool.query('SELECT aplicacion_id as appId FROM role_aplicaciones WHERE rol = ?', [rol]);
      allowed = rows;
    } catch (e) {
      // ignore if table doesn't exist
    }
    if (!allowed.length) {
      try {
        const [rows] = await pool.query('SELECT app_id as appId FROM role_apps WHERE role = ?', [rol]);
        allowed = rows;
      } catch (e) {
        // ignore
      }
    }
    if (!allowed.length) {
      // fallback: operadores see all apps, invitados see none
      if (rol === 'operador') {
        const [apps] = await pool.query('SELECT id, nombre, ruta FROM apps');
        return res.json(apps);
      }
      return res.json([]);
    }
    const ids = allowed.map(r => r.appId || r.aplicacion_id || r.aplicacionId || r.app_id).filter(Boolean);
    if (appId) {
      // verify appId is in allowed
      if (!ids.includes(appId)) return res.status(403).json({ message: 'Acceso denegado' });
      const [apps] = await pool.query('SELECT id, nombre, ruta FROM apps WHERE id = ?', [appId]);
      return res.json(apps.length ? apps : []);
    }
    const placeholders = ids.map(() => '?').join(',');
    const [apps] = await pool.query(`SELECT id, nombre, ruta FROM apps WHERE id IN (${placeholders})`, ids);
    return res.json(apps);
  } catch (err) {
    console.error('getUserApps error', err);
    res.status(500).json({ message: 'Error al obtener aplicaciones' });
  }
};
