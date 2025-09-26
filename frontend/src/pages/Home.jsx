import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home({ user }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/apps', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApps(res.data);
      } catch {
        setApps([]);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Panel de control</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Resumen rápido y acceso a tus aplicaciones</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda: datos usuario (ocupa 1/3 en md) */}
          <aside className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Bienvenido, {user?.nombre}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Rol: <strong className="text-gray-800 dark:text-gray-200">{user?.rol}</strong></p>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm text-gray-500 uppercase">Información</h3>
                <dl className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                  <div className="flex justify-between py-1">
                    <dt className="text-gray-600 dark:text-gray-300">Email</dt>
                    <dd>{user?.email || '—'}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt className="text-gray-600 dark:text-gray-300">ID</dt>
                    <dd className="truncate">{user?.id || '—'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase">Acciones</h3>
                <div className="mt-2 space-y-2">
                  <button
                    onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }}
                    className="w-full text-left px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm"
                  >Cerrar sesión</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Columna derecha: apps (ocupa 2/3 en md) */}
          <main className="col-span-1 md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Aplicaciones asignadas</h2>

              {apps.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">No tienes aplicaciones asignadas.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {apps.map(app => (
                    <a
                      key={app.id}
                      href={app.ruta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{app.nombre}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{app.descripcion || app.ruta}</p>
                        </div>
                        <div className="text-xs text-gray-400">Abrir</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
