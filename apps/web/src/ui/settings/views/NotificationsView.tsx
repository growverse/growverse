import { useUserStore, updatePreferences } from '@/state/userStore';

type Props = {
  onBack: () => void;
};

export default function NotificationsView({ onBack }: Props): JSX.Element {
  const { state } = useUserStore();
  const prefs = state.user.preferences;
  return (
    <div className="notifications-view">
      <div className="settings-detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h3>User Preferences / Notifications</h3>
      </div>
      <div className="settings-detail-content">
        <label>
          <input
            type="checkbox"
            checked={prefs.enableNotifications}
            onChange={(e) => updatePreferences({ enableNotifications: e.target.checked })}
          />
          Enable notifications
        </label>
      </div>
    </div>
  );
}
