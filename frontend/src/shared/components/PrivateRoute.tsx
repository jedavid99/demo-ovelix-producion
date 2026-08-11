import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredPermissions }) => {
  const token = localStorage.getItem('access_token');
  const location = useLocation();
  const { hasAnyPermission } = usePermissions();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se requieren permisos específicos, verificarlos
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (!hasAnyPermission(requiredPermissions as any)) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
