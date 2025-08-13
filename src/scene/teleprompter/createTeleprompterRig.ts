import type * as THREE from 'three';

export type TeleprompterRigOptions = {
  /** World position of the teleprompter screen's center. */
  position?: { x: number; y: number; z: number };
  /** Uniform scale applied to the whole rig (default 3x). */
  scale?: number;
};

export type TeleprompterRig = {
  group: THREE.Group;
  /** Update teleprompter text. */
  setText: (text: string) => void;
  timer: {
    start: (ms?: number) => void;
    pause: () => void;
    resume: () => void;
    reset: (ms?: number) => void;
    getRemainingMs: () => number;
  };
  /** Advance internal timers. dt in seconds. */
  update: (dt: number) => void;
};

/** Create a small monitor (teleprompter) with a countdown timer above it. */
export function createTeleprompterRig(
  THREE: typeof import('three'),
  scene: THREE.Scene,
  opts: TeleprompterRigOptions = {}
): TeleprompterRig {
  const { position = { x: -120, y: 16, z: 23 }, scale = 3 } = opts;
  const group = new THREE.Group();
  group.position.set(position.x, position.y, position.z);
  group.scale.set(scale, scale, scale);
  scene.add(group);

  // --- Teleprompter screen ---
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024 * 3;
  screenCanvas.height = 512 * 3;
  const screenCtx = screenCanvas.getContext('2d')!;
  function drawScreen(text: string) {
    screenCtx.fillStyle = '#ffffff';
    screenCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
    if (text) {
      screenCtx.fillStyle = '#000000';
      screenCtx.font = 'bold 288px sans-serif';
      screenCtx.textAlign = 'center';
      screenCtx.textBaseline = 'middle';
      screenCtx.fillText(text, screenCanvas.width / 2, screenCanvas.height / 2);
    }
    screenTex.needsUpdate = true;
  }
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  drawScreen('');
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
  const screenGeom = new THREE.PlaneGeometry(1.8, 1.0);
  const screen = new THREE.Mesh(screenGeom, screenMat);
  // place the monitor at the group's origin
  screen.rotation.y = -Math.PI / 2; // face instructor (-X)
  group.add(screen);

  let lastText = '';
  function setText(t: string) {
    if (t === lastText) return;
    lastText = t;
    drawScreen(t);
  }

  // --- Timer display ---
  const timerCanvas = document.createElement('canvas');
  timerCanvas.width = 256 * 3;
  timerCanvas.height = 64 * 3;
  const timerCtx = timerCanvas.getContext('2d')!;
  const timerTex = new THREE.CanvasTexture(timerCanvas);
  const timerMat = new THREE.MeshBasicMaterial({ map: timerTex });
  const timerGeom = new THREE.PlaneGeometry(0.8, 0.2);
  const timerMesh = new THREE.Mesh(timerGeom, timerMat);
  // position timer above the monitor (local space)
  timerMesh.position.set(0, 0.9, 0);
  timerMesh.rotation.y = -Math.PI / 2;
  group.add(timerMesh);

  let remaining = 20 * 60 * 1000; // ms
  let running = false;
  let acc = 0; // seconds accumulator

  function drawTimer() {
    const sec = Math.max(0, Math.floor(remaining / 1000));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    const txt = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    timerCtx.fillStyle = '#000000';
    timerCtx.fillRect(0, 0, timerCanvas.width, timerCanvas.height);
    timerCtx.fillStyle = '#00ff00';
    timerCtx.font = 'bold 144px monospace';
    timerCtx.textAlign = 'center';
    timerCtx.textBaseline = 'middle';
    timerCtx.fillText(txt, timerCanvas.width / 2, timerCanvas.height / 2);
    timerTex.needsUpdate = true;
  }

  function start(ms = 20 * 60 * 1000) {
    remaining = ms;
    running = true;
    drawTimer();
  }
  function pause() {
    running = false;
  }
  function resume() {
    if (remaining > 0) running = true;
  }
  function reset(ms = 20 * 60 * 1000) {
    remaining = ms;
    drawTimer();
  }
  function getRemainingMs() {
    return remaining;
  }

  function update(dt: number) {
    if (!running) return;
    acc += dt;
    if (acc >= 1) {
      const whole = Math.floor(acc);
      acc -= whole;
      remaining -= whole * 1000;
      if (remaining <= 0) {
        remaining = 0;
        running = false;
      }
      drawTimer();
    }
  }

  // defaults
  start();

  return {
    group,
    setText,
    timer: { start, pause, resume, reset, getRemainingMs },
    update,
  };
}
