// No React import needed for JSX in React 18+
import { HUD } from '@/ui/HUD';
import { NameTag } from '@/ui/NameTag';
import { PortalUI } from '@/ui/PortalUI';

export function App(): JSX.Element {
  return (
    <>
      {/* HUD: koordinatlar + yön */}
      <HUD />
      
      {/* Avatar etiketi */}
      <NameTag name="macaris64" />
      
      {/* Portal UI and related overlays */}
      <PortalUI />
    </>
  );
}
