import { AvatarUser } from '@/domain/roles';
import { displayRole } from './types';

type Props = {
  user: AvatarUser;
  onBack: () => void;
};

export function UserDetail({ user, onBack }: Props): JSX.Element {
  return (
    <div className="user-detail">
      <div className="user-detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h3>
          {user.name}{' '}
          {user.isAdmin && <span className="admin-badge">Admin</span>}
        </h3>
      </div>
      <div className="user-detail-content">
        <div>
          <strong>Role:</strong> {displayRole(user)}
          {user.subRole ? ` – ${user.subRole}` : ''}
        </div>
        {user.role === 'bot' && <div className="bot-hint">Automated avatar</div>}
      </div>
    </div>
  );
}
