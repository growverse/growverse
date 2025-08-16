import { useEffect, useState } from 'react';
import { worldBridge } from '@/world/bridge/worldBridge';
import type { UserSnapshot } from '@/world/types';

export function PreferencesHUDPanel(): JSX.Element {
  const [user, setUser] = useState<UserSnapshot | null>(() => worldBridge.user.get());
  useEffect(() => {
    const unsub = worldBridge.user.subscribe(() => {
      setUser(worldBridge.user.get());
    });
    return () => {
      unsub();
    };
  }, []);
  if (!user) return <div className="hud-panel" />;
  const p = user.preferences;
  return (
    <div className="hud-panel">
      <div>Role: {user.role}</div>
      <div>SubRole: {user.subRole}</div>
      <div>Time format: {p.timezone}</div>
      <div>Performance/Quality: {p.graphics}</div>
      <div>Notifications: {p.notifications ? 'On' : 'Off'}</div>
      <div>Theme: {p.theme === 'dark' ? 'Dark' : 'Light'}</div>
      <div>Language: {p.language}</div>
      <div>Audio volume: {p.audioVolume}</div>
      <div>Mic enabled: {p.micEnabled ? 'On' : 'Off'}</div>
      <div>Chat enabled: {p.chatEnabled ? 'On' : 'Off'}</div>
    </div>
  );
}
