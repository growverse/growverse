import * as THREE from 'three';
import type { AABB, Vec3 } from './collision/types';
import { ground, box } from './collision/simpleColliders';
import { resolveMovementWithAABBs, groundSnapRaycast } from './collision/physics';
import { initBVH, computeBoundsTree, disposeBoundsTree } from './collision/bvh';
import { registerWorldCleanup } from './lifecycle';
import { runtime } from '@/state/runtime';
import tuning from '@/config/tuning.json';
import worldConfig from '@/config/world.json';

export type BootstrapOpts = {
  container: HTMLElement;
  config?: { useBVH?: boolean };
  onTickBridge?: (dt: number) => void;
};

export function bootstrapWorld(opts: BootstrapOpts): () => void {
  const { container, config, onTickBridge } = opts;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, worldConfig.fog.near, worldConfig.fog.far);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(0, 5, 10);
  const amb = new THREE.HemisphereLight(0xffffff, 0x444444);
  scene.add(amb);
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(5, 10, 7.5);
  scene.add(sun);

  const avatarGeom = new THREE.BoxGeometry(1, 1, 1);
  const avatarMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const avatar = new THREE.Mesh(avatarGeom, avatarMat);
  scene.add(avatar);

  const groundGeom = new THREE.PlaneGeometry(200, 200);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const groundMesh = new THREE.Mesh(groundGeom, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  scene.add(groundMesh);

  const colliders: AABB[] = [ground(200, 0), box({ x: -5, y: 0, z: -5 }, { x: -3, y: 2, z: 5 })];

  if (config?.useBVH) {
    void initBVH().then(() => {
      computeBoundsTree(groundGeom);
    });
  }

  const vel: Vec3 = { x: 0, y: 0, z: 0 };
  const pos: Vec3 = { x: 0, y: 0.5, z: 0 };
  const keys: Record<string, boolean> = {};
  function onKey(e: KeyboardEvent) {
    keys[e.key.toLowerCase()] = e.type === 'keydown';
  }
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let raf = 0;
  let last = performance.now();
  function loop(now: number) {
    const dt = (now - last) / 1000;
    last = now;
    const speed = keys['shift'] ? tuning.avatar.runSpeed : tuning.avatar.walkSpeed;
    const forward = (keys['w'] ? -1 : 0) + (keys['s'] ? 1 : 0);
    const strafe = (keys['a'] ? -1 : 0) + (keys['d'] ? 1 : 0);
    vel.x = strafe * speed;
    vel.z = forward * speed;
    vel.y += -9.8 * dt;
    const ray = { origin: pos, dir: { x: 0, y: -1, z: 0 } };
    const groundHit = groundSnapRaycast(pos, ray, colliders);
    if (groundHit.grounded) {
      pos.y = groundHit.newY;
      vel.y = 0;
    }
    const res = resolveMovementWithAABBs(pos, vel, colliders, dt);
    pos.x = res.pos.x;
    pos.y = res.pos.y;
    pos.z = res.pos.z;
    vel.x = res.vel.x;
    vel.y = res.vel.y;
    vel.z = res.vel.z;
    avatar.position.set(pos.x, pos.y, pos.z);
    runtime.avatar = { x: pos.x, y: pos.y, z: pos.z, rotY: 0 };
    runtime.fps = 1 / dt;
    onTickBridge?.(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  function cleanup() {
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('keyup', onKey);
    window.removeEventListener('resize', resize);
    container.removeChild(renderer.domElement);
    renderer.dispose();
    avatarGeom.dispose();
    avatarMat.dispose();
    groundGeom.dispose();
    groundMat.dispose();
    if (config?.useBVH) disposeBoundsTree(groundGeom);
  }
  registerWorldCleanup(cleanup);
  return cleanup;
}
