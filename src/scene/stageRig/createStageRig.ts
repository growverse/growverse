import type * as THREE from 'three';
import { createPodium } from './components/Podium';
import { createTeleprompter } from './components/Teleprompter';
import { createStageTimer } from './components/StageTimer';
import { createLightRig } from './components/LightRig';
import type { StageRigOptions, StageRig } from './types';

/** Compose podium, teleprompter, timer and lights into a stage rig. */
export function createStageRig(
  THREE: typeof import('three'),
  scene: THREE.Scene,
  opts: StageRigOptions
): StageRig {
  const {
    stage,
    stageTopY,
    colors = {},
  } = opts;

  const metal = colors.metal ?? 0x333333;
  const panel = colors.panel ?? 0x222222;
  const accent = colors.accent ?? 0x7aa7ff;

  const group = new THREE.Group();
  scene.add(group);

  const anchor = new THREE.Vector3(stage.position.x, stageTopY, 0);

  // Podium
  const podium = createPodium(THREE, metal);
  podium.position.set(anchor.x + 2, anchor.y, anchor.z);
  group.add(podium);

  // Teleprompter
  const tele = createTeleprompter(THREE, { color: panel, accent });
  tele.group.position.set(anchor.x + 3.5, anchor.y + 0.2, anchor.z);
  tele.group.rotation.y = Math.PI; // face instructor (-X)
  group.add(tele.group);

  // Timer
  const timerImpl = createStageTimer(THREE, { color: panel, accent });
  timerImpl.group.position.set(anchor.x + 2, anchor.y + 1.15, anchor.z);
  timerImpl.group.rotation.y = Math.PI; // toward instructor
  group.add(timerImpl.group);

  // Light rig
  const lights = createLightRig(THREE, { stage, stageTopY, color: metal });
  group.add(lights.group);

  // Defaults
  tele.setText('Welcome • Instructor Notes');
  timerImpl.start();

  function update(dt: number) {
    timerImpl.update(dt);
  }

  return {
    group,
    setTeleprompterText: tele.setText,
    timer: {
      start: timerImpl.start,
      pause: timerImpl.pause,
      resume: timerImpl.resume,
      reset: timerImpl.reset,
      getRemainingMs: timerImpl.getRemainingMs,
    },
    lightRig: {
      enable: lights.enable,
      setIntensity: lights.setIntensity,
    },
    update,
  };
}
