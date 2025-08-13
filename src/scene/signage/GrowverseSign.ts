import type * as THREEType from 'three';
// @ts-ignore - FontLoader is provided via three examples
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// @ts-ignore - TextGeometry is provided via three examples
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export type GrowverseSignOptions = {
  text?: string;
  anchor?: THREEType.Vector3;
  size?: number;
  height?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  curveSegments?: number;
  letterSpacing?: number;
  lookAtTarget?: THREEType.Vector3 | THREEType.Object3D;
  outline?: { enabled: boolean; color?: number; opacity?: number };
  neon?: {
    enabled: boolean;
    baseEmissive?: number;
    nightEmissive?: number;
    color?: number;
    fakeBloom?: boolean;
  };
  getDayNightFactor?: () => number;
  castShadow?: boolean;
  receiveShadow?: boolean;
};

export type GrowverseSignHandle = {
  group: THREEType.Group;
  update: (dt: number) => void;
  dispose: () => void;
};

export async function createGrowverseSign(
  THREE: typeof import('three'),
  scene: THREEType.Scene,
  options?: Partial<GrowverseSignOptions>
): Promise<GrowverseSignHandle> {
  const defaultAnchor = new THREE.Vector3(10, 1, -136);
  const defaultOutline = { enabled: false, color: 0xffffff, opacity: 1 };
  const defaultNeon = { enabled: false, baseEmissive: 0.05, nightEmissive: 0.7, color: 0x66ccff, fakeBloom: false };
  const opts: GrowverseSignOptions = {
    text: 'growverse',
    anchor: defaultAnchor,
    size: 6,
    height: 1.1,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.3,
    curveSegments: 6,
    letterSpacing: 0,
    lookAtTarget: undefined,
    outline: defaultOutline,
    neon: defaultNeon,
    getDayNightFactor: undefined,
    castShadow: true,
    receiveShadow: false,
    ...(options || {})
  };
  opts.anchor = (options?.anchor || defaultAnchor).clone();
  opts.outline = { ...defaultOutline, ...(options?.outline || {}) };
  opts.neon = { ...defaultNeon, ...(options?.neon || {}) };

  const group = new THREE.Group();
  const wordGroup = new THREE.Group();
  group.add(wordGroup);
  scene.add(group);

  const fontUrl = new URL('./fonts/helvetiker_regular.typeface.json', import.meta.url).href;
  const font = await new FontLoader().loadAsync(fontUrl);

  const letterMaterials: THREE.MeshStandardMaterial[] = [];
  const glowMaterials: THREE.MeshBasicMaterial[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const edgeGeometries: THREE.BufferGeometry[] = [];
  const edgeMaterials: THREE.LineBasicMaterial[] = [];

  let cursorX = 0;
  const text = opts.text || '';
  for (const ch of text) {
    const geom = new TextGeometry(ch, {
      font,
      size: opts.size,
      height: opts.height,
      bevelEnabled: opts.bevelEnabled,
      bevelThickness: opts.bevelThickness,
      bevelSize: opts.bevelSize,
      curveSegments: opts.curveSegments
    });
    geom.computeBoundingBox();
    const bbox = geom.boundingBox!;
    const letterWidth = bbox.max.x - bbox.min.x;

    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.25,
      roughness: 0.45,
      emissive: new THREE.Color(opts.neon?.color ?? 0x66ccff),
      emissiveIntensity: opts.neon?.enabled ? opts.neon.baseEmissive ?? 0.05 : 0
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = opts.castShadow ?? true;
    mesh.receiveShadow = opts.receiveShadow ?? false;
    mesh.position.set(cursorX - bbox.min.x, -bbox.min.y, -bbox.max.z);
    wordGroup.add(mesh);

    letterMaterials.push(mat);
    geometries.push(geom);

    if (opts.neon?.enabled && opts.neon.fakeBloom) {
      const glowMat = new THREE.MeshBasicMaterial({
        color: opts.neon.color,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const glowMesh = new THREE.Mesh(geom, glowMat);
      glowMesh.position.copy(mesh.position);
      glowMesh.scale.setScalar(1.02);
      wordGroup.add(glowMesh);
      glowMaterials.push(glowMat);
    }

    if (opts.outline?.enabled) {
      const eGeo = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({
        color: opts.outline.color,
        transparent: true,
        opacity: opts.outline.opacity
      });
      const outline = new THREE.LineSegments(eGeo, lineMat);
      outline.position.copy(mesh.position);
      wordGroup.add(outline);
      edgeGeometries.push(eGeo);
      edgeMaterials.push(lineMat);
    }

    cursorX += letterWidth + (opts.letterSpacing || 0);
  }

  group.position.copy(opts.anchor);

  if (opts.lookAtTarget) {
    const targetPos = opts.lookAtTarget instanceof THREE.Object3D
      ? opts.lookAtTarget.getWorldPosition(new THREE.Vector3())
      : opts.lookAtTarget.clone();
    const pos = group.position.clone();
    const dx = targetPos.x - pos.x;
    const dz = targetPos.z - pos.z;
    group.rotation.y = Math.atan2(dx, dz);
  }

  function localDayNightFactor() {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    return (Math.cos((h - 12) / 12 * Math.PI) + 1) / 2;
  }

  function update(_dt: number) {
    if (!opts.neon?.enabled) return;
    const factor = THREE.MathUtils.clamp(opts.getDayNightFactor ? opts.getDayNightFactor() : localDayNightFactor(), 0, 1);
    const intensity = THREE.MathUtils.lerp(opts.neon.baseEmissive ?? 0, opts.neon.nightEmissive ?? 1, 1 - factor);
    letterMaterials.forEach(m => { m.emissiveIntensity = intensity; });
    if (opts.neon.fakeBloom) {
      const glowFactor = (opts.neon.nightEmissive ? intensity / (opts.neon.nightEmissive || 1) : intensity);
      glowMaterials.forEach(m => { m.opacity = 0.25 * glowFactor; });
    }
  }

  function dispose() {
    scene.remove(group);
    geometries.forEach(g => g.dispose());
    letterMaterials.forEach(m => m.dispose());
    glowMaterials.forEach(m => m.dispose());
    edgeGeometries.forEach(g => g.dispose());
    edgeMaterials.forEach(m => m.dispose());
  }

  return { group, update, dispose };
}
