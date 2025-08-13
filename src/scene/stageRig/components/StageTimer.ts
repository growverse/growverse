import type * as THREE from 'three';

export interface StageTimer {
  group: THREE.Group;
  start: (ms?: number) => void;
  pause: () => void;
  resume: () => void;
  reset: (ms?: number) => void;
  getRemainingMs: () => number;
  update: (dt: number) => void;
}

/** Digital countdown timer rendered to a CanvasTexture. */
export function createStageTimer(
  THREE: typeof import('three'),
  opts: { color?: number; accent?: number } = {}
): StageTimer {
  const { color = 0x111111, accent = 0x7aa7ff } = opts;
  const group = new THREE.Group();

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.25),
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
  );
  group.add(screen);

  const state = {
    remaining: 20 * 60 * 1000,
    running: false,
    acc: 0,
    dirty: true,
  };

  function format(ms: number): string {
    const total = Math.max(0, Math.floor(ms / 1000));
    const s = total % 60;
    const m = Math.floor(total / 60) % 60;
    const h = Math.floor(total / 3600);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    }

  function redraw() {
    const bg = `#${color.toString(16).padStart(6, '0')}`;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `#${accent.toString(16).padStart(6, '0')}`;
    ctx.font = '700 64px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(format(state.remaining), canvas.width / 2, canvas.height / 2);
    tex.needsUpdate = true;
    state.dirty = false;
  }

  function start(ms = 20 * 60 * 1000) {
    state.remaining = ms;
    state.running = true;
    state.acc = 0;
    state.dirty = true;
  }

  function pause() { state.running = false; }
  function resume() { if (state.remaining > 0) state.running = true; }
  function reset(ms = 20 * 60 * 1000) { state.remaining = ms; state.acc = 0; state.running = false; state.dirty = true; }
  function getRemainingMs() { return state.remaining; }

  function update(dt: number) {
    if (state.running && state.remaining > 0) {
      state.acc += dt;
      if (state.acc >= 1) {
        const sec = Math.floor(state.acc);
        state.acc -= sec;
        state.remaining = Math.max(0, state.remaining - sec * 1000);
        state.dirty = true;
        if (state.remaining === 0) state.running = false;
      }
    }
    if (state.dirty) redraw();
  }

  return { group, start, pause, resume, reset, getRemainingMs, update };
}
