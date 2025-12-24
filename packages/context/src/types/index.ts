/**
 * User role types
 */
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'user' | 'guest';

/**
 * Permission types
 */
export interface Permission {
  resource: string;
  actions: string[];
}

/**
 * Current user information
 */
export interface CurrentUser {
  /** User ID */
  id: string | number;
  
  /** Email */
  email: string;
  
  /** Full name */
  name: string;
  
  /** First name */
  firstName?: string;
  
  /** Last name */
  lastName?: string;
  
  /** Avatar URL */
  avatar?: string;
  
  /** User role */
  role: UserRole;
  
  /** Permissions */
  permissions: Permission[];
  
  /** Tenant ID */
  tenantId: string | number;
  
  /** Active status */
  isActive: boolean;
  
  /** Email verified */
  emailVerified: boolean;
  
  /** Language preference */
  language?: string;
  
  /** Timezone */
  timezone?: string;
  
  /** Custom metadata */
  metadata?: Record<string, any>;
  
  /** Created at */
  createdAt?: string;
  
  /** Last login */
  lastLoginAt?: string;
}

/**
 * Tenant information
 */
export interface Tenant {
  /** Tenant ID */
  id: string | number;
  
  /** Tenant name */
  name: string;
  
  /** Tenant slug/subdomain */
  slug: string;
  
  /** Tenant logo */
  logo?: string;
  
  /** Tenant domain */
  domain?: string;
  
  /** Tenant plan */
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  
  /** Plan limits */
  limits: {
    users: number;
    storage: number;
    apiCalls: number;
    [key: string]: any;
  };
  
  /** Current usage */
  usage: {
    users: number;
    storage: number;
    apiCalls: number;
    [key: string]: any;
  };
  
  /** Tenant settings */
  settings: Record<string, any>;
  
  /** Active status */
  isActive: boolean;
  
  /** Trial status */
  isTrial: boolean;
  
  /** Trial end date */
  trialEndsAt?: string;
  
  /** Subscription status */
  subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'trialing';
  
  /** Owner ID */
  ownerId: string | number;
  
  /** Created at */
  createdAt?: string;
  
  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * Site/Location information
 */
export interface Site {
  /** Site ID */
  id: string | number;
  
  /** Site name */
  name: string;
  
  /** Site code */
  code: string;
  
  /** Address */
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  
  /** Location coordinates */
  location?: {
    lat: number;
    lng: number;
  };
  
  /** Contact information */
  contact?: {
    phone?: string;
    email?: string;
  };
  
  /** Timezone */
  timezone: string;
  
  /** Locale */
  locale: string;
  
  /** Currency */
  currency: string;
  
  /** Active status */
  isActive: boolean;
  
  /** Site manager ID */
  managerId?: string | number;
  
  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * Application information
 */
export interface Application {
  /** Application ID */
  id: string;
  
  /** Application name */
  name: string;
  
  /** Application version */
  version: string;
  
  /** Environment */
  environment: 'development' | 'staging' | 'production';
  
  /** API base URL */
  apiUrl: string;
  
  /** Application features */
  features: {
    [key: string]: boolean;
  };
  
  /** Application config */
  config: Record<string, any>;
  
  /** Build info */
  build?: {
    number: string;
    timestamp: string;
    commit?: string;
  };
}

/**
 * Context state
 */
export interface ContextState {
  /** Current user */
  user: CurrentUser | null;
  
  /** Current tenant */
  tenant: Tenant | null;
  
  /** Current site */
  site: Site | null;
  
  /** Application info */
  application: Application;
  
  /** Loading state */
  loading: boolean;
  
  /** Error */
  error: string | null;
  
  /** Initialized */
  initialized: boolean;
}

/**
 * Context actions
 */
export interface ContextActions {
  /** Set current user */
  setUser: (user: CurrentUser | null) => void;
  
  /** Set current tenant */
  setTenant: (tenant: Tenant | null) => void;
  
  /** Set current site */
  setSite: (site: Site | null) => void;
  
  /** Update user */
  updateUser: (updates: Partial<CurrentUser>) => void;
  
  /** Update tenant */
  updateTenant: (updates: Partial<Tenant>) => void;
  
  /** Update site */
  updateSite: (updates: Partial<Site>) => void;
  
  /** Refresh context */
  refresh: () => Promise<void>;
  
  /** Clear context */
  clear: () => void;
  
  /** Check permission */
  hasPermission: (resource: string, action: string) => boolean;
  
  /** Check role */
  hasRole: (role: UserRole | UserRole[]) => boolean;
  
  /** Switch tenant */
  switchTenant: (tenantId: string | number) => Promise<void>;
  
  /** Switch site */
  switchSite: (siteId: string | number) => Promise<void>;
}

/**
 * Context value
 */
export interface ContextValue extends ContextState, ContextActions {}

/**
 * Context provider configuration
 */
export interface ContextProviderConfig {
  /** Application info */
  application: Application;
  
  /** API endpoints */
  endpoints?: {
    user?: string;
    tenant?: string;
    site?: string;
  };
  
  /** Auto-fetch on mount */
  autoFetch?: boolean;
  
  /** Storage key for persistence */
  storageKey?: string;
  
  /** Enable debug mode */
  debug?: boolean;
  
  /** Callbacks */
  onUserChange?: (user: CurrentUser | null) => void;
  onTenantChange?: (tenant: Tenant | null) => void;
  onSiteChange?: (site: Site | null) => void;
  onError?: (error: Error) => void;
}

/**
 * Tenant selection info
 */
export interface TenantSelection {
  tenants: Tenant[];
  currentTenantId: string | number | null;
  selectTenant: (tenantId: string | number) => Promise<void>;
}

/**
 * Site selection info
 */
export interface SiteSelection {
  sites: Site[];
  currentSiteId: string | number | null;
  selectSite: (siteId: string | number) => Promise<void>;
}
