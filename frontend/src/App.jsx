import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  const [user, setUser] = React.useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  return (
    <Routes>
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
