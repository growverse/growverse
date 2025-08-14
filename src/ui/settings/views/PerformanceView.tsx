import { setPerformancePreset, useUserStore } from '@/state/userStore';
import { applyCurrentPreset } from '@/engine/perf/presets';
import { PerformancePreset } from '@/types/preferences';

interface Props {
  onBack: () => void;
}

export default function PerformanceView({ onBack }: Props): JSX.Element {
  const { state } = useUserStore();
  const prefs = state.user.preferences;

  function onChange(preset: PerformancePreset) {
    setPerformancePreset(preset);
    applyCurrentPreset();
  }

  return (
    <div className="performance-view">
      <div className="settings-detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h3>User Preferences / Performance</h3>
      </div>
      <div className="settings-detail-content">
        <label>
          <input
            type="radio"
            name="perf"
            checked={prefs.performancePreset === 'low'}
            onChange={() => onChange('low')}
          />
          Low
        </label>
        <label>
          <input
            type="radio"
            name="perf"
            checked={prefs.performancePreset === 'medium'}
            onChange={() => onChange('medium')}
          />
          Medium
        </label>
        <label>
          <input
            type="radio"
            name="perf"
            checked={prefs.performancePreset === 'high'}
            onChange={() => onChange('high')}
          />
          High
        </label>
      </div>
    </div>
  );
}
