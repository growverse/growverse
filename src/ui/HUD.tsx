import { useEffect, useState } from 'react';
import { runtime } from '@/state/runtime';
import styles from './HUD.module.css';

export function HUD(): JSX.Element {
  const [pos, setPos] = useState(runtime.avatar);
  useEffect(() => {
    const id = setInterval(() => {
      setPos({ ...runtime.avatar });
    }, 100);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={styles.hud} aria-label="position">
      {pos.x.toFixed(1)}, {pos.y.toFixed(1)}, {pos.z.toFixed(1)}
    </div>
  );
}
