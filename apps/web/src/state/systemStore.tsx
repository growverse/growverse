import { createContext, useContext, useEffect, useState, useRef } from 'react';

export interface System {
  teleportEnabled: boolean;
}

const initialState: System = {
  teleportEnabled: true,
};

const SystemContext = createContext<System | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, setState] = useState<System>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    systemStore._setState = setState;
    systemStore._getState = () => stateRef.current;
  }, [setState]);

  return <SystemContext.Provider value={state}>{children}</SystemContext.Provider>;
}

export function useSystem(): System {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem must be used within SystemProvider');
  return ctx;
}

export function useTeleportEnabled(): boolean {
  return useSystem().teleportEnabled;
}

export const systemStore = {
  _setState: (() => {}) as React.Dispatch<React.SetStateAction<System>>,
  _getState: () => initialState,
  getState(): System {
    return this._getState();
  },
  setTeleportEnabled(v: boolean) {
    this._setState((s) => ({ ...s, teleportEnabled: v }));
  },
};
