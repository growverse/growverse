import { useEffect, useRef } from 'react';
import { bootstrapWorld } from './bootstrapWorld';

export function WorldCanvas(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let cleanup: (() => void) | undefined;
    const prevOverflow = document.body.style.overflow;
    const prevBg = document.body.style.background;
    document.body.style.overflow = 'hidden';
    document.body.style.background = '#000';
    void bootstrapWorld(ref.current).then((fn) => {
      cleanup = fn;
    });
    return () => {
      cleanup?.();
      document.body.style.overflow = prevOverflow;
      document.body.style.background = prevBg;
    };
  }, []);

  return <div ref={ref} />;
}
