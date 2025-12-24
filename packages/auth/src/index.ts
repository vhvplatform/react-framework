// Main exports
export { default as authReducer } from './store/authSlice';
export {
  login,
  register,
  logout,
  oauthCallback,
  fetchCurrentUser,
  setUser,
  setToken,
  clearAuth,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from './store/authSlice';

// Hooks
export { useAuth } from './hooks/useAuth';

// Components
export { ProtectedRoute } from './components/ProtectedRoute';
export { LoginForm } from './components/LoginForm';
export { OAuthButton } from './components/OAuthButton';

// Types
export type {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  OAuthProvider,
  OAuthConfig,
  OAuthCallbackParams,
} from './types';

export type { ProtectedRouteProps } from './components/ProtectedRoute';
export type { LoginFormProps } from './components/LoginForm';
export type { OAuthButtonProps } from './components/OAuthButton';
