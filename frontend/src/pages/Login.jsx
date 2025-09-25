import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', { usuario, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Error de autenticación');
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: '100px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario</label>
          <input value={usuario} onChange={e => setUsuario(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
