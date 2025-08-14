import { Link } from 'react-router-dom';
import { sessions } from '@/modules/session/sessions.mock';
import { openSessionWindow } from '@/modules/session/utils';

export default function SessionList(): JSX.Element {
  return (
    <div>
      <h1>Sessions</h1>
      <Link to="/session/create">Create Session</Link>
      <table border={1} cellPadding={4} cellSpacing={0} style={{ marginTop: '1rem', width: '100%', maxWidth: '600px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Instructor</th>
            <th>Start Time</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => openSessionWindow(s.id)}>
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
