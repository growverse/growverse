import { Link } from 'react-router-dom';
import { sessions } from '@/modules/session/sessions.mock';
import { openSessionWindow } from '@/modules/session/utils';

export default function SessionList(): JSX.Element {
  return (
    <div className="card">
      <h1>Sessions</h1>
      <Link className="btn" to="/session/create">
        Create Session
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Instructor</th>
            <th>Start Time</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} onClick={() => openSessionWindow(s.id)}>
              <td>{s.name}</td>
              <td>{s.instructorName}</td>
              <td>{s.startTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
