import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/auth/AuthContext';
import { Layout } from './Layout';
import { App as GardenApp } from './App';
import Landing from '@/pages/Landing/Landing';
import About from '@/pages/About/About';
import Login from '@/pages/Auth/Login';
import Signup from '@/pages/Auth/Signup';
import Profile from '@/pages/Profile/Profile';
import SessionList from '@/pages/Session/SessionList';
import SessionCreate from '@/pages/Session/SessionCreate';
import SessionLeave from '@/pages/Session/SessionLeave';

export function AppRouter(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/garden" element={<GardenApp />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/session" element={<SessionList />} />
            <Route path="/session/create" element={<SessionCreate />} />
            <Route path="/session/leave" element={<SessionLeave />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
