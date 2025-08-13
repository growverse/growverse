// No React import needed for JSX in React 18+
import { NameTag } from '@/ui/NameTag';
import { PortalUI } from '@/ui/PortalUI';
import { Dock } from '@/ui/Dock';

export function App(): JSX.Element {
  return (
    <>
      <NameTag name="macaris64" />
      <PortalUI />
      <Dock />
    </>
  );
}
