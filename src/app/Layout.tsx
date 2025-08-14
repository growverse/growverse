import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import './app.css';

export function Layout(): JSX.Element {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}
