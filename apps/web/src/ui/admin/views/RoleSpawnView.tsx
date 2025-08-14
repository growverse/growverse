import { AdminRoleSwitcher } from '../AdminRoleSwitcher';

type Props = {
  onBack: () => void;
};

export default function RoleSpawnView({ onBack }: Props): JSX.Element {
  return (
    <div className="role-spawn-view">
      <div className="admin-detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h3>Admin / Role Spawn</h3>
      </div>
      <div className="admin-detail-content">
        <AdminRoleSwitcher />
      </div>
    </div>
  );
}
