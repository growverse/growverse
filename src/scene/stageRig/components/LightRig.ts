import type * as THREE from 'three';

export interface LightRig {
  group: THREE.Group;
  enable: (on: boolean) => void;
  setIntensity: (i: number) => void;
}

/** Simple truss with spotlights aimed at the stage. */
export function createLightRig(
  THREE: typeof import('three'),
  opts: { stage: THREE.Mesh; stageTopY: number; color?: number }
): LightRig {
  const { stage, stageTopY, color = 0x333333 } = opts;
  const group = new THREE.Group();

  const size = new THREE.Vector3();
  new THREE.Box3().setFromObject(stage).getSize(size);
  const widthZ = size.z;

  const truss = new THREE.Mesh(
    new THREE.BoxGeometry(widthZ, 0.3, 0.3),
    new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.5 })
  );
  truss.position.set(stage.position.x + 1, stageTopY + 6, 0);
  truss.castShadow = true;
  group.add(truss);

  const lights: THREE.SpotLight[] = [];
  const positions = [0, -widthZ * 0.25, widthZ * 0.25];
  for (const z of positions) {
    const spot = new THREE.SpotLight(0xffffff, 1);
    spot.position.set(stage.position.x + 1, stageTopY + 6, z);
    spot.angle = 0.7;
    spot.penumbra = 0.4;
    spot.distance = 60;
    spot.castShadow = true;
    spot.shadow.mapSize.set(512, 512);
    spot.shadow.camera.near = 2;
    spot.shadow.camera.far = 80;
    spot.target.position.set(stage.position.x + 2, stageTopY, 0);
    group.add(spot);
    group.add(spot.target);
    lights.push(spot);
  }

  function enable(on: boolean) {
    lights.forEach(l => l.visible = on);
    truss.visible = on;
  }

  function setIntensity(i: number) {
    lights.forEach(l => l.intensity = i);
  }

  return { group, enable, setIntensity };
}
