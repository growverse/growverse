import { Routes, Route } from 'react-router-dom';
import Landing from '@/pages/Landing/Landing';
import About from '@/pages/About/About';
import World from '@/pages/World';
import SessionLeave from '@/pages/Session/SessionLeave';
import Profile from '@/pages/Profile/Profile';
import SessionCreate from '@/pages/Session/SessionCreate';
import SessionDetail from '@/pages/Session/SessionDetail';
import SignUpPage from '@/features/users/pages/SignUpPage';

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/world" element={<World />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/session/create" element={<SessionCreate />} />
      <Route path="/session/leave" element={<SessionLeave />} />
      <Route path="/session/:sessionId" element={<SessionDetail />} />
      <Route path="/sign-up" element={<SignUpPage />} />
    </Routes>
  );
}
