import React from 'react';
import { Link } from 'react-router-dom';
import { isLoggedIn as hasAuthUser, logout, onAuthChanged } from '../utils/access';

const Navbar: React.FC = () => {
  const [logged, setLogged] = React.useState(false);

  React.useEffect(() => {
    const updateLoggedState = () => setLogged(hasAuthUser());
    updateLoggedState();
    return onAuthChanged(updateLoggedState);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="mx-auto mt-4 flex w-full max-w-[1100px] items-center justify-center gap-3 rounded-2xl border border-[#d7e3f4] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,52,102,0.08)]">
      <Link className="rounded-lg px-3 py-2 font-semibold text-[#1a4d8f] hover:bg-[#eef4ff]" to="/">
        Accueil
      </Link>
      {logged ? (
        <Link className="rounded-lg px-3 py-2 font-semibold text-[#1a4d8f] hover:bg-[#eef4ff]" to="/dashboard">
          Dashboard
        </Link>
      ) : (
        <Link className="rounded-lg px-3 py-2 font-semibold text-[#1a4d8f] hover:bg-[#eef4ff]" to="/login">
          Connexion
        </Link>
      )}
      {logged && (
        <button
          className="rounded-lg border border-[#f3d6d6] bg-white px-3 py-2 font-semibold text-[#b91c2f] hover:bg-[#fff5f5]"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      )}
    </nav>
  );
};

export default Navbar;
