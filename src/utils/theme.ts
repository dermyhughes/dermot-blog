export type ThemePreference = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'preferred-theme';

const isBrowser = typeof window !== 'undefined';
const canUseDOM = typeof document !== 'undefined';

export const getStoredTheme = (): ThemePreference | null => {
  if (!isBrowser) return null;
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return null;
};

export const getSystemTheme = (): ThemePreference => {
  if (!isBrowser || !window.matchMedia) {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const THEME_COLORS: Record<ThemePreference, string> = {
  dark: '#0e0918',
  light: '#f7f4fb',
};

export const applyTheme = (theme: ThemePreference) => {
  if (!canUseDOM) return;
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const themeColorMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.content = THEME_COLORS[theme];
  }
};

export const persistTheme = (theme: ThemePreference) => {
  if (!isBrowser) return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const subscribeToSystemTheme = (callback: (theme: ThemePreference) => void) => {
  if (!isBrowser || !window.matchMedia) return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const listener = (event: MediaQueryListEvent) => callback(event.matches ? 'dark' : 'light');

  mediaQuery.addEventListener('change', listener);

  return () => {
    mediaQuery.removeEventListener('change', listener);
  };
};

export const getInitialTheme = (): ThemePreference => {
  const storedTheme = getStoredTheme();
  return storedTheme ?? getSystemTheme();
};
