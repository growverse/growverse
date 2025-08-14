import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export default function Landing(): JSX.Element {
  const { user } = useAuth();
  return (
    <div>
      <h1>Growverse</h1>
      {user && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <Link to="/profile">Profile</Link>
          <Link to="/session">Create / Join Session</Link>
        </div>
      )}
      <div>
        <h2>Join with URL</h2>
        <input placeholder="Session URL" />
        <button>Join</button>
      </div>
    </div>
  );
}
