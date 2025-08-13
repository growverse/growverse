import type * as THREE from 'three';

/** Simple podium composed of a base box and a slanted top. */
export function createPodium(THREE: typeof import('three'), color = 0x333333): THREE.Group {
  const group = new THREE.Group();

  // Base box: depth (X) x height (Y) x width (Z)
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 1.1, 1.6),
    new THREE.MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.6 })
  );
  base.castShadow = true;
  base.receiveShadow = true;
  base.position.y = 1.1 * 0.5;
  group.add(base);

  // Slanted top; thin box rotated toward instructor
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.05, 1.2),
    new THREE.MeshStandardMaterial({ color, metalness: 0.4, roughness: 0.6 })
  );
  top.position.y = 1.1 + 0.025;
  top.rotation.x = -THREE.MathUtils.degToRad(20);
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  return group;
}
