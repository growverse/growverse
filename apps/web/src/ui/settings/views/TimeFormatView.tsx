import { useUserStore, updatePreferences } from '@/state/userStore';

type Props = {
  onBack: () => void;
};

export default function TimeFormatView({ onBack }: Props): JSX.Element {
  const { state } = useUserStore();
  const prefs = state.user.preferences;
  return (
    <div className="time-format-view">
      <div className="settings-detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h3>User Preferences / Time Format</h3>
      </div>
      <div className="settings-detail-content">
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
