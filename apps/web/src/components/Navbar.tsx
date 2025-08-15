import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function Navbar(): JSX.Element {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Growverse
      </Link>
      <div className="nav-right">
        <Link to="/about">About</Link>
        {user && <Link to="/profile">Profile</Link>}
        {user ? (
          <button className="btn secondary" type="button" onClick={logout}>
            Logout
          </button>
        ) : (
          <>
            <Link className="btn secondary" to="/login">
              Login
            </Link>
            <Link className="btn" to="/sign-up">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
