import { AdminRoute } from '../adminRoutes';

type Props = {
  onNavigate: (route: AdminRoute) => void;
};

export default function AdminHome({ onNavigate }: Props): JSX.Element {
  return (
    <div className="admin-home">
      <h2>Admin</h2>
      <ul className="admin-home-list">
        <li>
          <button className="admin-home-item" onClick={() => onNavigate(AdminRoute.RoleSpawn)}>
            <span className="icon">🧭</span>
            <div className="text">
              <div className="title">Role Spawn</div>
              <div className="desc">
                Temporarily become Learner/Instructor and teleport to the appropriate spawn point.
              </div>
            </div>
            <span className="chevron">›</span>
          </button>
        </li>
        <li>
          <button className="admin-home-item" onClick={() => onNavigate(AdminRoute.BotAvatars)}>
            <span className="icon">🤖</span>
            <div className="text">
              <div className="title">Bot Avatars</div>
              <div className="desc">
                Spawn/remove up to 50 bot avatars in the glassroom. Names: Bot - #n.
              </div>
            </div>
            <span className="chevron">›</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
