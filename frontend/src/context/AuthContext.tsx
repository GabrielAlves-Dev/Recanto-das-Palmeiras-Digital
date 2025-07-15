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

  // 👇 A MUDANÇA ESTÁ NESTA FUNÇÃO 👇
  const login = async (email: string, password: string) => {
    // 1. Chama o serviço de autenticação para fazer o login real no backend
    const user = await authService.login(email, password);

    // 2. LÓGICA ADICIONADA: Sobrescreve o papel (role) do usuário com base no e-mail
    if (email.toLowerCase() === 'gerente@gmail.com') {
      user.role = 'gerente';
    } else if (email.toLowerCase() === 'vendedor@gmail.com') {
      user.role = 'vendedor';
    } else {
      user.role = 'cliente';
    }

    // 3. Atualiza o estado da aplicação com o usuário MODIFICADO
    setCurrentUser(user);
    
    // 4. IMPORTANTE: Garante que o usuário MODIFICADO seja salvo no localStorage também,
    // sobrescrevendo o que foi salvo originalmente pelo authService.
    localStorage.setItem('user', JSON.stringify(user));
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