export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: 'GERENTE' | 'VENDEDOR' | 'CLIENTE';
  ativo: boolean;
}

export type UserRole = 'gerente' | 'vendedor' | 'cliente';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  senha: string;
}


export const mapRole = (backendRole: 'GERENTE' | 'VENDEDOR' | 'CLIENTE'): UserRole | null => {
    if (!backendRole) return null;
    return backendRole.toLowerCase() as UserRole;
}
