import { useUserStore, updatePreferences } from '@/state/userStore';

type Props = {
  onBack: () => void;
};

export default function ThemeView({ onBack }: Props): JSX.Element {
  const { state } = useUserStore();
  const prefs = state.user.preferences;
  return (
    <div className="theme-view">
      <div className="settings-detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h3>User Preferences / Theme</h3>
      </div>
      <div className="settings-detail-content">
        <label>
          <input
            type="checkbox"
            checked={prefs.enableDarkMode}
            onChange={(e) => updatePreferences({ enableDarkMode: e.target.checked })}
          />
          Dark mode
        </label>
      </div>
    </div>
  );
}
