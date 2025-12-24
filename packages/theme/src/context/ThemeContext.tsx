import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeMode, Theme, ThemeContextValue, ThemeProviderProps } from '../types';
import { lightTheme, darkTheme } from '../themes';

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Get system theme preference
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Theme Provider Component
 */
export function ThemeProvider({
  children,
  defaultMode = 'system',
  storageKey = 'saas_theme_mode',
  customTheme,
}: ThemeProviderProps) {
  // Load saved theme mode
  const loadThemeMode = (): ThemeMode => {
    if (typeof window === 'undefined') return defaultMode;
    
    try {
      const saved = localStorage.getItem(storageKey) as ThemeMode;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch (error) {
      console.error('[theme] Failed to load theme mode:', error);
    }
    
    return defaultMode;
  };

  const [mode, setModeState] = useState<ThemeMode>(loadThemeMode);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);

  // Determine actual theme based on mode
  const actualTheme = mode === 'system' ? systemTheme : mode;
  
  // Get theme object
  const baseTheme = actualTheme === 'dark' ? darkTheme : lightTheme;
  const theme: Theme = customTheme 
    ? { ...baseTheme, ...customTheme, colors: { ...baseTheme.colors, ...customTheme.colors } }
    : baseTheme;

  // Set mode with persistence
  const setMode = useCallback(
    (newMode: ThemeMode) => {
      setModeState(newMode);
      
      try {
        localStorage.setItem(storageKey, newMode);
      } catch (error) {
        console.error('[theme] Failed to save theme mode:', error);
      }
    },
    [storageKey]
  );

  // Toggle between light and dark
  const toggleMode = useCallback(() => {
    if (mode === 'system') {
      setMode(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      setMode(mode === 'dark' ? 'light' : 'dark');
    }
  }, [mode, systemTheme, setMode]);

  // Listen to system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // Set theme class
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
    
    // Set CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
  }, [theme, actualTheme]);

  const value: ThemeContextValue = {
    theme,
    mode,
    setMode,
    toggleMode,
    isDark: actualTheme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to use theme
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
}
