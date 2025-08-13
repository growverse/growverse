import * as THREE from 'three';

export interface WorldFXSetup {
  update: () => void;
}

export interface WorldFXConfig {
  planeSize: number;
}

export interface WorldFXLights {
  amb: THREE.AmbientLight;
  sun: THREE.DirectionalLight;
}

export function createWorldFX(scene: THREE.Scene, config: WorldFXConfig, lights: WorldFXLights): WorldFXSetup {
  const { planeSize } = config;
  const { amb, sun } = lights;
  
  const group = new THREE.Group();
  scene.add(group);

  // --- Phase 1: Fog + Gradient Sky ---
  let skyTopDay = new THREE.Color(0x87b7ff);
  let skyBotDay = new THREE.Color(0xcfe8ff);
  let skyTopNight = new THREE.Color(0x0a0d1a);
  let skyBotNight = new THREE.Color(0x182033);

  scene.fog = new THREE.FogExp2(skyBotDay.clone(), 0.0012);

  const skyGeo = new THREE.SphereGeometry(5000, 32, 16);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: skyTopDay.clone() },
      bottomColor: { value: skyBotDay.clone() },
      offset: { value: 33 },
      exponent: { value: 0.6 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 p = modelMatrix * vec4(position, 1.0);
        vWorldPosition = p.xyz;
        gl_Position = projectionMatrix * viewMatrix * p;
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
        float f = max(pow(max(h, 0.0), exponent), 0.0);
        gl_FragColor = vec4(mix(bottomColor, topColor, f), 1.0);
      }
    `
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  group.add(sky);

  // Horizon curtain
  const r = planeSize * 0.8;
  const curtain = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, 200, 48, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x7aa7ff,
      metalness: 0.0,
      roughness: 1.0,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.85
    })
  );
  curtain.position.y = 100;
  group.add(curtain);

  // --- Phase 3: Instanced distant trees (performant) ---
  const props = new THREE.Group();
  group.add(props);
  const ringR = planeSize * 0.6 + 40;
  const count = 64;
  const dummy = new THREE.Object3D();
  
  // Trunks
  const trunkGeom = new THREE.CylinderGeometry(0.4, 0.6, 4, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e4b2a, roughness: 0.9 });
  trunkMat.shadowSide = THREE.FrontSide;
  const trunks = new THREE.InstancedMesh(trunkGeom, trunkMat, count);
  trunks.castShadow = false;
  trunks.receiveShadow = false;
  props.add(trunks);
  
  // Cones
  const coneGeom = new THREE.ConeGeometry(2.5, 6, 8);
  const coneMat = new THREE.MeshStandardMaterial({ color: 0x2b7a2b, roughness: 0.8 });
  const cones = new THREE.InstancedMesh(coneGeom, coneMat, count);
  cones.castShadow = false;
  cones.receiveShadow = false;
  props.add(cones);

  for (let i = 0; i < count; i++) {
    const a = i / count * Math.PI * 2;
    const px = Math.cos(a) * ringR;
    const pz = Math.sin(a) * ringR;
    dummy.position.set(px, 2, pz);
    dummy.rotation.y = a;
    dummy.updateMatrix();
    trunks.setMatrixAt(i, dummy.matrix);
    dummy.position.set(px, 7, pz);
    dummy.updateMatrix();
    cones.setMatrixAt(i, dummy.matrix);
  }
  trunks.instanceMatrix.needsUpdate = true;
  cones.instanceMatrix.needsUpdate = true;

  // --- Phase 2: Day/Night blending ---
  function dayNightFactor(date: Date): number {
    const h = date.getHours() + date.getMinutes() / 60;
    const t = Math.cos((h - 12) / 12 * Math.PI);
    return (t + 1) / 2;
  }
  
  function updateLights(t: number) {
    const colTop = skyTopNight.clone().lerp(skyTopDay, t);
    const colBot = skyBotNight.clone().lerp(skyBotDay, t);
    sky.material.uniforms.topColor.value.copy(colTop);
    sky.material.uniforms.bottomColor.value.copy(colBot);
    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(colBot.clone());
    }
    amb.intensity = 0.25 + 0.55 * t;
    sun.intensity = 0.2 + 0.9 * t;
    sun.color.copy(new THREE.Color(0xffe7b0).lerp(new THREE.Color(0xffffff), t));
    curtain.material.color.copy(colBot.clone().lerp(colTop, 0.3));
  }
  
  updateLights(dayNightFactor(new Date()));

  return {
    update() {
      const t = dayNightFactor(new Date());
      updateLights(t);
    }
  };
}
