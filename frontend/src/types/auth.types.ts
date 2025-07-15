export type UserRole = 'gerente' | 'vendedor' | 'cliente';

export interface User {
  id: number | string;
  email: string;
  role: UserRole;
  accessToken: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}