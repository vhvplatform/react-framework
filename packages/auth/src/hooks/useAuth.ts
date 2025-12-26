import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '@vhvplatform/api-client';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  login,
  register,
  logout,
  oauthCallback,
  fetchCurrentUser,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../store/authSlice';
import { LoginCredentials, RegisterCredentials, OAuthCallbackParams } from '../types';

/**
 * Hook to access auth functionality
 */
export function useAuth() {
  const dispatch = useDispatch();
  const apiClient = useApi();

  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  /**
   * Login user
   */
  const loginUser = async (credentials: LoginCredentials) => {
    const result = await dispatch(login({ credentials, apiClient }) as never);
    return unwrapResult(result as never);
  };

  /**
   * Register user
   */
  const registerUser = async (credentials: RegisterCredentials) => {
    const result = await dispatch(register({ credentials, apiClient }) as never);
    return unwrapResult(result as never);
  };

  /**
   * Handle OAuth callback
   */
  const handleOAuthCallback = async (provider: string, params: OAuthCallbackParams) => {
    const result = await dispatch(oauthCallback({ provider, params, apiClient }) as never);
    return unwrapResult(result as never);
  };

  /**
   * Logout user
   */
  const logoutUser = async () => {
    const result = await dispatch(logout({ apiClient }) as never);
    return result;
  };

  /**
   * Fetch current user
   */
  const refreshUser = async () => {
    const result = await dispatch(fetchCurrentUser({ apiClient }) as never);
    return unwrapResult(result as never);
  };

  /**
   * Clear error
   */
  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    // State
    auth,
    user,
    isAuthenticated,
    loading,
    error,

    // Actions
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    oauthCallback: handleOAuthCallback,
    refreshUser,
    clearError: clearAuthError,
  };
}
