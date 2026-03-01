import React, { useCallback, useEffect, useId, useState } from 'react';
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
  const clipPathId = `theme-toggle-classic-cutout-${useId().replace(/:/g, '')}`;
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
    <div className={`${styles.wrapper} theme-toggle-wrapper`} data-theme={theme}>
      <button
        type='button'
        className={`${styles.button} theme-toggle ${
          theme === 'dark' ? 'theme-toggle--toggled' : ''
        }`}
        onClick={handleToggle}
        aria-label={label}
        title={label}
        aria-pressed={theme === 'dark'}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          aria-hidden='true'
          width='1em'
          height='1em'
          fill='currentColor'
          strokeLinecap='round'
          className='theme-toggle__classic'
          viewBox='0 0 32 32'
        >
          <clipPath id={clipPathId}>
            <path d='M0-5h30a1 1 0 0 0 9 13v24H0Z' />
          </clipPath>
          <g clipPath={`url(#${clipPathId})`}>
            <circle cx='16' cy='16' r='9.34' />
            <g stroke='currentColor' strokeWidth='1.5'>
              <path d='M16 5.5v-4' />
              <path d='M16 30.5v-4' />
              <path d='M1.5 16h4' />
              <path d='M26.5 16h4' />
              <path d='m23.4 8.6 2.8-2.8' />
              <path d='m5.7 26.3 2.9-2.9' />
              <path d='m5.8 5.8 2.8 2.8' />
              <path d='m23.4 23.4 2.9 2.9' />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
});

export default ThemeToggle;
