import { WorldCanvas } from '@/world/WorldCanvas';
import { HUD } from '@/ui/HUD';

export default function World(): JSX.Element {
  return (
    <>
      <WorldCanvas />
      <HUD />
    </>
  );
}
