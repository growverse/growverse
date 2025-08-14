import { WorldCanvas } from '@/world/WorldCanvas';
import { WorldApp } from '@/world/WorldApp';

export default function World(): JSX.Element {
  return (
    <>
      <WorldApp />
      <WorldCanvas />
    </>
  );
}
