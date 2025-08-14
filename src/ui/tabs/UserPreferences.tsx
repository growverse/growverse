import { useUserStore, updatePreferences } from '@/state/userStore';

export function UserPreferences(): JSX.Element {
  const { state } = useUserStore();
  const prefs = state.user.preferences;

  return (
    <div>
      <h3>User Preferences</h3>
      <div>
        <label>
          <input
            type="radio"
            name="timefmt"
            checked={prefs.timeFormat === '24h'}
            onChange={() => updatePreferences({ timeFormat: '24h' })}
          />
          24h
        </label>
        <label>
          <input
            type="radio"
            name="timefmt"
            checked={prefs.timeFormat === '12h'}
            onChange={() => updatePreferences({ timeFormat: '12h' })}
          />
          12h
        </label>
      </div>
      <label>
        <input
          type="checkbox"
          checked={prefs.enableNotifications}
          onChange={(e) => updatePreferences({ enableNotifications: e.target.checked })}
        />
        Enable notifications
      </label>
      <label>
        <input
          type="checkbox"
          checked={prefs.enableDarkMode}
          onChange={(e) => updatePreferences({ enableDarkMode: e.target.checked })}
        />
        Dark mode
      </label>
    </div>
  );
}
