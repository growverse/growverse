// No React import needed for JSX in React 18+
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { App } from '@/app/App';
import { createSceneSetup } from '@/core/scene';
import { createInput } from '@/core/input';
import { createGarden } from '@/world/garden';
import { createGlassRoom } from '@/world/glassroom';
import { createNftBuilding } from '@/world/nftBuilding';
import { AvatarFactory, updateAvatar } from '@/world/entities';
import { createWorldFX } from '@/world/worldfx';
import { createPortalSystem, createPresetController } from '@/systems/portal';
import { createMarquee } from '@/systems/marquee';
import { createTeleprompterRig } from '@/scene/teleprompter/createTeleprompterRig';
import { runtime } from '@/state/runtime';
import { BotManager } from '@/world/bots/BotManager';
import { botControls } from '@/state/bots';
import * as nameTags from '@/world/nameTags';
import { setWorldRefs } from '@/world/spawn';
import { onTeleportLocal } from '@/world/worldBus';
import { createGrowverseSign } from '@/scene/signage/GrowverseSign';
import '@/styles/global.css';

// Bootstrap React
const appElement = document.getElementById('app');
if (!appElement) {
  throw new Error('App element not found');
}

const root = createRoot(appElement);
root.render(<App />);

// Initialize Three.js world after React has rendered
setTimeout(() => {
  void initializeThreeWorld();
}, 0);

async function initializeThreeWorld() {
  nameTags.mountNameTagsRoot();
  // Get DOM elements that React has rendered
  const nameTag = document.getElementById('nameTag');
  const portalUI = document.getElementById('portalUI');
  const portalList = document.getElementById('portalList');
  const btnCancel = document.getElementById('btnCancel');
  const btnTeleport = document.getElementById('btnTeleport');
  const portalHint = document.getElementById('portalHint');
  const fade = document.getElementById('fade');

  if (!nameTag || !portalUI || !portalList || !btnCancel || !btnTeleport || !portalHint || !fade) {
    throw new Error('Required DOM elements not found');
  }

  const { scene, camera, renderer, controls, amb, sun, adaptiveQuality } = createSceneSetup();
  const keys = createInput();

  const { planeSize, stage, STAGE_W, STAGE_D, STAGE_H, insideStageXZ, groundYAt, boardBlock, stageBlock, boardZCenter, boardYCenter } = createGarden(scene);
  const stageTopY = stage.position.y + STAGE_H / 2;

  // Camlı oda: sahne ile aynı boyut; haritanın en sağ kenarı (varsayılan)
  const roomPos = new THREE.Vector3(planeSize / 2 - STAGE_W / 2, 0, 0);
  const { room: glassRoom, block: roomBlock } = createGlassRoom(scene, { w: STAGE_W, d: STAGE_D, position: roomPos });

  setWorldRefs({ stage, glassRoom, dims: { STAGE_W, STAGE_D, STAGE_H, planeSize } });

  // NFT Bina: garden sol-orta; merkez (5,0,135)
  const nftPos = new THREE.Vector3(5, 0, 135);
  const { building: nftBuilding, block: buildingBlock } = createNftBuilding(scene, { w: 60, d: 40, h: 22, position: nftPos, doorRatio: 0.35 });

  // WORLD FX (Phases 1-3)
  const worldfx = createWorldFX(scene, { planeSize }, { amb, sun });

  // Avatar
  const avatarFactory = AvatarFactory();
  const avatar = avatarFactory.create();
  scene.add(avatar);
  avatar.position.set(roomPos.x, 1, roomPos.z);
  avatar.rotation.y = -Math.PI / 2;
  camera.position.set(avatar.position.x + 12, avatar.position.y + 8, avatar.position.z + 0);
  controls.target.copy(avatar.position);

  onTeleportLocal(({ position, rotationY }) => {
    avatar.position.set(position.x, position.y, position.z);
    if (typeof rotationY === 'number') avatar.rotation.y = rotationY;
    const offset = camera.position.clone().sub(controls.target);
    controls.target.copy(avatar.position);
    camera.position.copy(avatar.position.clone().add(offset));
  });

  // Portal (mor binanın karşısı)
  const portalPos = new THREE.Vector3(-5, 0, -135);
  const portal = createPortalSystem(scene, { portalUI, portalList, btnCancel, btnTeleport, portalHint, fade });
  portal.group.position.copy(portalPos);

  const sign = await createGrowverseSign(THREE, scene, {
    text: 'growverse',
    anchor: new THREE.Vector3(-106, 1, 0),
    size: 6,
    height: 1.1,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.3,
    curveSegments: 6,
    letterSpacing: 0.2,
    lookAtTarget: glassRoom,
    outline: { enabled: true, color: 0x92b6ff, opacity: 0.6 },
    neon: { enabled: true, baseEmissive: 0.05, nightEmissive: 0.7, color: 0x66ccff, fakeBloom: true },
    castShadow: true,
    receiveShadow: false,
  });

  // Preset controller (5 instance, varsayılan düzen)
  const applyPreset = createPresetController({
    objects: { stage, glassRoom, nftBuilding },
    dims: { planeSize, STAGE_W, STAGE_D, STAGE_H },
  });

  // FAZ 7: Marquee kurulumu (metin örneği: tarih + instance bilgisi)
  function currentSessionText() {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return `Garden Live • ${stamp} • Instance: ${portal.getSelected().title} • Kullanıcı: macaris64 • W/A/S/D + SPACE`;
  }
  const marquee = createMarquee(scene, {
    stage,
    dims: { STAGE_W, STAGE_D },
    stageTopY,
    boardZCenter,
    boardYCenter,
    text: currentSessionText(),
    panelW: 30,
    panelH: 3
  });

  // Instructor teleprompter + timer display
  const teleprompter = createTeleprompterRig(THREE, scene);

  // Bot avatars
  const botManager = new BotManager();
  botManager.init({ scene, glassRoomRef: { room: glassRoom, w: STAGE_W, d: STAGE_D }, avatarFactory });
  botControls.setEnabled = (v: boolean) => botManager.setEnabled(v);
  botControls.setCount = (n: number) => botManager.setCount(n);
  window.addEventListener('beforeunload', () => {
    botManager.dispose();
    sign.dispose();
  });

  // UI / Teleport akışı — tüm ID'ler aynı spawn (varsayılan)
  function spawnDefault() {
    avatar.position.set(planeSize / 2 - STAGE_W / 2, 1, 0);
    controls.target.copy(avatar.position);
    camera.position.set(avatar.position.x + 12, avatar.position.y + 8, avatar.position.z + 0);
  }
  
  btnTeleport.addEventListener('click', () => {
    portal.closeUI();
    portal.teleportWith((id) => {
      applyPreset(id);
      spawnDefault();
      marquee.setText(currentSessionText());
    });
  });

  // Yakınlık tespiti (otomatik aç/kapat)
  let uiOpen = false;
  function updatePortalProximity() {
    const dx = avatar.position.x - portal.group.position.x;
    const dz = avatar.position.z - portal.group.position.z;
    const dist2 = dx * dx + dz * dz;
    const R = portal.radius * 1.1;
    const inside = dist2 < (R * R);
    if (inside && !uiOpen) {
      portal.openUI();
      uiOpen = true;
    } else if (!inside && uiOpen) {
      portal.closeUI();
      uiOpen = false;
    }
    const t = performance.now() * 0.001;
    portal.group.rotation.y = 0.1 * Math.sin(t * 1.5);
  }

  // Klavye: listede yukarı/aşağı + ESC/Enter
  window.addEventListener('keydown', (e) => {
    if (!portalUI.classList.contains('visible')) return;
    if (e.key === 'ArrowDown') {
      portal.moveSel(+1);
      marquee.setText(currentSessionText());
    }
    if (e.key === 'ArrowUp') {
      portal.moveSel(-1);
      marquee.setText(currentSessionText());
    }
    if (e.key === 'Escape') {
      portal.closeUI();
    }
    if (e.key === 'Enter') {
      btnTeleport.click();
    }
  });

  function updateNameTag() {
    if (!nameTag) return;
    const pos = avatar.position.clone();
    pos.y += 3.2;
    pos.project(camera);
    const out = (Math.abs(pos.x) > 1 || Math.abs(pos.y) > 1 || pos.z > 1);
    if (out) {
      nameTag.classList.add('hidden');
      return;
    }
    nameTag.classList.remove('hidden');
    const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-pos.y * 0.5 + 0.5) * window.innerHeight;
    nameTag.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
  }

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(0.033, clock.getDelta());
    updateAvatar(dt, avatar, keys, camera, controls, {
      insideStageXZ,
      groundYAt,
      planeSize,
      stageTopY,
      roomBlock,
      buildingBlock,
      boardBlock,
      stageBlock
    });
    runtime.avatar.x = avatar.position.x;
    runtime.avatar.y = avatar.position.y;
    runtime.avatar.z = avatar.position.z;
    runtime.avatar.rotY = avatar.rotation.y;
      worldfx.update();
      updatePortalProximity();
      marquee.update(dt);
      teleprompter.update(dt);
      sign.update(dt);
      botManager.update(dt);
      adaptiveQuality();
      controls.update();
      renderer.render(scene, camera);
      updateNameTag();
      nameTags.update(camera);
  }
  animate();
}
