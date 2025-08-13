import { useState, useEffect, useCallback } from 'react';
import { InfoTab } from '@/ui/tabs/InfoTab';
import { ChatTab } from '@/ui/tabs/ChatTab';
import { SettingsTab } from '@/ui/tabs/SettingsTab';
import { AdminTab } from '@/ui/tabs/AdminTab';
import './dock.css';

type Tab = 'info' | 'chat' | 'settings' | 'admin';

export function Dock(): JSX.Element {
  const [active, setActive] = useState<Tab>('info');

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!e.altKey) return;
    if (e.key === '1') setActive('info');
    if (e.key === '2') setActive('chat');
    if (e.key === '3') setActive('settings');
    if (e.key === '4') setActive('admin');
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div className="dock" id="dock">
      <div className="tabs">
        <button
          className={active === 'info' ? 'tab active' : 'tab'}
          onClick={() => setActive('info')}
          aria-label="Info"
        >
          ℹ️
        </button>
        <button
          className={active === 'chat' ? 'tab active' : 'tab'}
          onClick={() => setActive('chat')}
          aria-label="Chat"
        >
          💬
        </button>
        <button
          className={active === 'settings' ? 'tab active' : 'tab'}
          onClick={() => setActive('settings')}
          aria-label="Settings"
        >
          ⚙️
        </button>
        <button
          className={active === 'admin' ? 'tab active' : 'tab'}
          onClick={() => setActive('admin')}
          aria-label="Admin"
        >
          🛠️
        </button>
      </div>
      <div className="content">
        {active === 'info' && <InfoTab />}
        {active === 'chat' && <ChatTab />}
        {active === 'settings' && <SettingsTab />}
        {active === 'admin' && <AdminTab />}
      </div>
    </div>
  );
}

