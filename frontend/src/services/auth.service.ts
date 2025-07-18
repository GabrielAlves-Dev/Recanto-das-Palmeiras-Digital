import customFetch from './api';
import type { User } from '../types/auth.types';

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr) as User;
  }
  return null;
};

const login = async (email: string, senha: string): Promise<User> => {
  const user = await customFetch<User>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });

  if (user && user.token) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  return user;
};

const logout = (): void => {
  localStorage.removeItem('user');
};


const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;