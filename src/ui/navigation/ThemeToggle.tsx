import React, { useCallback, useEffect, useState } from 'react';
import {
  applyTheme,
  getInitialTheme,
  getStoredTheme,
  persistTheme,
  subscribeToSystemTheme,
} from '../../utils/theme';
import type { ThemePreference } from '../../utils/theme';
import styles from './ThemeToggle.module.scss';

const ThemeToggle = React.memo(() => {
  const [theme, setTheme] = useState<ThemePreference>('light');

  useEffect(() => {
    const rootTheme = document.documentElement.dataset.theme;
    const storedTheme = getStoredTheme();

    const initialTheme =
      rootTheme === 'light' || rootTheme === 'dark' ? rootTheme : storedTheme ?? getInitialTheme();

    applyTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (getStoredTheme()) {
      return () => {};
    }

    const unsubscribe = subscribeToSystemTheme((systemTheme) => {
      setTheme(systemTheme);
      applyTheme(systemTheme);
    });

    return () => unsubscribe();
  }, []);

  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;

  const handleToggle = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      persistTheme(nextTheme);
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  return (
    <button
      type='button'
      className={styles.button}
      data-mode={theme}
      onClick={handleToggle}
      aria-label={label}
      title={label}
      aria-pressed={theme === 'dark'}
    >
      <span className={styles.dial} aria-hidden='true'>
        <svg className={styles.sun} viewBox='0 0 24 24' fill='none' focusable='false'>
          <circle cx='12' cy='12' r='4.4' fill='currentColor' />
          <g stroke='currentColor' strokeWidth='1.6' strokeLinecap='round'>
            <path d='M12 2.8v2.4' />
            <path d='M12 18.8v2.4' />
            <path d='M2.8 12h2.4' />
            <path d='M18.8 12h2.4' />
            <path d='m5.5 5.5 1.7 1.7' />
            <path d='m16.8 16.8 1.7 1.7' />
            <path d='m18.5 5.5-1.7 1.7' />
            <path d='m7.2 16.8-1.7 1.7' />
          </g>
        </svg>
        <svg className={styles.moon} viewBox='0 0 24 24' fill='none' focusable='false'>
          <path d='M20.2 13.6A8.4 8.4 0 0 1 10.4 3.8a8.4 8.4 0 1 0 9.8 9.8Z' fill='currentColor' />
        </svg>
      </span>
    </button>
  );
});

export default ThemeToggle;
