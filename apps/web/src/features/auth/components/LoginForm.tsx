import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginForm(): JSX.Element {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await login({ username, password });
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
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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
