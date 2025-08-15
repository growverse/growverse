let teleportImpl: (id: string) => void = () => {};

export function registerTeleport(fn: (id: string) => void): void {
  teleportImpl = fn;
}

export function teleportTo(id: string): void {
  teleportImpl(id);
}
