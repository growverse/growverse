import * as THREE from 'three';
import { PerformancePreset } from '@/types/preferences';

export interface EngineHandles {
  renderer: THREE.WebGLRenderer;
  sun?: THREE.DirectionalLight;
  worldfx?: { setThrottleHz?: (hz: number) => void };
  trees?: { setDensity?: (ratio: number) => void };
  avatars?: { setLOD?: (mode: 'low' | 'medium' | 'high') => void };
  marquee?: { setResolution?: (w: number, h: number) => void; group?: THREE.Object3D };
  adaptiveQuality?: { setBounds?: (min: number, max: number) => void };
  nft?: { object?: THREE.Object3D; setEnabled?: (v: boolean) => void };
}

export function applyPerformancePreset(preset: PerformancePreset, handles: EngineHandles): void {
  try {
    switch (preset) {
      case 'low':
        handles.adaptiveQuality?.setBounds?.(0.75, 1.0);
        handles.renderer.shadowMap.enabled = false;
        handles.sun && (handles.sun.castShadow = false);
        handles.worldfx?.setThrottleHz?.(1);
        handles.trees?.setDensity?.(0.0);
        handles.avatars?.setLOD?.('low');
        handles.marquee?.setResolution?.(512, 128);
        if (handles.marquee?.group) handles.marquee.group.visible = false;
        handles.nft?.setEnabled?.(false);
        break;
      case 'medium':
        handles.adaptiveQuality?.setBounds?.(0.9, 1.25);
        handles.renderer.shadowMap.enabled = true;
        if (handles.sun) {
          handles.sun.castShadow = true;
          handles.sun.shadow.mapSize.set(1536, 1536);
          handles.renderer.shadowMap.type = THREE.PCFShadowMap;
          handles.sun.shadow.needsUpdate = true;
        }
        handles.worldfx?.setThrottleHz?.(12);
        handles.trees?.setDensity?.(0.5);
        handles.avatars?.setLOD?.('medium');
        handles.marquee?.setResolution?.(1024, 256);
        if (handles.marquee?.group) handles.marquee.group.visible = true;
        handles.nft?.setEnabled?.(true);
        break;
      case 'high':
      default:
        handles.adaptiveQuality?.setBounds?.(1.2, 1.75);
        handles.renderer.shadowMap.enabled = true;
        if (handles.sun) {
          handles.sun.castShadow = true;
          handles.sun.shadow.mapSize.set(2048, 2048);
          handles.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          handles.sun.shadow.needsUpdate = true;
        }
        handles.worldfx?.setThrottleHz?.(0);
        handles.trees?.setDensity?.(1.0);
        handles.avatars?.setLOD?.('high');
        handles.marquee?.setResolution?.(1024, 256);
        if (handles.marquee?.group) handles.marquee.group.visible = true;
        handles.nft?.setEnabled?.(true);
        break;
    }
  } catch {
    // swallow errors to keep defensive
  }
}
