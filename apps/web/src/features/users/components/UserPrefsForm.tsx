import { useEffect, useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.client';
import type { UserPreferences, GraphicsQuality } from '@/world/types';
import { worldBridge } from '@/world/bridge/worldBridge';

export function UserPrefsForm({ userId }: { userId: string }): JSX.Element {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['userPrefs', userId], queryFn: () => usersApi.getPrefs(userId) });
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  useEffect(() => { if (data) setPrefs(data); }, [data]);
  const mutation = useMutation<UserPreferences, unknown, UserPreferences>({
    mutationFn: (patch) => usersApi.updatePrefs(userId, patch),
    onSuccess: (updated) => {
      worldBridge.user.update({ preferences: updated });
      qc.invalidateQueries({ queryKey: ['user', userId] }).catch(() => {});
      qc.invalidateQueries({ queryKey: ['userPrefs', userId] }).catch(() => {});
    },
  });
  if (!prefs) return <div>Loading...</div>;
  const handleChange = (patch: Partial<UserPreferences>) => setPrefs({ ...prefs, ...patch });
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); mutation.mutate(prefs); };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Language
        <input value={prefs.language} onChange={(e) => handleChange({ language: e.target.value })} />
      </label>
      <label>
        Timezone
        <input value={prefs.timezone} onChange={(e) => handleChange({ timezone: e.target.value })} />
      </label>
      <label>
        Graphics
        <select value={prefs.graphics} onChange={(e) => handleChange({ graphics: e.target.value as GraphicsQuality })}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </label>
      <label>
        Audio Volume
        <input type="number" min={0} max={100} value={prefs.audioVolume} onChange={(e) => handleChange({ audioVolume: Number(e.target.value) })} />
      </label>
      <label>
        <input type="checkbox" checked={prefs.micEnabled} onChange={(e) => handleChange({ micEnabled: e.target.checked })} />
        Mic Enabled
      </label>
      <label>
        <input type="checkbox" checked={prefs.chatEnabled} onChange={(e) => handleChange({ chatEnabled: e.target.checked })} />
        Chat Enabled
      </label>
      <label>
        <input type="checkbox" checked={prefs.notifications} onChange={(e) => handleChange({ notifications: e.target.checked })} />
        Notifications
      </label>
      <label>
        Theme
        <select value={prefs.theme} onChange={(e) => handleChange({ theme: e.target.value as 'dark' | 'light' })}>
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </label>
      <button type="submit" disabled={mutation.isPending}>Save</button>
      {mutation.isSuccess && <p role="status">Saved</p>}
    </form>
  );
}
