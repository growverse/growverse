import { useSyncExternalStore } from 'react';
import type { AvatarUser } from '@/domain/roles';

interface BotState {
  enabled: boolean;
  bots: AvatarUser[];
}

const state: BotState = {
  enabled: false,
  bots: [],
};

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

export const botControls = {
  setEnabled(enabled: boolean): void {
    state.enabled = enabled;
    if (!enabled) state.bots = [];
    emit();
  },
  setCount(n: number): void {
    if (n < 0) n = 0;
    state.bots = Array.from({ length: n }, (_, i) => ({
      id: `bot-${i + 1}`,
      name: `Bot - #${i + 1}`,
      role: 'bot',
      isBot: true,
      isAdmin: false,
    }));
    emit();
  },
  getBots(): AvatarUser[] {
    return state.bots;
  },
};

export function useBots(): AvatarUser[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state.bots,
  );
}
