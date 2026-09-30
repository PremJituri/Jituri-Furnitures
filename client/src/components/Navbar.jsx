import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${
    isActive ? 'bg-primary/10 text-primary' : 'text-dark/80 hover:text-primary'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-dark/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight text-dark">
          Jituri <span className="text-primary">Furnitures</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/collections" className={linkClass}>
            Collections
          </NavLink>
          {user ? (
            <>
              <Link
                to="/admin"
                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-primary/90"
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-dark/70 hover:text-dark"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg border border-dark/15 px-3 py-2 text-sm font-medium text-dark/80 transition-all duration-300 hover:border-primary/40 hover:text-primary"
            >
              Admin login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
