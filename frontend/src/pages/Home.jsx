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
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Bienvenido, {user.nombre}</h2>
      <h4>Rol: {user.rol}</h4>
      <h3>Aplicaciones asignadas:</h3>
      <ul>
        {apps.length === 0 && <li>No tienes aplicaciones asignadas.</li>}
        {apps.map(app => (
          <li key={app.id}>
            <a href={app.ruta} target="_blank" rel="noopener noreferrer">{app.nombre}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
