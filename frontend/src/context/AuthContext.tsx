import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import authService from '../services/auth.service';
import type { User, AuthContextType } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Falha ao carregar usuário:", error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    currentUser,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};