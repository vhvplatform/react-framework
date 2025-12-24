import { useCallback } from 'react';
import { useAppContext } from '../providers/AppContextProvider';
import { UserRole } from '../types';

/**
 * Hook for role-based access control
 */
export function useRoles() {
  const { user, tenant } = useAppContext();

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  const isAdmin = useCallback((): boolean => {
    if (!user) return false;
    return user.role === 'admin';
  }, [user]);

  const isSuperAdmin = useCallback((): boolean => {
    if (!user) return false;
    return user.role === 'super_admin';
  }, [user]);

  const canAccessResource = useCallback(
    (requiredRole: UserRole): boolean => {
      if (!user) return false;
      const roleHierarchy: Record<UserRole, number> = {
        super_admin: 4,
        admin: 3,
        manager: 2,
        user: 1,
        guest: 0,
      };
      return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    },
    [user]
  );

  const isTenantOwner = useCallback((): boolean => {
    if (!user || !tenant) return false;
    return tenant.ownerId === user.id;
  }, [user, tenant]);

  return {
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
    canAccessResource,
    isTenantOwner,
  };
}
