import { useState } from 'react';
import { SettingsRoute } from './settingsRoutes';
import UserPreferencesView from './views/UserPreferencesView';
import TimeFormatView from './views/TimeFormatView';
import NotificationsView from './views/NotificationsView';
import ThemeView from './views/ThemeView';
import './settings.css';

export default function SettingsPanel(): JSX.Element {
  const [route, setRoute] = useState<SettingsRoute>(SettingsRoute.UserPreferences);

  if (route === SettingsRoute.TimeFormat) {
    return <TimeFormatView onBack={() => setRoute(SettingsRoute.UserPreferences)} />;
  }
  if (route === SettingsRoute.Notifications) {
    return <NotificationsView onBack={() => setRoute(SettingsRoute.UserPreferences)} />;
  }
  if (route === SettingsRoute.Theme) {
    return <ThemeView onBack={() => setRoute(SettingsRoute.UserPreferences)} />;
  }

  return <UserPreferencesView onNavigate={setRoute} />;
}
