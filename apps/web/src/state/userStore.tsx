import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useMemo,
  type Dispatch,
  type ReactNode,
} from 'react';
import type {
  Role,
  InstructorSubRole,
  LearnerSubRole,
  AvatarUser as BasicUser,
} from '@/domain/roles';
import { useBots, botControls } from '@/state/bots';
import type { AvatarUserPreferences, PerformancePreset } from '@/types/preferences';
import { worldBridge } from '@/world/bridge/worldBridge';
import type { UserSnapshot } from '@/world/types';

export interface AvatarUser {
  id: string;
  name: string;
  role: Role;
  subRole?: InstructorSubRole | LearnerSubRole;
  isAdmin: boolean;
  preferences: AvatarUserPreferences;
}

interface UserState {
  user: AvatarUser;
}

interface UpdatePrefsAction {
  type: 'UPDATE_PREFS';
  payload: Partial<AvatarUserPreferences>;
}
interface UpdateRoleAction {
  type: 'UPDATE_ROLE';
  role: Role;
  subRole?: InstructorSubRole | LearnerSubRole;
}
interface SetUserAction {
  type: 'SET_USER';
  user: AvatarUser;
}
type Action = UpdatePrefsAction | UpdateRoleAction | SetUserAction;

function reducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case 'UPDATE_PREFS':
      return {
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload },
        },
      };
    case 'UPDATE_ROLE':
      return {
        user: { ...state.user, role: action.role, subRole: action.subRole },
      };
    case 'SET_USER':
      return { user: action.user };
    default:
      return state;
  }
}

function snapshotToAvatarUser(snapshot: UserSnapshot): AvatarUser {
  return {
    id: snapshot.id,
    name: snapshot.displayName ?? 'Player',
    role: (snapshot.role === 'admin' ? 'instructor' : snapshot.role) as Role,
    subRole: snapshot.subRole as InstructorSubRole | LearnerSubRole | undefined,
    isAdmin: snapshot.role === 'admin',
    preferences: {
      performancePreset: snapshot.preferences.graphics as PerformancePreset,
      timeFormat: '24h',
      enableNotifications: false,
      enableDarkMode: false,
    },
  };
}

const fallbackUser: AvatarUser = {
  id: 'local-1',
  name: 'macaris64',
  role: 'learner',
  isAdmin: true,
  preferences: {
    performancePreset: 'high',
    timeFormat: '24h',
    enableNotifications: false,
    enableDarkMode: false,
  },
};

const UserContext = createContext<{ state: UserState; dispatch: Dispatch<Action> } | undefined>(
  undefined,
);

export function UserProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const snap = worldBridge.user.get();
    return { user: snap ? snapshotToAvatarUser(snap) : fallbackUser };
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    userStore._dispatch = dispatch;
    userStore._getLocal = () => stateRef.current.user;
  }, [dispatch]);

  useEffect(() => {
    const unsub = worldBridge.user.subscribe(() => {
      const snap = worldBridge.user.get();
      if (snap) {
        dispatch({ type: 'SET_USER', user: snapshotToAvatarUser(snap) });
      }
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (state.user.preferences.enableDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [state.user.preferences.enableDarkMode]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserStore() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserStore must be used within UserProvider');
  return ctx;
}

export function useLocalUser(): AvatarUser {
  return useUserStore().state.user;
}

export function useOnlineUsers(): BasicUser[] {
  const bots = useBots();
  const local = useLocalUser();
  const localBasic: BasicUser = {
    id: local.id,
    name: local.name,
    role: local.role,
    subRole: local.subRole,
    isAdmin: local.isAdmin,
  };
  return [localBasic, ...bots];
}

export function selectOnlineUsers(): BasicUser[] {
  const local = userStore.getLocal();
  const localBasic: BasicUser = {
    id: local.id,
    name: local.name,
    role: local.role,
    subRole: local.subRole,
    isAdmin: local.isAdmin,
  };
  return [localBasic, ...botControls.getBots()];
}

export function updatePreferences(partial: Partial<AvatarUserPreferences>): void {
  userStore._dispatch?.({ type: 'UPDATE_PREFS', payload: partial });
}

export function updateLocalRole(role: Role, subRole?: InstructorSubRole | LearnerSubRole): void {
  userStore._dispatch?.({ type: 'UPDATE_ROLE', role, subRole });
}

export function setPerformancePreset(preset: PerformancePreset): void {
  userStore._dispatch?.({ type: 'UPDATE_PREFS', payload: { performancePreset: preset } });
}

export const userStore = {
  _dispatch: null as Dispatch<Action> | null,
  _getLocal: () => fallbackUser,
  getLocal(): AvatarUser {
    return this._getLocal();
  },
};
