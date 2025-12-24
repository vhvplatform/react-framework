/**
 * Theme types
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme colors
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  [key: string]: string;
}

/**
 * Theme configuration
 */
export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string | number>;
  };
}

/**
 * Theme context value
 */
export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  isDark: boolean;
}

/**
 * Theme provider props
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
  customTheme?: Partial<Theme>;
}
