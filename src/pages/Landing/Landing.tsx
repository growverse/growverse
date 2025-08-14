import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export default function Landing(): JSX.Element {
  const { user } = useAuth();
  return (
    <div className="hero">
      <h1>Growverse</h1>
      {user && (
        <div className="cta">
          <Link className="btn" to="/profile">
            Profile
          </Link>
          <Link className="btn" to="/session">
            Create / Join Session
          </Link>
        </div>
      )}
      <div className="card" style={{ marginTop: '3rem' }}>
        <h2>Join with URL</h2>
        <div className="join-section">
          <input placeholder="Session URL" />
          <button className="btn">Join</button>
        </div>
      </div>
    </div>
  );
}
