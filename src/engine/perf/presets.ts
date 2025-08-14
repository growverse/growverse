import { EngineHandles, applyPerformancePreset } from './applyPerformancePreset';
import { userStore } from '@/state/userStore';
import { PerformancePreset } from '@/types/preferences';

let handles: EngineHandles | null = null;

export function setEngineHandles(h: EngineHandles): void {
  handles = h;
}

export function applyCurrentPreset(preset?: PerformancePreset): void {
  if (!handles) return;
  const p = preset ?? userStore.getLocal().preferences.performancePreset;
  applyPerformancePreset(p, handles);
}
