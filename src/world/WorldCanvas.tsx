import { useEffect, useRef } from 'react';
import { bootstrapWorld } from './bootstrap';

export function WorldCanvas(): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const div = ref.current;
    if (!div) return;
    const cleanup = bootstrapWorld({ container: div, config: { useBVH: false } });
    return () => cleanup();
  }, []);
  return <div ref={ref} />;
}
