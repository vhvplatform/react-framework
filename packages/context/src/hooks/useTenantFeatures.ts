import { useCallback } from 'react';
import { useAppContext } from '../providers/AppContextProvider';

export function useTenantFeatures() {
  const { tenant } = useAppContext();

  const hasFeature = useCallback(
    (featureName: string): boolean => {
      if (!tenant) return false;
      // Features can be stored in settings or metadata
      const features = tenant.settings?.features || tenant.metadata?.features || [];
      return Array.isArray(features) && features.includes(featureName);
    },
    [tenant]
  );

  const getFeatures = useCallback((): string[] => {
    if (!tenant) return [];
    const features = tenant.settings?.features || tenant.metadata?.features || [];
    return Array.isArray(features) ? features : [];
  }, [tenant]);

  const isWithinLimit = useCallback(
    (limitName: string): boolean => {
      if (!tenant || !tenant.limits || !tenant.usage) return true;
      const limit = tenant.limits[limitName];
      const usage = tenant.usage[limitName];
      if (limit === undefined || usage === undefined) return true;
      return usage < limit;
    },
    [tenant]
  );

  const getRemainingQuota = useCallback(
    (limitName: string): number => {
      if (!tenant || !tenant.limits || !tenant.usage) return 0;
      const limit = tenant.limits[limitName];
      const usage = tenant.usage[limitName];
      if (limit === undefined || usage === undefined) return 0;
      return Math.max(0, limit - usage);
    },
    [tenant]
  );

  return {
    hasFeature,
    getFeatures,
    isWithinLimit,
    getRemainingQuota,
  };
}
