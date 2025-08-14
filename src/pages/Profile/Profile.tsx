import { useAuth } from '@/context/auth/AuthContext';

export default function Profile(): JSX.Element {
  const { user } = useAuth();
  if (!user) return <p>Not logged in.</p>;
  return (
    <div>
      <h1>Profile</h1>
      <div style={{ display: 'grid', gap: '0.5rem', maxWidth: '300px' }}>
        <label>
          Username
          <input value={user.username} readOnly />
        </label>
      </div>
    </div>
  );
}
