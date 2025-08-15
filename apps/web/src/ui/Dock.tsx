import { useState, useEffect, useCallback } from 'react';
import { useLocalUser } from '@/state/userStore';
import { InfoTab } from '@/ui/tabs/InfoTab';
import { ChatTab } from '@/ui/tabs/ChatTab';
import { SettingsTab } from '@/ui/tabs/SettingsTab';
import { UsersTab } from '@/ui/users/UsersTab';
import { TeleportTab } from '@/ui/teleport/TeleportTab';
import AdminPanel from '@/ui/admin/AdminPanel';
import { useTeleportEnabled } from '@/state/systemStore';
import './dock.css';

type Tab = 'info' | 'users' | 'chat' | 'teleport' | 'settings' | 'admin';

export function Dock(): JSX.Element {
  const [active, setActive] = useState<Tab>('info');
  const local = useLocalUser();
  const isAdmin = local?.isAdmin;
  const teleportEnabled = useTeleportEnabled();

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === '1') setActive('info');
      if (e.key === '2') setActive('users');
      if (e.key === '3') setActive('chat');
      if (e.key === '4') {
        if (teleportEnabled) setActive('teleport');
        else setActive('settings');
      }
      if (e.key === '5') {
        if (teleportEnabled) setActive('settings');
        else if (isAdmin) setActive('admin');
      }
      if (e.key === '6' && teleportEnabled && isAdmin) setActive('admin');
    },
    [isAdmin, teleportEnabled],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (!isAdmin && active === 'admin') setActive('info');
    if (!teleportEnabled && active === 'teleport') setActive('info');
  }, [isAdmin, active, teleportEnabled]);

  return (
    <div className="dock" id="dock">
      <div className="tabs" role="tablist">
        <button
          className={active === 'info' ? 'tab active' : 'tab'}
          onClick={() => setActive('info')}
          aria-label="Info"
          role="tab"
          aria-selected={active === 'info'}
        >
          ℹ️
        </button>
        <button
          className={active === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActive('users')}
          aria-label="Users"
          role="tab"
          aria-selected={active === 'users'}
        >
          👥
        </button>
        <button
          className={active === 'chat' ? 'tab active' : 'tab'}
          onClick={() => setActive('chat')}
          aria-label="Chat"
          role="tab"
          aria-selected={active === 'chat'}
        >
          💬
        </button>
        {teleportEnabled && (
          <button
            className={active === 'teleport' ? 'tab active' : 'tab'}
            onClick={() => setActive('teleport')}
            aria-label="Teleport"
            role="tab"
            aria-selected={active === 'teleport'}
          >
            🚀
          </button>
        )}
        <button
          className={active === 'settings' ? 'tab active' : 'tab'}
          onClick={() => setActive('settings')}
          aria-label="Settings"
          role="tab"
          aria-selected={active === 'settings'}
        >
          ⚙️
        </button>
        {isAdmin && (
          <button
            className={active === 'admin' ? 'tab active' : 'tab'}
            onClick={() => setActive('admin')}
            aria-label="Admin"
            role="tab"
            aria-selected={active === 'admin'}
          >
            🛠️
          </button>
        )}
      </div>
      <div className="content" role="tabpanel">
        {active === 'info' && <InfoTab />}
        {active === 'users' && <UsersTab />}
        {active === 'chat' && <ChatTab />}
        {teleportEnabled && active === 'teleport' && <TeleportTab />}
        {active === 'settings' && <SettingsTab />}
        {isAdmin && active === 'admin' && <AdminPanel />}
      </div>
    </div>
  );
}
