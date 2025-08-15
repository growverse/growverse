import { useEffect, useState } from 'react';
import { runtime } from '@/state/runtime';
import * as utils from '@/core/utils';
import { useLocalUser } from '@/state/userStore';
import { RoleLabels } from '@/domain/roles';
import { useSessionStore } from '@/state/sessionStore';
import { formatCountdown, clampToZero } from '@/utils/time';
import { destroyWorld } from '@/world/lifecycle';

interface AvatarState {
  x: number;
  y: number;
  z: number;
  rotY: number;
}

function formatTimePref(str24: string, fmt: '24h' | '12h'): string {
  if (fmt === '24h') return str24;
  const [h, m, s] = str24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h12)}:${pad(m)}:${pad(s)} ${ampm}`;
}

export function InfoTab(): JSX.Element {
  const [avatar, setAvatar] = useState<AvatarState>({ x: 0, y: 0, z: 0, rotY: 0 });
  const [fps, setFps] = useState(0);
  const [now, setNow] = useState(Date.now());
  const local = useLocalUser();
  const { activeSession } = useSessionStore();

  useEffect(() => {
    const posTimer = setInterval(() => {
      setAvatar({
        x: runtime.avatar.x,
        y: runtime.avatar.y,
        z: runtime.avatar.z,
        rotY: runtime.avatar.rotY,
      });
      setFps(runtime.fps);
    }, 100);
    const clockTimer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      clearInterval(posTimer);
      clearInterval(clockTimer);
    };
  }, []);

  const heading = ((utils.deg(avatar.rotY) % 360) + 360) % 360;
  const timeStr = activeSession
    ? formatTimePref(activeSession.currentTime, local.preferences.timeFormat)
    : '';
  const remainingMs = activeSession ? clampToZero(activeSession.countdownEndAt - now) : 0;
  const finished = remainingMs === 0;

  function handleCopyUrl() {
    void navigator.clipboard.writeText(window.location.href);
  }

  function handleLeaveSession() {
    const params = new URLSearchParams();
    if (activeSession) {
      params.set('name', activeSession.name);
      params.set('currentLearners', String(activeSession.currentLearners));
      params.set('maxLearners', String(activeSession.maxLearners));
      params.set('currentTime', activeSession.currentTime);
      params.set('currentTimezone', activeSession.currentTimezone);
    }
    destroyWorld();
    const query = params.toString();
    const url = query ? `/session/leave?${query}` : '/session/leave';
    window.location.href = url;
  }

  return (
    <div className="info-tab">
      {local && (
        <div className="info-section">
          <h3>User</h3>
          <div>
            {local.name}{' '}
            <span
              style={{
                background: RoleLabels[local.role].color,
                color: '#fff',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {RoleLabels[local.role].label}
              {local.subRole ? ` > ${local.subRole}` : ''}
            </span>
          </div>
        </div>
      )}
      {activeSession && (
        <div className="info-section">
          <h3>Session</h3>
          <div>
            {activeSession.name}
            {activeSession.instanceTitle ? ` – ${activeSession.instanceTitle}` : ''}
          </div>
          <div>
            {activeSession.currentLearners} / {activeSession.maxLearners} learners
          </div>
          <div>
            Time: {timeStr} ({activeSession.currentTimezone})
          </div>
          <div>
            Countdown: {formatCountdown(remainingMs)}{' '}
            {finished && <span className="finished-badge pulse">Session finished</span>}
          </div>
        </div>
      )}
      <div className="info-section">
        <h3>Metrics</h3>
        <div>
          Position: {utils.fmt(avatar.x)} / {utils.fmt(avatar.y)} / {utils.fmt(avatar.z)}
        </div>
        <div>Rot Y: {heading.toFixed(1)}</div>
        <div>FPS: {fps.toFixed(1)}</div>
      </div>
      {activeSession && (
        <div className="info-actions">
          <button className="btn" onClick={handleCopyUrl}>
            Copy session URL
          </button>
          <button className="btn danger" onClick={handleLeaveSession}>
            Leave session
          </button>
        </div>
      )}
    </div>
  );
}
