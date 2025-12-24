import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Protected Route component props
 */
export interface ProtectedRouteProps {
  /**
   * Children to render if authenticated
   */
  children: React.ReactNode;

  /**
   * Redirect path if not authenticated
   */
  redirectTo?: string;

  /**
   * Required roles (optional)
   */
  requiredRoles?: string[];
}

/**
 * Protected Route component
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({
  children,
  redirectTo = '/login',
  requiredRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check required roles if specified
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = user?.role;
    if (!userRole || !requiredRoles.includes(userRole)) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
          }}
        >
          <h1>Access Denied</h1>
          <p>You do not have permission to access this page.</p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
