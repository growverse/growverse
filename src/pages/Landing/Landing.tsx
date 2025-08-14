import { Link } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { sessions } from '@/modules/session/sessions.mock';

export default function Landing(): JSX.Element {
  const { user } = useAuth();
  return (
    <>
      <div className="hero">
        <h1>Growverse</h1>
      </div>
      {user && (
        <div className="container">
          <div className="session-actions">
            <Link className="btn" to="/session/create">
              Create Session
            </Link>
          </div>
          <div className="card join-card">
            <h2>Join with URL</h2>
            <div className="join-section">
              <input placeholder="Session URL" />
              <button className="btn">Join</button>
            </div>
          </div>
          <div className="session-grid">
            {sessions.map((s) => (
              <Link key={s.id} to={`/session/${s.id}`} className="card session-card">
                <h3>{s.name}</h3>
                <p>{s.instructorName}</p>
                <p>{s.startTime}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
