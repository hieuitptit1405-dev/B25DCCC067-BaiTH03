import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_KEY = 'shopmini-user';
const VALID_PASSWORD = '123456';

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'username' in parsed &&
      typeof parsed.username === 'string'
    ) {
      return { username: parsed.username };
    }
  } catch {
  }
  return null;
}

function writeStoredUser(user: User | null): void {
  try {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  } catch {
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const login = useCallback((username: string, password: string): boolean => {
    const name = username.trim();
    if (!name || password !== VALID_PASSWORD) return false;
    const nextUser: User = { username: name };
    writeStoredUser(nextUser);
    setUser(nextUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    writeStoredUser(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  }
  return context;
}
