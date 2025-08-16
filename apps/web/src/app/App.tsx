import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { AppRoutes } from './router';
import { useHydrateAuthToWorld } from '@/features/world-sync/useHydrateAuthToWorld';

export function App(): JSX.Element {
  const location = useLocation();
  const showNav = location.pathname !== '/world';
  useHydrateAuthToWorld();
  return (
    <>
      {showNav && <Navbar />}
      <AppRoutes />
    </>
  );
}
