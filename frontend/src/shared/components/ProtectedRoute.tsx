import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions, ROUTE_PERMISSIONS } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { BrandedLoading } from '@/shared/components/BrandedLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const location = useLocation();
  const { canAccessRoute } = usePermissions();
  const { isLoading } = useAuth();

  if (isLoading) {
    return <BrandedLoading text="Verificando acceso..." />;
  }

  // Verificar si el usuario puede acceder a la ruta actual
  const canAccess = canAccessRoute(location.pathname);

  if (!canAccess) {
    // Si se proporciona un fallback, usarlo
    if (fallback) {
      return <>{fallback}</>;
    }
    // De lo contrario, redirigir a unauthorized
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
