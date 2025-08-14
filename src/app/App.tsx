import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import Landing from '@/pages/Landing/Landing';
import About from '@/pages/About/About';
import Auth from '@/pages/Auth/Auth';
import World from '@/pages/World';
import SessionLeave from '@/pages/Session/SessionLeave';
import Profile from '@/pages/Profile/Profile';
import SessionCreate from '@/pages/Session/SessionCreate';
import SessionLogin from '@/pages/Session/SessionLogin';
import SessionDetail from '@/pages/Session/SessionDetail';

export function App(): JSX.Element {
  const location = useLocation();
  const showNav = location.pathname !== '/world';
  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/world" element={<World />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/session/login" element={<SessionLogin />} />
        <Route path="/session/create" element={<SessionCreate />} />
        <Route path="/session/leave" element={<SessionLeave />} />
        <Route path="/session/:sessionId" element={<SessionDetail />} />
      </Routes>
    </>
  );
}
