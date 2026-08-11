import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginService, getMe } from '../services/auth.service';
import { clearAuthToken } from '../services/api';
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
  rol?: string;
  permissions?: string[];
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
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('user_data');
    return cached ? JSON.parse(cached) : null;
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
      
      if (token) {
        try {
          const currentUser = await getMe();
          
          // Decodificar el token para obtener los permisos
          let decodedToken: DecodedToken = {};
          try {
            decodedToken = jwtDecode<DecodedToken>(token);
            logger.log('Token decodificado en initAuth:', decodedToken);
          } catch (error) {
            logger.error('Error al decodificar token en initAuth:', error);
          }
          
          // Agregar permisos del token al usuario
          if (decodedToken.permissions && currentUser) {
            currentUser.permissions = decodedToken.permissions;
          }
          
          setUser(currentUser);
          localStorage.setItem('user_data', JSON.stringify(currentUser));
          setIsAuthenticated(true);
        } catch (error) {
          logger.error('Error al obtener usuario en initAuth:', error);
          const cached = localStorage.getItem('user_data');
          if (cached) {
            setUser(JSON.parse(cached));
            setIsAuthenticated(true);
          } else {
            clearAuthToken();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        localStorage.removeItem('user_data');
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    initAuth();
  }, []);
  const login = async (email: string, password: string, codigoEmpresa: string) => {
    logger.log('AuthContext.login llamado con:', { email, codigoEmpresa });
    const response = await loginService(email, password, codigoEmpresa);
    logger.log('Respuesta completa del login:', response);

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
        logger.log('Token decodificado:', decodedToken);
      } catch (error) {
        logger.error('Error al decodificar token:', error);
      }

      // El usuario viene en response.data.data.user
      const usuario = response?.data?.data?.user || response?.data?.user || response?.user;
      logger.log('Usuario obtenido de la respuesta:', usuario);
      
      // Agregar permisos del token al usuario
      if (decodedToken.permissions && usuario) {
        usuario.permissions = decodedToken.permissions;
      }
      
      setUser(usuario);
      localStorage.setItem('user_data', JSON.stringify(usuario));
      setIsAuthenticated(true);
    } else {
      logger.error('No se recibió token en la respuesta');
      logger.error('Estructura completa de response:', JSON.stringify(response, null, 2));
    }
  };
  const logout = useCallback(() => {
    logger.log('AuthContext.logout: Limpiando tokens y estado local');
    clearAuthToken();
    localStorage.removeItem('user_data');
    setUser(null);
    setIsAuthenticated(false);
    logger.log('AuthContext.logout: Redirigiendo a /login');
    window.location.href = '/login';
  }, []);

  // Auto-logout por inactividad: se cierra la sesión tras 2 minutos sin actividad
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
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
