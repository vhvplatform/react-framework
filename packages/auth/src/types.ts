/**
 * User interface from @vhvplatform/go-framework
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/**
 * Authentication state
 */
export interface AuthState {
  /**
   * Current authenticated user
   */
  user: User | null;

  /**
   * JWT access token
   */
  token: string | null;

  /**
   * Is user authenticated
   */
  isAuthenticated: boolean;

  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error message
   */
  error: string | null;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Register credentials
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

/**
 * Login response from @vhvplatform/go-framework
 */
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

/**
 * OAuth provider type
 */
export type OAuthProvider = 'google' | 'github' | 'custom';

/**
 * OAuth configuration
 */
export interface OAuthConfig {
  /**
   * Provider name
   */
  provider: OAuthProvider;

  /**
   * OAuth authorization URL
   */
  authUrl: string;

  /**
   * Client ID
   */
  clientId: string;

  /**
   * Redirect URI
   */
  redirectUri: string;

  /**
   * OAuth scopes
   */
  scopes?: string[];
}

/**
 * OAuth callback params
 */
export interface OAuthCallbackParams {
  code: string;
  state?: string;
  error?: string;
  error_description?: string;
}
