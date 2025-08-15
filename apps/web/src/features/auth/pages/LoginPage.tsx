import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage(): JSX.Element {
  const { status } = useAuth();
  if (status === 'authenticated') return <Navigate to="/" replace />;
  return <LoginForm />;
}
