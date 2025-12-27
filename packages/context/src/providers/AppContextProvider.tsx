import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { useApi } from '@vhvplatform/api-client';
import { ContextValue, ContextProviderConfig, CurrentUser, Tenant, Site, UserRole } from '../types';

const AppContext = createContext<ContextValue | null>(null);

interface AppContextProviderProps {
  children: ReactNode;
  config: ContextProviderConfig;
}

export function AppContextProvider({ children, config }: AppContextProviderProps) {
  const {
    application,
    endpoints = {},
    autoFetch = true,
    storageKey = 'app_context',
    debug = false,
    onUserChange,
    onTenantChange,
    onSiteChange,
    onError,
  } = config;

  const apiClient = useApi();

  const [state, setState] = useState<{
    user: CurrentUser | null;
    tenant: Tenant | null;
    site: Site | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
  }>({
    user: null,
    tenant: null,
    site: null,
    loading: false,
    error: null,
    initialized: false,
  });

  // Load from storage
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        setState((prev) => ({
          ...prev,
          user: data.user || null,
          tenant: data.tenant || null,
          site: data.site || null,
        }));
      }
    } catch (error) {
      if (debug) {
        console.error('[AppContext] Failed to load from storage:', error);
      }
    }
  }, [storageKey, debug]);

  // Save to storage
  const saveToStorage = useCallback(() => {
    try {
      const data = {
        user: state.user,
        tenant: state.tenant,
        site: state.site,
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      if (debug) {
        console.error('[AppContext] Failed to save to storage:', error);
      }
    }
  }, [state.user, state.tenant, state.site, storageKey, debug]);

  // Fetch context data
  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const promises: Promise<any>[] = [];

      if (endpoints.user) {
        promises.push(apiClient.get<CurrentUser>(endpoints.user));
      }
      if (endpoints.tenant) {
        promises.push(apiClient.get<Tenant>(endpoints.tenant));
      }
      if (endpoints.site) {
        promises.push(apiClient.get<Site>(endpoints.site));
      }

      const results = await Promise.all(promises);
      let index = 0;

      const newState: any = { loading: false, initialized: true };

      if (endpoints.user) {
        newState.user = results[index++];
      }
      if (endpoints.tenant) {
        newState.tenant = results[index++];
      }
      if (endpoints.site) {
        newState.site = results[index++];
      }

      setState((prev) => ({ ...prev, ...newState }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load context';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
        initialized: true,
      }));
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [apiClient, endpoints, onError]);

  // Set user
  const setUser = useCallback(
    (user: CurrentUser | null) => {
      setState((prev) => ({ ...prev, user }));
      onUserChange?.(user);
    },
    [onUserChange]
  );

  // Set tenant
  const setTenant = useCallback(
    (tenant: Tenant | null) => {
      setState((prev) => ({ ...prev, tenant }));
      onTenantChange?.(tenant);
    },
    [onTenantChange]
  );

  // Set site
  const setSite = useCallback(
    (site: Site | null) => {
      setState((prev) => ({ ...prev, site }));
      onSiteChange?.(site);
    },
    [onSiteChange]
  );

  // Update user
  const updateUser = useCallback((updates: Partial<CurrentUser>) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  }, []);

  // Update tenant
  const updateTenant = useCallback((updates: Partial<Tenant>) => {
    setState((prev) => ({
      ...prev,
      tenant: prev.tenant ? { ...prev.tenant, ...updates } : null,
    }));
  }, []);

  // Update site
  const updateSite = useCallback((updates: Partial<Site>) => {
    setState((prev) => ({
      ...prev,
      site: prev.site ? { ...prev.site, ...updates } : null,
    }));
  }, []);

  // Clear context
  const clear = useCallback(() => {
    setState({
      user: null,
      tenant: null,
      site: null,
      loading: false,
      error: null,
      initialized: false,
    });
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // Check permission
  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!state.user) return false;

      return state.user.permissions.some(
        (perm) => perm.resource === resource && perm.actions.includes(action)
      );
    },
    [state.user]
  );

  // Check role
  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!state.user) return false;

      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(state.user.role);
    },
    [state.user]
  );

  // Switch tenant
  const switchTenant = useCallback(
    async (tenantId: string | number) => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        await apiClient.post('/api/tenant/switch', { tenantId });
        await refresh();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to switch tenant';
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [apiClient, refresh, onError]
  );

  // Switch site
  const switchSite = useCallback(
    async (siteId: string | number) => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        await apiClient.post('/api/site/switch', { siteId });
        await refresh();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to switch site';
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    },
    [apiClient, refresh, onError]
  );

  // Load from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]); // loadFromStorage is memoized with useCallback

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      refresh();
    }
    // Only run when autoFetch changes or on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]); // refresh changes would cause unwanted re-fetches

  // Save to storage when state changes
  useEffect(() => {
    if (state.initialized) {
      saveToStorage();
    }
  }, [state.user, state.tenant, state.site, state.initialized, saveToStorage]);

  // Memoize context value to prevent unnecessary re-renders
  const value: ContextValue = useMemo(
    () => ({
      ...state,
      application,
      setUser,
      setTenant,
      setSite,
      updateUser,
      updateTenant,
      updateSite,
      refresh,
      clear,
      hasPermission,
      hasRole,
      switchTenant,
      switchSite,
    }),
    [
      state,
      application,
      setUser,
      setTenant,
      setSite,
      updateUser,
      updateTenant,
      updateSite,
      refresh,
      clear,
      hasPermission,
      hasRole,
      switchTenant,
      switchSite,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): ContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }

  return context;
}

export function useCurrentUser() {
  const { user } = useAppContext();
  return user;
}

export function useCurrentTenant() {
  const { tenant } = useAppContext();
  return tenant;
}

export function useCurrentSite() {
  const { site } = useAppContext();
  return site;
}

export function useApplication() {
  const { application } = useAppContext();
  return application;
}

export function usePermissions() {
  const { hasPermission, hasRole } = useAppContext();
  return { hasPermission, hasRole };
}
