// Diseño adaptado desde inventario/frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import api, { setAuthToken } from '../api.js';

export default function Login({ setUser }) {
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { usuario: username, password: password });
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (setUser) setUser(data.user);
      else window.location.href = '/';
    } catch (e) {
      setError(e.response?.data?.message || 'Usuario o contraseña incorrectos');
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <form onSubmit={submit} className="w-full max-w-sm bg-white border rounded-2xl p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <h1 className="text-xl font-semibold mb-4">Iniciar sesión</h1>
        <div className="space-y-3">
          <input
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            placeholder="Usuario"
            value={username}
            onChange={e => setU(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            placeholder="Contraseña"
            value={password}
            onChange={e => setP(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm dark:text-red-400">{error}</div>}
          <button className="w-full bg-gray-900 text-white rounded-lg px-3 py-2 dark:bg-gray-100 dark:text-gray-900">Entrar</button>
        </div>
      </form>
    </div>
  );
}
