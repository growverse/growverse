import * as THREE from 'three';

export interface AdaptiveQualityBridge {
  loop: () => void;
  setBounds: (min: number, max: number) => void;
}

export function createAdaptiveQualityBridge(
  renderer: THREE.WebGLRenderer,
  sun: THREE.DirectionalLight
): AdaptiveQualityBridge {
  let frameCount = 0;
  let lastTime = performance.now();
  let minRatio = 0.75;
  let maxRatio = 1.75;
  let targetPR = Math.min(maxRatio, window.devicePixelRatio || 1);
  renderer.setPixelRatio(targetPR);

  function setBounds(min: number, max: number) {
    minRatio = min;
    maxRatio = max;
    targetPR = Math.min(Math.max(targetPR, minRatio), maxRatio);
    renderer.setPixelRatio(targetPR);
  }

  function loop() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime > 1500) {
      const fps = frameCount / ((now - lastTime) / 1000);
      frameCount = 0;
      lastTime = now;
      if (fps < 45) targetPR = Math.max(minRatio, targetPR - 0.1);
      else if (fps > 58) targetPR = Math.min(maxRatio, targetPR + 0.05);
      renderer.setPixelRatio(targetPR);
      const m = targetPR >= 1.2 ? 2048 : targetPR >= 1.0 ? 1536 : 1024;
      sun.shadow.mapSize.set(m, m);
      sun.shadow.needsUpdate = true;
    }
  }

  return { loop, setBounds };
}
