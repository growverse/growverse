import { useEffect, useState } from 'react';
import { runtime } from '@/state/runtime';
import * as utils from '@/core/utils';

interface AvatarState {
  x: number;
  y: number;
  z: number;
  rotY: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function fmtTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = pad(Math.floor(total / 3600));
  const m = pad(Math.floor((total % 3600) / 60));
  const s = pad(total % 60);
  return `${h}:${m}:${s}`;
}

export function InfoTab(): JSX.Element {
  const [avatar, setAvatar] = useState<AvatarState>({ x: 0, y: 0, z: 0, rotY: 0 });
  const [clock, setClock] = useState(new Date());
  const [remaining, setRemaining] = useState(20 * 60 * 1000);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const sessionEnd = Date.now() + 20 * 60 * 1000;
    const posTimer = setInterval(() => {
      setAvatar({
        x: runtime.avatar.x,
        y: runtime.avatar.y,
        z: runtime.avatar.z,
        rotY: runtime.avatar.rotY,
      });
    }, 100);
    const timeTimer = setInterval(() => {
      const now = new Date();
      setClock(now);
      const rem = Math.max(0, sessionEnd - now.getTime());
      setRemaining(rem);
      setFinished(rem === 0);
    }, 1000);
    return () => {
      clearInterval(posTimer);
      clearInterval(timeTimer);
    };
  }, []);

  const heading = ((utils.deg(avatar.rotY) % 360) + 360) % 360;
  const clockStr = `${pad(clock.getHours())}:${pad(clock.getMinutes())}:${pad(clock.getSeconds())}`;

  return (
    <div className="info-tab">
      <div>Session name: Garden Session</div>
      <div>
        Position: {utils.fmt(avatar.x)} / {utils.fmt(avatar.y)} / {utils.fmt(avatar.z)}
      </div>
      <div>Rot Y: {heading.toFixed(1)}</div>
      <div>System time: {clockStr}</div>
      <div>Online users: 1</div>
      <div>
        Time left: {fmtTime(remaining)}{finished ? ' • Session finished' : ''}
      </div>
    </div>
  );
}
