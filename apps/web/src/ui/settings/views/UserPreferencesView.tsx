import { UserPrefsForm } from '@/features/users/components/UserPrefsForm';
import { useLocalUser } from '@/state/userStore';

export default function UserPreferencesView(): JSX.Element {
  const user = useLocalUser();
  return (
    <div className="settings-home">
      <h2>User Preferences</h2>
      <UserPrefsForm userId={user.id} />
    </div>
  );
}
