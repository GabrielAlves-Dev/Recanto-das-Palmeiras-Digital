import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { type User, type UserRole, mapRole, type LoginCredentials, type RegisterData } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const { data } = await axios.get<User>('/api/usuarios/me');
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
        logout(); // Token is invalid or expired
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials) => {
    const { data } = await axios.post<{ token: string }>('/api/auth/login', credentials);
    const newToken = data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    await fetchUser();
  };

  const register = async (registerData: RegisterData) => {
    await axios.post('/api/clientes/auto-cadastro', registerData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    isAuthenticated: !!token && !!user,
    user,
    role: user ? mapRole(user.cargo) : null,
    token,
    isLoading,
    login,
    register,
    logout,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
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
