import { Navigate } from 'react-router-dom';
import { SignUpForm } from '../components/SignUpForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function SignUpPage(): JSX.Element {
  const { status } = useAuth();
  if (status === 'authenticated') return <Navigate to="/" replace />;
  return (
    <div className="container">
      <SignUpForm />
    </div>
  );
}
