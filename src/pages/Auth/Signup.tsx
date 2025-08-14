import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';

export default function Signup(): JSX.Element {
  const { login } = useAuth();
  const navigate = useNavigate();
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    login();
    navigate('/');
  }
  return (
    <form className="card" onSubmit={onSubmit} style={{ maxWidth: '320px', margin: '0 auto' }}>
      <h1>Sign Up</h1>
      <div className="form-grid">
        <input placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button className="btn" type="submit">
          Create Account
        </button>
      </div>
    </form>
  );
}
