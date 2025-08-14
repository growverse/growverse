import { useState } from 'react';
import { useUserStore, updatePreferences } from '@/state/userStore';

type View = 'root' | 'time' | 'notifications' | 'theme';

export function UserPreferences(): JSX.Element {
  const { state } = useUserStore();
  const prefs = state.user.preferences;
  const [view, setView] = useState<View>('root');

  if (view === 'time') {
    return (
      <div>
        <button onClick={() => setView('root')}>Back</button>
        <h3>Time Format</h3>
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
      </div>
    );
  }

  if (view === 'notifications') {
    return (
      <div>
        <button onClick={() => setView('root')}>Back</button>
        <h3>Notifications</h3>
        <label>
          <input
            type="checkbox"
            checked={prefs.enableNotifications}
            onChange={(e) => updatePreferences({ enableNotifications: e.target.checked })}
          />
          Enable notifications
        </label>
      </div>
    );
  }

  if (view === 'theme') {
    return (
      <div>
        <button onClick={() => setView('root')}>Back</button>
        <h3>Theme</h3>
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

  return (
    <div>
      <h3>User Preferences</h3>
      <ul>
        <li>
          <button onClick={() => setView('time')}>Time Format</button>
        </li>
        <li>
          <button onClick={() => setView('notifications')}>Notifications</button>
        </li>
        <li>
          <button onClick={() => setView('theme')}>Theme</button>
        </li>
      </ul>
    </div>
  );
}

