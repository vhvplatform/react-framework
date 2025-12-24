import { useTheme } from '../context/ThemeContext';

/**
 * Hook to check if dark mode is active
 */
export function useIsDark(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

/**
 * Hook to toggle theme
 */
export function useToggleTheme() {
  const { toggleMode } = useTheme();
  return toggleMode;
}
