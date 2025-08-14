import { useAuth } from '@/context/auth/AuthContext';

export default function Profile(): JSX.Element {
  const { user } = useAuth();
  if (!user) return <p>Not logged in.</p>;
  return (
    <div className="card" style={{ maxWidth: '320px', margin: '0 auto' }}>
      <h1>Profile</h1>
      <div className="form-grid">
        <label>
          Username
          <input value={user.username} readOnly />
        </label>
      </div>
    </div>
  );
}
