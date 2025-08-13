export type TeleportLocalPayload = {
  position: { x: number; y: number; z: number };
  rotationY?: number;
};

const teleportLocalListeners = new Set<(p: TeleportLocalPayload) => void>();

export function emitTeleportLocal(p: TeleportLocalPayload): void {
  for (const fn of teleportLocalListeners) fn(p);
}

export function onTeleportLocal(fn: (p: TeleportLocalPayload) => void): () => void {
  teleportLocalListeners.add(fn);
  return () => teleportLocalListeners.delete(fn);
}
