import { useEffect, useRef } from 'react';
import { bootstrapWorld } from './bootstrapWorld';

export function WorldCanvas(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cleanup = bootstrapWorld(ref.current);
    return () => {
      cleanup();
    };
  }, []);

  return <div ref={ref} />;
}
