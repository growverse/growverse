import { useState } from 'react';
import { botControls } from '@/state/bots';

export function AdminBotsPanel(): JSX.Element {
  const [count, setCount] = useState(0);
  const [enabled, setEnabled] = useState(false);

  const onCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(50, Number(e.target.value)));
    setCount(value);
    if (enabled) botControls.setCount(value);
  };

  const onEnableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setEnabled(checked);
    botControls.setEnabled(checked);
    if (checked) botControls.setCount(count);
  };

  return (
    <div className="admin-bots-panel">
      <label>
        Bot count:
        <input type="number" min={0} max={50} value={count} onChange={onCountChange} />
      </label>
      <label>
        <input type="checkbox" checked={enabled} onChange={onEnableChange} /> Enable Bot Avatars
      </label>
    </div>
  );
}
