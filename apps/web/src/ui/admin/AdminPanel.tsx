import { useState } from 'react';
import { AdminRoute } from './adminRoutes';
import AdminHome from './views/AdminHome';
import RoleSpawnView from './views/RoleSpawnView';
import BotAvatarsView from './views/BotAvatarsView';
import './admin.css';

export default function AdminPanel(): JSX.Element {
  const [route, setRoute] = useState<AdminRoute>(AdminRoute.Home);

  if (route === AdminRoute.RoleSpawn) {
    return <RoleSpawnView onBack={() => setRoute(AdminRoute.Home)} />;
  }

  if (route === AdminRoute.BotAvatars) {
    return <BotAvatarsView onBack={() => setRoute(AdminRoute.Home)} />;
  }

  return <AdminHome onNavigate={setRoute} />;
}
