import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, getMe } from '../services/auth.service';
import { clearAuthToken, isPublicPage } from '../services/api';
import { logger } from '@/utils/logger';
import { jwtDecode } from 'jwt-decode';

// Sesión expira automáticamente tras 2 minutos sin actividad
const INACTIVITY_TIMEOUT_MS = 2 * 60 * 1000;

interface User {
  id?: string;
  email?: string;
  nombre?: string;
  apellido?: string;
  activo?: boolean;
  empresa_id?: string;
  rol?: { name: string } | string;
  permissions?: string[];
  empresa?: { razon_social: string; codigo_empresa: string; direccion?: string; ciudad?: string; provincia?: string };
  created_at?: string;
  updated_at?: string;
  dni?: string;
  telefono?: string;
  [key: string]: unknown;
}
interface DecodedToken {
  permissions?: string[];
}
interface AuthContextType {
  user: User | null;
  login: (email: string, contraseña: string, codigoEmpresa: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('user_data');
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem('user_data');
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(() => {
    const hasToken = !!localStorage.getItem('access_token');
    const hasCachedUser = !!localStorage.getItem('user_data');
    return hasToken && !hasCachedUser;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('access_token'));
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        localStorage.removeItem('user_data');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // En páginas públicas (presupuesto, repair-status, etc.) no se valida el
      // token contra el backend: evita que un 401 cierre la sesión o redirija
      // al login del sistema de gestión.
      if (isPublicPage(window.location.pathname)) {
        const cached = localStorage.getItem('user_data');
        if (cached) {
          try {
            setUser(JSON.parse(cached));
            setIsAuthenticated(true);
          } catch {
            setUser(null);
          }
        }
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getMe();
        
        // Decodificar el token para obtener los permisos
        let decodedToken: DecodedToken = {};
        try {
          decodedToken = jwtDecode<DecodedToken>(token);
        } catch (error) {
          logger.error('Error al decodificar token en initAuth:', error);
        }
        
        // Agregar permisos del token al usuario
        if (decodedToken.permissions && currentUser) {
          currentUser.permissions = decodedToken.permissions;
        }
        
        // Preservar nombre/apellido del cache local si el backend no los trae
        const cached = localStorage.getItem('user_data');
        let cachedUser: User | null = null;
        if (cached) {
          try { cachedUser = JSON.parse(cached); } catch {}
        }
        
        const mergedUser = {
          ...currentUser,
          nombre: currentUser.nombre ?? cachedUser?.nombre,
          apellido: currentUser.apellido ?? cachedUser?.apellido,
          email: currentUser.email ?? cachedUser?.email,
          empresa_id: currentUser.empresa_id ?? cachedUser?.empresa_id,
          rol: currentUser.rol ?? cachedUser?.rol,
        };
        
        setUser(mergedUser);
        localStorage.setItem('user_data', JSON.stringify(mergedUser));
        setIsAuthenticated(true);
      } catch (error) {
        logger.error('Error al obtener usuario en initAuth:', error);
        const cached = localStorage.getItem('user_data');
        if (cached) {
          try {
            setUser(JSON.parse(cached));
          } catch {
            setUser(null);
          }
          setIsAuthenticated(true);
        } else {
          clearAuthToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setIsLoading(false);
    };
    initAuth();
  }, []);
  const login = async (email: string, password: string, codigoEmpresa: string) => {
    const response = await loginService(email, password, codigoEmpresa);

    // El backend devuelve {data: {data: {access_token, refresh_token, user}}}
    const token = response?.data?.data?.access_token ||
                  response?.data?.access_token ||
                  response?.access_token;

    if (token) {
      localStorage.setItem('access_token', token);

      // Decodificar el token para obtener los permisos
      let decodedToken: DecodedToken = {};
      try {
        decodedToken = jwtDecode<DecodedToken>(token);
      } catch (error) {
        logger.error('Error al decodificar token:', error);
      }

      // El usuario viene en response.data.data.user
const usuario = response?.data?.data?.user || response?.data?.user || response?.user;
       
       // Agregar permisos del token al usuario
       if (decodedToken.permissions && usuario) {
         usuario.permissions = decodedToken.permissions;
       }
       
       // Preservar nombre/apellido del cache anterior si el login no los trae
       const prevCached = localStorage.getItem('user_data');
       let prevUser: User | null = null;
       if (prevCached) {
         try { prevUser = JSON.parse(prevCached); } catch {}
       }
       
       const mergedUser = {
         ...usuario,
         nombre: usuario.nombre ?? prevUser?.nombre,
         apellido: usuario.apellido ?? prevUser?.apellido,
         email: usuario.email ?? prevUser?.email,
         empresa_id: usuario.empresa_id ?? prevUser?.empresa_id,
         rol: usuario.rol ?? prevUser?.rol,
       };
       
       setUser(mergedUser);
       localStorage.setItem('user_data', JSON.stringify(mergedUser));
      setIsAuthenticated(true);
    } else {
      logger.error('No se recibió token en la respuesta');
    }
  };
  const logout = useCallback(() => {
    clearAuthToken();
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  // Auto-logout por inactividad: se cierra la sesión tras 2 minutos sin actividad
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // No cerrar la sesión en páginas públicas (presupuesto, etc.)
        if (isPublicPage(window.location.pathname)) return;
        logger.warn('AuthContext: sesión expirada por inactividad (2 min)');
        logout();
      }, INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, logout]);
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
