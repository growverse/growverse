import { FormEvent } from 'react';
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
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div>
        <input placeholder="Username" required />
      </div>
      <div>
        <input type="password" placeholder="Password" required />
      </div>
      <button type="submit">Create Account</button>
    </form>
  );
}
