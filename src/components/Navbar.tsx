import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export function Navbar(): JSX.Element {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Growverse
      </Link>
      <div className="nav-right">
        <Link to="/about">About</Link>
        {user ? (
          <button className="btn secondary" type="button" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link className="btn" to="/auth">
            Login / Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
