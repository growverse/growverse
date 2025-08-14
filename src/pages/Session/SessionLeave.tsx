import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '@/state/sessionStore';

export default function SessionLeave(): JSX.Element {
  const navigate = useNavigate();
  const { activeSession } = useSessionStore();
  return (
    <div className="container">
      <h1>You have left the session.</h1>
      {activeSession && (
        <div className="card" style={{ margin: '2rem 0' }}>
          <h2>{activeSession.name}</h2>
          <p>
            {activeSession.currentLearners} / {activeSession.maxLearners} learners
          </p>
          <p>
            Time: {activeSession.currentTime} ({activeSession.currentTimezone})
          </p>
        </div>
      )}
      <button className="btn" onClick={() => navigate('/')}>Return to Landing</button>
    </div>
  );
}
