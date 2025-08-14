import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { Role, InstructorSubRole, LearnerSubRole } from '@/domain/roles';

export interface UserPreferences {
  timeFormat: '24h' | '12h';
  enableNotifications: boolean;
  enableDarkMode: boolean;
}

export interface AvatarUser {
  id: string;
  name: string;
  role: Role;
  subRole?: InstructorSubRole | LearnerSubRole;
  isAdmin: boolean;
  preferences: UserPreferences;
}

interface UserState {
  user: AvatarUser;
}

interface UpdatePrefsAction {
  type: 'UPDATE_PREFS';
  payload: Partial<UserPreferences>;
}
interface UpdateRoleAction {
  type: 'UPDATE_ROLE';
  role: Role;
  subRole?: InstructorSubRole | LearnerSubRole;
}
type Action = UpdatePrefsAction | UpdateRoleAction;

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
    default:
      return state;
  }
}

const initialUser: AvatarUser = {
  id: 'local-1',
  name: 'macaris64',
  role: 'learner',
  isAdmin: true,
  preferences: {
    timeFormat: '24h',
    enableNotifications: false,
    enableDarkMode: false,
  },
};

const UserContext = createContext<{ state: UserState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, { user: initialUser });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    userStore._dispatch = dispatch;
    userStore._getLocal = () => stateRef.current.user;
  }, [dispatch]);

  useEffect(() => {
    if (state.user.preferences.enableDarkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [state.user.preferences.enableDarkMode]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>
  );
}

export function useUserStore() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserStore must be used within UserProvider');
  return ctx;
}

export function useLocalUser(): AvatarUser {
  return useUserStore().state.user;
}

export function updatePreferences(partial: Partial<UserPreferences>): void {
  userStore._dispatch?.({ type: 'UPDATE_PREFS', payload: partial });
}

export function updateLocalRole(role: Role, subRole?: InstructorSubRole | LearnerSubRole): void {
  userStore._dispatch?.({ type: 'UPDATE_ROLE', role, subRole });
}

export const userStore = {
  _dispatch: null as React.Dispatch<Action> | null,
  _getLocal: () => initialUser,
  getLocal(): AvatarUser {
    return this._getLocal();
  },
};
