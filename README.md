# main

Proyecto `main` — Instrucciones rápidas

Backend (Node.js + MySQL)
1. Configura `c:\app\main\backend\.env` con tus credenciales MySQL y `JWT_SECRET`.
2. Crear la base y ejecutar script:
	- `mysql -u tu_usuario -p -e "CREATE DATABASE IF NOT EXISTS main_db; USE main_db; SOURCE c:/app/main/backend/init.sql;"`
3. Instalar dependencias y correr backend:
```powershell
cd c:\\app\\main\\backend
npm install
npm start
```

Crear admin de prueba:
```powershell
node scripts/add-admin.js "Admin" admin 1001 "MiPass123!"
```

Frontend (React + Vite + Tailwind)
1. Instala dependencias y corre dev:
```powershell
cd C:\\app\\main\\frontend
npm install
# Si usas Tailwind por primera vez, instala las dependencias dev:
npm install --save-dev tailwindcss postcss autoprefixer @vitejs/plugin-react
npm run dev
```

Si npm sugiere `npm audit fix --force`, revisa los riesgos antes de ejecutarlo.

Audit: si npm sugiere `npm audit fix --force`, revisa primero los riesgos. Ejecuta sólo si aceptas las actualizaciones automáticas.
# main