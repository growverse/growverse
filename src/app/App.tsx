import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import Landing from '@/pages/Landing/Landing';
import About from '@/pages/About/About';
import Auth from '@/pages/Auth/Auth';
import World from '@/pages/World';

export function App(): JSX.Element {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/world" element={<World />} />
      </Routes>
    </>
  );
}
