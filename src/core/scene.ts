import * as THREE from 'three';
// @ts-ignore - TypeScript has issues with this import path but it works at runtime
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  amb: THREE.AmbientLight;
  sun: THREE.DirectionalLight;
  adaptiveQuality: () => void;
}

export function createSceneSetup(): SceneSetup {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87b7ff);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 8000);
  camera.position.set(0, 10, 16);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 6;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI * 0.49;
  // Note: enableKeys, keys, and keyPanSpeed are deprecated in newer OrbitControls
  controls.target.set(0, 2, 0);

  const amb = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(amb);
  
  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(60, 100, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  scene.add(sun);

  // Adaptive pixel ratio (Faz 6)
  let frameCount = 0;
  let lastTime = performance.now();
  let targetPR = Math.min(1.5, window.devicePixelRatio || 1);
  renderer.setPixelRatio(targetPR);
  
  function adaptiveQuality() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime > 1500) {
      const fps = frameCount / ((now - lastTime) / 1000);
      frameCount = 0;
      lastTime = now;
      if (fps < 45) targetPR = Math.max(0.75, targetPR - 0.1);
      else if (fps > 58) targetPR = Math.min(1.75, targetPR + 0.05);
      renderer.setPixelRatio(targetPR);
      const m = (targetPR >= 1.2) ? 2048 : (targetPR >= 1.0 ? 1536 : 1024);
      sun.shadow.mapSize.set(m, m);
      sun.shadow.needsUpdate = true;
    }
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, controls, amb, sun, adaptiveQuality };
}
