import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import authService from '../services/auth.service';
import type { User, AuthContextType } from '../types/auth.types';
import api from '../services/api';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          // Fetch user details to get the name
          const endpoint = user.cargo === 'CLIENTE' ? '/clientes/me' : '/usuarios/me';
          const profile = await api<{ nome: string }>(endpoint);
          setCurrentUser({ ...user, nome: profile.nome });
        }
      } catch (error) {
        console.error("Falha ao carregar usuário:", error);
        // If fetching profile fails, logout the user
        authService.logout();
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    // After login, fetch profile to get name and set the full user object
    const endpoint = user.cargo === 'CLIENTE' ? '/clientes/me' : '/usuarios/me';
    const profile = await api<{ nome: string }>(endpoint);
    setCurrentUser({ ...user, nome: profile.nome });
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