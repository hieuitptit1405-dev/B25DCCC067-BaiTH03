import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Theme } from '../types';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'color-scheme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function getSystemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function writeStoredTheme(value: Theme | null): void {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, value);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
  }
}

function applyColorSchemeMeta(value: Theme | null): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (meta) meta.content = value ?? 'light dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);
  const [storedTheme, setStoredTheme] = useState<Theme | null>(readStoredTheme);

  const theme: Theme = storedTheme ?? systemTheme;

  useEffect(() => {
    applyColorSchemeMeta(storedTheme);
  }, [storedTheme]);

  useEffect(() => {
    const mql = window.matchMedia(DARK_QUERY);
    const onChange = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) setStoredTheme(readStoredTheme());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    const target: Theme = theme === 'dark' ? 'light' : 'dark';
    const next = target === systemTheme ? null : target;
    writeStoredTheme(next);
    setStoredTheme(next);
  }, [theme, systemTheme]);

  const value = useMemo<ThemeContextValue>(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme phải được dùng bên trong <ThemeProvider>');
  }
  return context;
}
