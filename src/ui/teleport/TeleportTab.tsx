import { teleportTo } from '@/systems/teleport';
import { useSessionStore } from '@/state/sessionStore';

export function TeleportTab(): JSX.Element {
  const { sessions } = useSessionStore();
  if (!sessions.length) {
    return <div className="empty-state">No destinations</div>;
  }
  return (
    <div className="teleport-tab">
      <ul className="teleport-list">
        {sessions.map((s) => (
          <li key={s.id}>
            <button onClick={() => teleportTo(s.id)} className="teleport-item">
              <div className="name">{s.name}</div>
              {s.description && <div className="note">{s.description}</div>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
