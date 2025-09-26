import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { authMiddleware, getUserApps } from './routes/apps.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
// Allow only the configured frontend origin (helps browsers enforce same-origin)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:9001';
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.use('/api/auth', authRoutes);

// Ruta protegida para obtener apps asignadas
app.get('/api/auth/apps', authMiddleware, getUserApps);

// Registrar endpoint de usuarios (POST /api/users)
usersRouter(app);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
