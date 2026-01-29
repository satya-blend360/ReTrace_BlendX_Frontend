import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  authLoaded: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('token_data');
    localStorage.removeItem('token_expires_at');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userInfo = localStorage.getItem('user_info');

    if (authStatus === 'true' && userInfo) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userInfo));
    }
    setAuthLoaded(true);

    // Intercept fetch to handle 401 Unauthorized globally
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (response.status === 401) {
        // Check if this is not a login/refresh endpoint
        const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : args[0].toString();
        if (!url.includes('/auth/login') && !url.includes('/auth/refresh') && !url.includes('/auth/callback')) {
          console.warn('Unauthorized request detected, logging out...');
          logout();
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);

    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, authLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};