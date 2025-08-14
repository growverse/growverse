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
          <button className="btn secondary" onClick={logout}>
            Logout
          </button>
        ) : (
          <>
            <Link className="btn secondary" to="/login">
              Login
            </Link>
            <Link className="btn" to="/signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
