import React, { createContext, useContext, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Search, Book, MyBookings, Pnr, AuthForm, Admin } from './pages.jsx';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function Guard({ children, admin }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (admin && user.role !== 'ADMIN') return <Navigate to="/" />;
  return children;
}

function Nav() {
  const { user, logout } = useAuth(); const nav = useNavigate();
  return (
    <nav className="navbar navbar-dark bg-primary px-3">
      <Link className="navbar-brand" to="/">🚆 Railway Reservation</Link>
      <div className="d-flex gap-2 flex-wrap">
        <Link className="btn btn-sm btn-light" to="/pnr">PNR Status</Link>
        {user && <Link className="btn btn-sm btn-light" to="/bookings">My Bookings</Link>}
        {user?.role === 'ADMIN' && <Link className="btn btn-sm btn-warning" to="/admin">Admin</Link>}
        {user ? <button className="btn btn-sm btn-outline-light" onClick={() => { logout(); nav('/'); }}>Logout ({user.name})</button>
              : <><Link className="btn btn-sm btn-outline-light" to="/login">Login</Link><Link className="btn btn-sm btn-outline-light" to="/register">Register</Link></>}
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const login = d => { localStorage.setItem('token', d.token); localStorage.setItem('user', JSON.stringify({ name: d.name, role: d.role })); setUser({ name: d.name, role: d.role }); };
  const logout = () => { localStorage.clear(); setUser(null); };
  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      <Nav />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/login" element={<AuthForm mode="login" />} />
          <Route path="/register" element={<AuthForm mode="register" />} />
          <Route path="/pnr" element={<Pnr />} />
          <Route path="/book" element={<Guard><Book /></Guard>} />
          <Route path="/bookings" element={<Guard><MyBookings /></Guard>} />
          <Route path="/admin" element={<Guard admin><Admin /></Guard>} />
          <Route path="*" element={<div className="text-center mt-5"><h2>404 - Page not found</h2><Link to="/">Go home</Link></div>} />
        </Routes>
      </div>
    </AuthCtx.Provider>
  );
}
