import { useEffect, useState, useRef } from 'react';
import './DesktopGate.css';

function detectMobile(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isSmall = window.innerWidth < 992;
  return isUA || isSmall;
}

export function DesktopGate(): JSX.Element | null {
  const [blocked, setBlocked] = useState(() => detectMobile());
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (blocked && btnRef.current) btnRef.current.focus();
  }, [blocked]);

  useEffect(() => {
    function handleResize() {
      setBlocked(detectMobile());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!blocked) return null;

  return (
    <div className="desktop-gate" role="dialog" aria-modal="true">
      <div className="gate-box">
        <p>Growverse is desktop-only for now.</p>
        <p>
          <a href="/about" className="learn-more">
            Learn more
          </a>
        </p>
        <button ref={btnRef} className="dismiss" onClick={() => setBlocked(false)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
