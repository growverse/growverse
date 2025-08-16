import type { EngineHandles } from './applyPerformancePreset';
import { applyPerformancePreset } from './applyPerformancePreset';
import { userStore } from '@/state/userStore';
import type { GraphicsQuality } from '@/world/types';

let handles: EngineHandles | null = null;

export function setEngineHandles(h: EngineHandles): void {
  handles = h;
}

export function applyCurrentPreset(preset?: GraphicsQuality): void {
  if (!handles) return;
  const p = preset ?? userStore.getLocal().preferences.graphics;
  applyPerformancePreset(p, handles);
}
