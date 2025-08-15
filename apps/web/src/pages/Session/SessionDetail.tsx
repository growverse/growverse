import { useParams } from 'react-router-dom';
import { sessions } from '@/modules/session/sessions.mock';
import { openSessionWindow } from '@/modules/session/utils';

export default function SessionDetail(): JSX.Element {
  const { sessionId } = useParams();
  const session = sessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <div className="container">
        <p>Session not found.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{session.name}</h1>
        <p>Instructor: {session.instructorName}</p>
        <p>Start Time: {session.startTime}</p>
        <button className="btn" onClick={() => openSessionWindow(session.id)}>
          Join session
        </button>
      </div>
    </div>
  );
}
