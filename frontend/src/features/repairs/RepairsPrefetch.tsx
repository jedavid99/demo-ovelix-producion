import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isPublicPage } from '@/services/api';
import { fetchRepairsData } from './services/repairsCache';

/**
 * Calienta la caché de reparaciones en segundo plano cuando el usuario ya está
 * autenticado, para que la lista de reparaciones cargue al instante.
 */
export const RepairsPrefetch: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isPublicPage(window.location.pathname)) {
      fetchRepairsData().catch(() => {
        // Silencioso: si falla, la lista cargará normal al entrar.
      });
    }
  }, [isAuthenticated]);

  return null;
};