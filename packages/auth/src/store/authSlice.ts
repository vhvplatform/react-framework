import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ApiClient } from '@longvhv/api-client';
import {
  AuthState,
  User,
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  OAuthCallbackParams,
} from '../types';

/**
 * Token storage key
 */
const TOKEN_KEY = 'saas_auth_token';
const USER_KEY = 'saas_auth_user';

/**
 * Initial auth state
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/**
 * Load auth state from localStorage
 */
function loadAuthFromStorage(): Partial<AuthState> {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      const user = JSON.parse(userStr) as User;
      return {
        token,
        user,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }

  return {};
}

/**
 * Save auth state to localStorage
 */
function saveAuthToStorage(token: string, user: User): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save auth to storage:', error);
  }
}

/**
 * Clear auth from localStorage
 */
function clearAuthFromStorage(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Failed to clear auth from storage:', error);
  }
}

/**
 * Login async thunk
 * Calls @longvhv/saas-framework-go /api/auth/login endpoint
 */
export const login = createAsyncThunk<
  LoginResponse,
  { credentials: LoginCredentials; apiClient: ApiClient },
  { rejectValue: string }
>('auth/login', async ({ credentials, apiClient }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

/**
 * Register async thunk
 * Calls @longvhv/saas-framework-go /api/auth/register endpoint
 */
export const register = createAsyncThunk<
  LoginResponse,
  { credentials: RegisterCredentials; apiClient: ApiClient },
  { rejectValue: string }
>('auth/register', async ({ credentials, apiClient }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<LoginResponse>('/api/auth/register', credentials);
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

/**
 * OAuth callback async thunk
 * Calls @longvhv/saas-framework-go /api/auth/oauth/callback endpoint
 */
export const oauthCallback = createAsyncThunk<
  LoginResponse,
  { provider: string; params: OAuthCallbackParams; apiClient: ApiClient },
  { rejectValue: string }
>('auth/oauthCallback', async ({ provider, params, apiClient }, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<LoginResponse>(
      `/api/auth/oauth/${provider}/callback`,
      params
    );
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

/**
 * Logout async thunk
 * Calls @longvhv/saas-framework-go /api/auth/logout endpoint
 */
export const logout = createAsyncThunk<void, { apiClient: ApiClient }>(
  'auth/logout',
  async ({ apiClient }) => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    }
  }
);

/**
 * Fetch current user async thunk
 * Calls @longvhv/saas-framework-go /api/auth/me endpoint
 */
export const fetchCurrentUser = createAsyncThunk<
  User,
  { apiClient: ApiClient },
  { rejectValue: string }
>('auth/fetchCurrentUser', async ({ apiClient }, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<User>('/api/auth/me');
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

/**
 * Auth slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    ...loadAuthFromStorage(),
  },
  reducers: {
    /**
     * Set user
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (state.token) {
        saveAuthToStorage(state.token, action.payload);
      }
    },

    /**
     * Set token
     */
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      if (state.user) {
        saveAuthToStorage(action.payload, state.user);
      }
    },

    /**
     * Clear auth
     */
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthFromStorage();
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        saveAuthToStorage(action.payload.token, action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        saveAuthToStorage(action.payload.token, action.payload.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    // OAuth callback
    builder
      .addCase(oauthCallback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(oauthCallback.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        saveAuthToStorage(action.payload.token, action.payload.user);
      })
      .addCase(oauthCallback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'OAuth authentication failed';
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearAuthFromStorage();
      })
      .addCase(logout.rejected, (state) => {
        // Clear auth even if logout API call fails
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearAuthFromStorage();
      });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (state.token) {
          saveAuthToStorage(state.token, action.payload);
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
        // Clear auth if user fetch fails (invalid token)
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearAuthFromStorage();
      });
  },
});

// Export actions
export const { setUser, setToken, clearAuth, clearError } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
