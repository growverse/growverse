import { useState } from 'react';
import { AdminRoleSwitcher } from '@/ui/admin/AdminRoleSwitcher';
import { AdminBotAvatars } from '@/ui/admin/AdminBotAvatars';

type AdminView = 'menu' | 'roleSpawn' | 'botAvatars';

export function AdminTab(): JSX.Element {
  const [view, setView] = useState<AdminView>('menu');

  const showMenu = () => setView('menu');

  let content: JSX.Element;
  if (view === 'roleSpawn') {
    content = (
      <div>
        <button onClick={showMenu}>Back</button>
        <h3>Role Spawn</h3>
        <AdminRoleSwitcher />
      </div>
    );
  } else if (view === 'botAvatars') {
    content = (
      <div>
        <button onClick={showMenu}>Back</button>
        <h3>Bot Avatars</h3>
        <AdminBotAvatars />
      </div>
    );
  } else {
    content = (
      <ul>
        <li>
          <button onClick={() => setView('roleSpawn')}>Role Spawn</button>
        </li>
        <li>
          <button onClick={() => setView('botAvatars')}>Bot Avatars</button>
        </li>
      </ul>
    );
  }

  return (
    <div className="admin-tab">
      <h2>Admin</h2>
      {content}
    </div>
  );
}
