import { useMemo, useState } from 'react';
import type { AvatarUser } from '@/domain/roles';
import { useOnlineUsers } from '@/state/userStore';
import { UsersList } from './UsersList';
import { UserDetail } from './UserDetail';
import { rolePriority } from './types';

export function UsersTab(): JSX.Element {
  const users = useOnlineUsers();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AvatarUser | null>(null);

  const filtered = useMemo(() => {
    return users
      .filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const pr = rolePriority(a.role) - rolePriority(b.role);
        if (pr !== 0) return pr;
        return a.name.localeCompare(b.name);
      });
  }, [users, query]);

  if (selected) {
    return <UserDetail user={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="users-tab" role="tabpanel">
      <h2>Users</h2>
      <input
        className="user-search"
        type="text"
        placeholder="Search by name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <UsersList users={filtered} onSelect={setSelected} />
    </div>
  );
}
