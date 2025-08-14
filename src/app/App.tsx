// No React import needed for JSX in React 18+
import { NameTag } from '@/ui/NameTag';
import { PortalUI } from '@/ui/PortalUI';
import { Dock } from '@/ui/Dock';
import { DesktopGate } from '@/components/DesktopGate/DesktopGate';
import { SessionProvider } from '@/state/sessionStore';
import { UserProvider } from '@/state/userStore';
import { SystemProvider, useTeleportEnabled } from '@/state/systemStore';

function InnerApp(): JSX.Element {
  const teleportEnabled = useTeleportEnabled();
  return (
    <UserProvider>
      <SessionProvider>
        <DesktopGate />
        <NameTag name="macaris64" />
        {teleportEnabled && <PortalUI />}
        <Dock />
      </SessionProvider>
    </UserProvider>
  );
}

export function App(): JSX.Element {
  return (
    <SystemProvider>
      <InnerApp />
    </SystemProvider>
  );
}
