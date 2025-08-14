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
import { tzAbbrev, formatTime } from '@/utils/time';
import { useOnlineUsers, selectOnlineUsers } from '@/state/userStore';

export interface Session {
  id: string;
  name: string;
  description?: string;
  instanceTitle?: string;
  maxLearners: number;
  currentLearners: number;
  timezone: string;
  currentTime: string;
  currentTimezone: string;
  countdownEndAt: number;
}

interface SessionState {
  sessions: Session[];
  activeSessionId: string;
}

const initialCountdown = () => Date.now() + 20 * 60 * 1000;

function getInitialLearnerCount(): number {
  return selectOnlineUsers().filter((u) => u.role === 'learner').length;
}

function createDummySessions(): Session[] {
  const tz = 'Europe/Istanbul';
  const now = Date.now();
  const learners = getInitialLearnerCount();
  return [0, 1, 2, 3, 4].map((i) => {
    const date = new Date(now);
    const currentTime = formatTime(date, '24h', tz);
    return {
      id: `session-${i + 1}`,
      name: `Garden ${i + 1}`,
      description: 'Default session',
      instanceTitle: `Instance ${i + 1}`,
      maxLearners: 40,
      currentLearners: learners,
      timezone: tz,
      currentTime,
      currentTimezone: tzAbbrev(tz, date),
      countdownEndAt: initialCountdown(),
    } as Session;
  });
}

const initialSessions = createDummySessions();

const initialState: SessionState = {
  sessions: initialSessions,
  activeSessionId: initialSessions[0].id,
};

interface SetActiveAction {
  type: 'SET_ACTIVE';
  id: string;
}
interface TickAction {
  type: 'TICK';
  now: number;
}
interface SetLearnersAction {
  type: 'SET_LEARNERS';
  id: string;
  count: number;
}
type Action = SetActiveAction | TickAction | SetLearnersAction;

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'SET_ACTIVE':
      return { ...state, activeSessionId: action.id };
    case 'TICK': {
      const sessions = state.sessions.map((s) => {
        if (s.id !== state.activeSessionId) return s;
        const date = new Date(action.now);
        const currentTime = formatTime(date, '24h', s.timezone);
        return { ...s, currentTime, currentTimezone: tzAbbrev(s.timezone, date) };
      });
      return { ...state, sessions };
    }
    case 'SET_LEARNERS': {
      const sessions = state.sessions.map((s) =>
        s.id === action.id ? { ...s, currentLearners: action.count } : s,
      );
      return { ...state, sessions };
    }
    default:
      return state;
  }
}

interface SessionContextValue extends SessionState {
  activeSession?: Session;
  dispatch: Dispatch<Action>;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const onlineUsers = useOnlineUsers();

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'TICK', now: Date.now() });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeSession = state.sessions.find((s) => s.id === state.activeSessionId);

  useEffect(() => {
    sessionStore._dispatch = dispatch;
    sessionStore._getState = () => stateRef.current;
  }, [dispatch]);

  useEffect(() => {
    if (!activeSession) return;
    const learners = onlineUsers.filter((u) => u.role === 'learner').length;
    dispatch({ type: 'SET_LEARNERS', id: activeSession.id, count: learners });
  }, [onlineUsers, activeSession]);
  const value = useMemo(
    () => ({ ...state, activeSession, dispatch }),
    [state, activeSession, dispatch],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionStore(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSessionStore must be used within SessionProvider');
  return ctx;
}

// External helper for non-React modules
export const sessionStore = {
  _dispatch: null as Dispatch<Action> | null,
  _getState: null as (() => SessionState) | null,
  setActiveSession(id: string) {
    this._dispatch?.({ type: 'SET_ACTIVE', id });
  },
  tick(now: number) {
    this._dispatch?.({ type: 'TICK', now });
  },
  getState(): SessionState & { activeSession?: Session } {
    const s = this._getState ? this._getState() : initialState;
    return { ...s, activeSession: s.sessions.find((ss) => ss.id === s.activeSessionId) };
  },
};

export function setActiveSession(id: string): void {
  sessionStore.setActiveSession(id);
}

export function tickSession(now: number): void {
  sessionStore.tick(now);
}

export function setLearnersCount(id: string, count: number): void {
  sessionStore._dispatch?.({ type: 'SET_LEARNERS', id, count });
}
