import { EngineHandles, applyPerformancePreset } from './applyPerformancePreset';
import { userStore } from '@/state/userStore';

let handles: EngineHandles | null = null;

export function setEngineHandles(h: EngineHandles): void {
  handles = h;
}

export function applyCurrentPreset(): void {
  if (!handles) return;
  const preset = userStore.getLocal().preferences.performancePreset;
  applyPerformancePreset(preset, handles);
}
