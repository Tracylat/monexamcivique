import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('auth_user')));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  };

  return (
    <nav style={{ padding: 16, background: '#eee', display: 'flex', gap: 16 }}>
      <Link to="/">Accueil</Link>
      {isLoggedIn ? <Link to="/dashboard">Dashboard</Link> : <Link to="/login">Connexion</Link>}
      {isLoggedIn && <button onClick={handleLogout}>Déconnexion</button>}
    </nav>
  );
};

export default Navbar;
