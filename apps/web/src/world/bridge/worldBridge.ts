import type { UserSnapshot } from '../types';

type Listener = () => void;
class Atom<T extends object | null> {
  private value: T;
  private listeners = new Set<Listener>();
  private version = 0;
  constructor(initial: T) {
    this.value = initial;
  }
  get(): T {
    return this.value;
  }
  set(next: T) {
    this.value = next;
    this.version++;
    this.emit();
  }
  update(patch: Partial<NonNullable<T>>) {
    if (this.value === null) {
      this.set(patch as T);
      return;
    }
    this.set({ ...(this.value as NonNullable<T>), ...patch } as T);
  }
  getVersion() {
    return this.version;
  }
  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private emit() {
    this.listeners.forEach((fn) => fn());
  }
}

export const worldBridge = {
  user: new Atom<UserSnapshot | null>(null),
  session: new Atom<Record<string, unknown> | null>(null),
};
