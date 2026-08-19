import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isPublicPage } from '@/services/api';
import { warmDataCaches } from '@/shared/lib/dataCaches';

export const DataPrefetch: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isPublicPage(window.location.pathname)) {
      warmDataCaches();
    }
  }, [isAuthenticated]);

  return null;
};