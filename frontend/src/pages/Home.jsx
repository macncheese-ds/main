import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home({ user }) {
  const [apps, setApps] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [reg, setReg] = useState({ nombre: '', usuario: '', num_empleado: null, password: '', rol: 'invitado' });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(null);

  // Valida que la ruta tenga un host/port válido (soporta hostnames o IPv4:port)
  function isValidHostOrUrl(ruta) {
    if (!ruta) return false;
    const withProto = /^(https?:)?\/\//i.test(ruta) ? ruta : `http://${ruta}`;
    try {
      const u = new URL(withProto);
      const host = u.hostname;
      // IPv4 regex (0-255)
      const ipv4 = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;
      if (ipv4.test(host)) return true;
      // hostname validation (simple)
      const hostname = /^[a-zA-Z0-9.-]+$/;
      return hostname.test(host);
    } catch (e) {
      return false;
    }
  }

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

  async function handleRegister() {
    setRegError('');
    setRegSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/users', reg, { headers: { Authorization: `Bearer ${token}` } });
      setRegSuccess(res.data.id);
      setReg({ nombre: '', usuario: '', num_empleado: null, password: '', rol: 'invitado' });
    } catch (err) {
      setRegError(err?.response?.data?.message || err.message || 'Error');
    }
  }

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
                  {user ? (
                    Object.entries(user)
                      .filter(([key]) => key !== 'email')
                      .map(([key, value]) => (
                        <div className="flex justify-between py-1" key={key}>
                          <dt className="text-gray-600 dark:text-gray-300 capitalize">{key.replace(/_/g, ' ')}</dt>
                          <dd className="truncate">{String(value)}</dd>
                        </div>
                      ))
                  ) : (
                    <div className="text-sm text-gray-500">Sin información</div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-sm text-gray-500 uppercase">Acciones</h3>
                <div className="mt-2 space-y-2">
                  {/* Registrar usuario: solo admin o The Goat */}
                  {(user?.rol === 'admin' || user?.rol === 'The Goat') && (
                    <button
                      onClick={() => setShowRegister(true)}
                      className="w-full text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm"
                    >Registrar usuario</button>
                  )}

                  {/* Inline modal/form */}
                  {showRegister && (
                    <div className="mt-3 p-3 border rounded bg-gray-50 dark:bg-gray-900">
                      <h4 className="text-sm font-medium mb-2">Nuevo usuario</h4>
                      <div className="space-y-2">
                        <input placeholder="Nombre" value={reg.nombre} onChange={e => setReg({...reg, nombre: e.target.value})} className="w-full px-2 py-1 rounded border" />
                        <input placeholder="Usuario" value={reg.usuario} onChange={e => setReg({...reg, usuario: e.target.value})} className="w-full px-2 py-1 rounded border" />
                        <input placeholder="num_empleado (opcional)" value={reg.num_empleado || ''} onChange={e => setReg({...reg, num_empleado: e.target.value ? Number(e.target.value) : null})} className="w-full px-2 py-1 rounded border" />
                        <input placeholder="Contraseña" type="password" value={reg.password} onChange={e => setReg({...reg, password: e.target.value})} className="w-full px-2 py-1 rounded border" />
                        <select value={reg.rol} onChange={e => setReg({...reg, rol: e.target.value})} className="w-full px-2 py-1 rounded border">
                          <option value="The Goat">The Goat</option>
                          <option value="admin">admin</option>
                          <option value="operador">operador</option>
                          <option value="invitado">invitado</option>
                        </select>
                        <div className="flex gap-2">
                          <button onClick={handleRegister} className="px-3 py-1 bg-green-600 text-white rounded">Crear</button>
                          <button onClick={() => setShowRegister(false)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Cancelar</button>
                        </div>
                        {regError && <div className="text-xs text-red-600">{regError}</div>}
                        {regSuccess && <div className="text-xs text-green-600">Usuario creado (ID: {regSuccess})</div>}
                      </div>
                    </div>
                  )}

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
                  {apps.map(app => {
                    const href = /^(https?:)?\/\//i.test(app.ruta) ? app.ruta : `http://${app.ruta}`;
                    const valid = isValidHostOrUrl(app.ruta);
                    if (!valid) {
                      return (
                        <div
                          key={app.id}
                          className="p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-semibold">{app.nombre}</h3>
                              <p className="text-xs mt-1">Ruta inválida: <span className="font-mono">{app.ruta}</span></p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Corrige la entrada en la tabla `apps` (host o IP inválido).</p>
                            </div>
                            <div className="text-xs">Bloqueado</div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <a
                        key={app.id}
                        href={href}
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
                    );
                  })}
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
