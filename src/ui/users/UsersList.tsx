import { AvatarUser } from '@/domain/roles';
import { displayRole } from './types';

type Props = {
  users: AvatarUser[];
  onSelect: (u: AvatarUser) => void;
};

export function UsersList({ users, onSelect }: Props): JSX.Element {
  if (users.length === 0) return <div className="empty-state">No users online</div>;

  return (
    <table className="users-list" role="table">
      <tbody>
        {users.map((u) => (
          <tr
            key={u.id}
            tabIndex={0}
            onClick={() => onSelect(u)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(u);
            }}
          >
            <td className="name">{u.name}</td>
            <td className="role">{displayRole(u)}</td>
            <td className="dm" style={{ textAlign: 'right' }}>
              <button
                className="dm-btn"
                aria-label="Direct message (soon)"
                title="Direct message (soon)"
                disabled
              >
                💌
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
