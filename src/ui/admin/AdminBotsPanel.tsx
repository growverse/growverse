import { useState } from 'react';
import { botControls } from '@/state/bots';

export function AdminBotsPanel(): JSX.Element {
  const [count, setCount] = useState(0);

  const onCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(50, Number(e.target.value)));
    setCount(value);
  };

  const apply = () => {
    botControls.setEnabled(true);
    botControls.setCount(count);
  };

  const reset = () => {
    setCount(0);
    botControls.setCount(0);
    botControls.setEnabled(false);
  };

  return (
    <div className="admin-bots-panel">
      <label>
        Bot count:
        <input type="number" min={0} max={50} value={count} onChange={onCountChange} />
      </label>
      <div className="buttons">
        <button onClick={apply}>Apply</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
