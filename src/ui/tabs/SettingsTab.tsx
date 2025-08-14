import { UserPreferences } from './UserPreferences';

export function SettingsTab(): JSX.Element {
  return (
    <div className="settings-tab">
      <h2>Settings</h2>
      <UserPreferences />
    </div>
  );
}
