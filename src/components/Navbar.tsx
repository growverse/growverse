import { Link } from 'react-router-dom';

const isAuthed = false;

export function Navbar(): JSX.Element {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Growverse
      </Link>
      <div className="nav-right">
        <Link to="/about">About</Link>
        {isAuthed ? (
          <button className="btn secondary" type="button">
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
