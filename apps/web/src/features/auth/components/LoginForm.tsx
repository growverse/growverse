import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginForm(): JSX.Element {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await login({ userId });
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || 'Login failed');
    }
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      className="card"
      style={{ maxWidth: '320px', margin: '0 auto' }}
    >
      <h1>Login</h1>
      <div className="form-grid">
        <label>
          User ID
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            aria-label="User ID"
          />
        </label>
      </div>
      <button className="btn" type="submit">
        Login
      </button>
      {success && <p>Logged in!</p>}
      {error && (
        <p role="alert" style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </form>
  );
}

export default LoginForm;

