import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export default function Auth(): JSX.Element {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    login();
    navigate('/');
  }

  return (
    <div className="container">
      <form className="card" onSubmit={onSubmit} style={{ maxWidth: '320px', margin: '0 auto' }}>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <div className="form-grid">
          <input placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          {!isLogin && <input type="password" placeholder="Confirm Password" required />}
          <button className="btn" type="submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
        <button
          className="btn secondary"
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          style={{ marginTop: '1rem' }}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
        </button>
      </form>
    </div>
  );
}
