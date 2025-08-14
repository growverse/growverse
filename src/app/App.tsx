// No React import needed for JSX in React 18+
import { NameTag } from '@/ui/NameTag';
import { PortalUI } from '@/ui/PortalUI';
import { Dock } from '@/ui/Dock';
import { DesktopGate } from '@/components/DesktopGate/DesktopGate';
import { SessionProvider } from '@/state/sessionStore';
import { UserProvider } from '@/state/userStore';

export function App(): JSX.Element {
  return (
    <UserProvider>
      <SessionProvider>
        <DesktopGate />
        <NameTag name="macaris64" />
        <PortalUI />
        <Dock />
      </SessionProvider>
    </UserProvider>
  );
}
