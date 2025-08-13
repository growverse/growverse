export function SettingsTab(): JSX.Element {
  return (
    <div className="settings-tab">
      <h2>Settings</h2>
      <label><input type="checkbox" /> Enable notifications</label>
      <label><input type="checkbox" /> Dark mode</label>
      <label><input type="checkbox" /> Experimental feature</label>
    </div>
  );
}
