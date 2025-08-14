import * as THREE from 'three';
import { createSceneSetup } from '@/core/scene';
import { createInput } from '@/core/input';
import { createGarden } from '@/world/garden';
import { createGlassRoom } from '@/world/glassroom';
import { createNftBuilding } from '@/world/nftBuilding';
import { AvatarFactory, updateAvatar } from '@/world/entities';
import { createWorldFX } from '@/world/worldfx';
import { createPortalSystem, createPresetController } from '@/systems/portal';
import { createMarquee } from '@/systems/marquee';
import { sessionStore, setActiveSession } from '@/state/sessionStore';
import { createTeleprompterRig } from '@/scene/teleprompter/createTeleprompterRig';
import { runtime } from '@/state/runtime';
import { BotManager } from '@/world/bots/BotManager';
import { botControls } from '@/state/bots';
import * as nameTags from '@/world/nameTags';
import { setWorldRefs } from '@/world/spawn';
import { onTeleportLocal } from '@/world/worldBus';
import { createGrowverseSign } from '@/scene/signage/GrowverseSign';
import { systemStore } from '@/state/systemStore';
import { registerTeleport } from '@/systems/teleport';
import type { EngineHandles } from '@/engine/perf/applyPerformancePreset';
import { applyPerformancePreset } from '@/engine/perf/applyPerformancePreset';
import { setEngineHandles } from '@/engine/perf/presets';
import { registerWorldCleanup } from '@/world/lifecycle';

export async function bootstrapWorld(container: HTMLElement): Promise<() => void> {
  nameTags.mountNameTagsRoot();
  const teleportEnabled = systemStore.getState().teleportEnabled;
  const nameTag = document.getElementById('nameTag');
  let portalUI: HTMLElement | null = null;
  let portalList: HTMLElement | null = null;
  let btnCancel: HTMLElement | null = null;
  let btnTeleport: HTMLElement | null = null;
  let portalHint: HTMLElement | null = null;
  let fade: HTMLElement | null = null;
  if (teleportEnabled) {
    portalUI = document.getElementById('portalUI');
    portalList = document.getElementById('portalList');
    btnCancel = document.getElementById('btnCancel');
    btnTeleport = document.getElementById('btnTeleport');
    portalHint = document.getElementById('portalHint');
    fade = document.getElementById('fade');
  }
  if (
    !nameTag ||
    (teleportEnabled &&
      (!portalUI || !portalList || !btnCancel || !btnTeleport || !portalHint || !fade))
  ) {
    throw new Error('Required DOM elements not found');
  }

  const { scene, camera, renderer, controls, amb, sun, adaptiveQuality, adaptiveQualityCtrl } =
    createSceneSetup();
  if (renderer.domElement.parentElement) {
    renderer.domElement.parentElement.removeChild(renderer.domElement);
  }
  container.appendChild(renderer.domElement);
  const keys = createInput();

  const {
    planeSize,
    stage,
    STAGE_W,
    STAGE_D,
    STAGE_H,
    insideStageXZ,
    groundYAt,
    boardBlock,
    stageBlock,
    boardZCenter,
    boardYCenter,
  } = createGarden(scene);
  const stageTopY = stage.position.y + STAGE_H / 2;

  const roomPos = new THREE.Vector3(planeSize / 2 - STAGE_W / 2, 0, 0);
  const { room: glassRoom, block: roomBlock } = createGlassRoom(scene, {
    w: STAGE_W,
    d: STAGE_D,
    position: roomPos,
  });

  setWorldRefs({ stage, glassRoom, dims: { STAGE_W, STAGE_D, STAGE_H, planeSize } });

  const nftPos = new THREE.Vector3(5, 0, 135);
  const { building: nftBuilding, block: buildingBlock } = createNftBuilding(scene, {
    w: 60,
    d: 40,
    h: 22,
    position: nftPos,
    doorRatio: 0.35,
  });
  let activeBuildingBlock: typeof buildingBlock | undefined = buildingBlock;
  function setNftEnabled(v: boolean) {
    nftBuilding.visible = v;
    activeBuildingBlock = v ? buildingBlock : undefined;
  }
  setNftEnabled(true);

  const worldfx = createWorldFX(scene, { planeSize }, { amb, sun });

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

  const portalPos = new THREE.Vector3(-5, 0, -135);
  let portal: ReturnType<typeof createPortalSystem> | null = null;
  if (teleportEnabled && portalUI && portalList && btnCancel && btnTeleport && portalHint && fade) {
    portal = createPortalSystem(scene, {
      portalUI,
      portalList,
      btnCancel,
      btnTeleport,
      portalHint,
      fade,
    });
    portal.group.position.copy(portalPos);
  }

  const sign = await createGrowverseSign(scene, {
    text: 'Growverse',
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
    neon: {
      enabled: true,
      baseEmissive: 0.05,
      nightEmissive: 0.7,
      color: 0x66ccff,
      fakeBloom: true,
    },
    castShadow: true,
    receiveShadow: false,
  });

  const applyPreset = createPresetController({
    objects: { stage, glassRoom, nftBuilding },
    dims: { planeSize, STAGE_W, STAGE_D, STAGE_H },
  });

  function currentSessionText() {
    const session = sessionStore.getState().activeSession;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    return `${session?.name ?? ''} • ${stamp} • ${session?.instanceTitle ?? ''}`;
  }
  const marquee = createMarquee(scene, {
    stage,
    dims: { STAGE_W, STAGE_D },
    stageTopY,
    boardZCenter,
    boardYCenter,
    text: currentSessionText(),
    panelW: 30,
    panelH: 3,
  });

  const teleprompter = createTeleprompterRig(scene);

  const botManager = new BotManager();
  botManager.init({
    scene,
    glassRoomRef: { room: glassRoom, w: STAGE_W, d: STAGE_D },
    avatarFactory,
  });

  const originalSetEnabled = botControls.setEnabled.bind(botControls);
  const originalSetCount = botControls.setCount.bind(botControls);
  botControls.setEnabled = (v: boolean) => {
    originalSetEnabled(v);
    botManager.setEnabled(v);
  };
  botControls.setCount = (n: number) => {
    originalSetCount(n);
    botManager.setCount(n);
  };
  window.addEventListener('beforeunload', () => {
    botManager.dispose();
    sign.dispose();
  });

  function spawnDefault() {
    avatar.position.set(planeSize / 2 - STAGE_W / 2, 1, 0);
    controls.target.copy(avatar.position);
    camera.position.set(avatar.position.x + 12, avatar.position.y + 8, avatar.position.z + 0);
  }
  let updatePortalProximityFn = () => {};
  if (teleportEnabled && portal && btnTeleport) {
    btnTeleport.addEventListener('click', () => {
      portal.closeUI();
      const dst = portal.getSelected();
      void portal.teleportTo(dst.id, (id) => {
        applyPreset(id);
        spawnDefault();
        setActiveSession(dst.id);
        marquee.setText(currentSessionText());
      });
    });

    registerTeleport((id) => {
      void portal.teleportTo(id, (pid) => {
        applyPreset(pid);
        spawnDefault();
        setActiveSession(id);
        marquee.setText(currentSessionText());
      });
    });

    let uiOpen = false;
    const updatePortalProximity = () => {
      const dx = avatar.position.x - portal.group.position.x;
      const dz = avatar.position.z - portal.group.position.z;
      const dist2 = dx * dx + dz * dz;
      const R = portal.radius * 1.1;
      const inside = dist2 < R * R;
      if (inside && !uiOpen) {
        portal.openUI();
        uiOpen = true;
      } else if (!inside && uiOpen) {
        portal.closeUI();
        uiOpen = false;
      }
      const t = performance.now() * 0.001;
      portal.group.rotation.y = 0.1 * Math.sin(t * 1.5);
    };

    window.addEventListener('keydown', (e) => {
      if (!portalUI || !portalUI.classList.contains('visible')) return;
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

    updatePortalProximityFn = updatePortalProximity;
  } else {
    registerTeleport(() => {});
  }

  function updateNameTag() {
    if (!nameTag) return;
    const pos = avatar.position.clone();
    pos.y += 3.2;
    pos.project(camera);
    const out = Math.abs(pos.x) > 1 || Math.abs(pos.y) > 1 || pos.z > 1;
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
  let frameId = 0;
  function animate() {
    frameId = requestAnimationFrame(animate);
    const dtRaw = clock.getDelta();
    const fps = 1 / (dtRaw || 1);
    runtime.fps = runtime.fps * 0.9 + fps * 0.1;
    const dt = Math.min(0.033, dtRaw);
    updateAvatar(dt, avatar, keys, camera, controls, {
      insideStageXZ,
      groundYAt,
      planeSize,
      stageTopY,
      roomBlock,
      buildingBlock: activeBuildingBlock,
      boardBlock,
      stageBlock,
    });
    runtime.avatar.x = avatar.position.x;
    runtime.avatar.y = avatar.position.y;
    runtime.avatar.z = avatar.position.z;
    runtime.avatar.rotY = avatar.rotation.y;
    worldfx.update(dt);
    updatePortalProximityFn();
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
  const handles: EngineHandles = {
    renderer,
    sun,
    worldfx,
    trees: worldfx.trees,
    marquee,
    adaptiveQuality: adaptiveQualityCtrl,
    nft: { object: nftBuilding, setEnabled: setNftEnabled },
  };
  setEngineHandles(handles);
  applyPerformancePreset('high', handles);

  animate();

  const cleanup = () => {
    cancelAnimationFrame(frameId);
    renderer.dispose();
    botManager.dispose();
    sign.dispose();
    nameTags.unmountNameTagsRoot();
    renderer.domElement.remove();
  };
  registerWorldCleanup(cleanup);
  return cleanup;
}
