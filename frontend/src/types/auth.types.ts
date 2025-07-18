export type UserRole = 'GERENTE' | 'VENDEDOR' | 'CLIENTE' | null;

export interface User {
  token: string;
  cargo: UserRole;
}

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}