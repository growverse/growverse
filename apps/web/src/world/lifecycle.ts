let cleanup: (() => void) | null = null;

export function registerWorldCleanup(fn: () => void): void {
  cleanup = fn;
}

export function destroyWorld(): void {
  if (cleanup) {
    cleanup();
    cleanup = null;
  }
}
