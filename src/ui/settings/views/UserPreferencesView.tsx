import { SettingsRoute } from '../settingsRoutes';

type Props = {
  onNavigate: (route: SettingsRoute) => void;
};

export default function UserPreferencesView({ onNavigate }: Props): JSX.Element {
  return (
    <div className="settings-home">
      <h2>User Preferences</h2>
      <ul className="settings-home-list">
        <li>
          <button className="settings-home-item" onClick={() => onNavigate(SettingsRoute.TimeFormat)}>
            <span className="icon">🕒</span>
            <div className="text">
              <div className="title">Time Format</div>
              <div className="desc">Choose 24h or 12h display.</div>
            </div>
            <span className="chevron">›</span>
          </button>
        </li>
        <li>
          <button className="settings-home-item" onClick={() => onNavigate(SettingsRoute.Notifications)}>
            <span className="icon">🔔</span>
            <div className="text">
              <div className="title">Notifications</div>
              <div className="desc">Enable desktop notifications.</div>
            </div>
            <span className="chevron">›</span>
          </button>
        </li>
        <li>
          <button className="settings-home-item" onClick={() => onNavigate(SettingsRoute.Theme)}>
            <span className="icon">🎨</span>
            <div className="text">
              <div className="title">Theme</div>
              <div className="desc">Toggle dark mode.</div>
            </div>
            <span className="chevron">›</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
