import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { AppRoutes } from './router';

export function App(): JSX.Element {
  const location = useLocation();
  const showNav = location.pathname !== '/world';
  return (
    <>
      {showNav && <Navbar />}
      <AppRoutes />
    </>
  );
}
