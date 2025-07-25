import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SearchIcon, UserIcon, MailIcon, EyeIcon, EyeOffIcon, UserPlusIcon, ShieldIcon, ArrowLeft, ArrowRight, CheckCircleIcon } from 'lucide-react';
import api from '../services/api';

// Interfaces
interface BackendUser {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ativo: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

const Users: React.FC = () => {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(location.state?.successMessage || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('size', '10');
      // Implementar busca no backend se necessário
      // if (searchQuery) params.append('search', searchQuery);

      const response = await api<{ content: BackendUser[], totalPages: number, number: number }>(`/usuarios?${params.toString()}`);
      
      const transformedUsers: User[] = response.content.map(u => ({
        id: u.id,
        name: u.nome,
        email: u.email,
        role: u.cargo,
        active: u.ativo,
      }));

      setUsers(transformedUsers);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);

    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err);
      setError(err.message || 'Falha ao carregar usuários. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000); // Mensagem some após 5 segundos
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    setActionError(null);
    try {
      await api(`/usuarios/${userId}?ativo=${!currentStatus}`, { method: 'PATCH' });
      fetchUsers(); // Recarrega a lista
    } catch (err: any) {
      console.error("Erro ao alterar status do usuário:", err);
      setActionError(err.message || 'Falha ao alterar status do usuário.');
    }
  };

  // Filtro local enquanto a busca de backend não é implementada
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return user.name.toLowerCase().includes(searchLower) || 
           user.email.toLowerCase().includes(searchLower);
  });
  
  if (isLoading && users.length === 0) {
    return <div className="text-center py-10">Carregando usuários...</div>;
  }

  return <div className="space-y-6">
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md flex items-center">
          <CheckCircleIcon className="mr-2" size={20} />
          {successMessage}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h1>
        <Link to="/users/new">
          <Button>
            <UserPlusIcon size={18} className="mr-1" />
            Novo Usuário
          </Button>
        </Link>
      </div>
      <Card>
        <div className="relative">
          <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input type="text" placeholder="Buscar por nome ou email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
      </Card>

      {actionError && (
        <div className="my-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {actionError}
        </div>
      )}

      {error && (
        <div className="my-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {error}
        </div>
      )}

      {isLoading && <div className="text-center py-5">Atualizando...</div>}

      {!isLoading && filteredUsers.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Nenhum usuário encontrado.
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <UserIcon size={20} className="text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center">
                      <MailIcon size={14} className="mr-1" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <ShieldIcon size={14} className="mr-1 text-emerald-600" />
                      {user.role === 'gerente' ? 'Gerente' : 'Vendedor'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/users/edit/${user.id}`}>
                        <Button variant="secondary" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <Button variant={user.active ? 'outline' : 'primary'} size="sm" onClick={() => handleToggleActive(user.id, user.active)}>
                        {user.active ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                      </Button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
            <Button 
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 0 || isLoading}
            >
                <ArrowLeft size={16} />
            </Button>
            <span className="font-medium text-gray-700 text-sm">
                Página {currentPage + 1} de {totalPages}
            </span>
            <Button 
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={currentPage >= totalPages - 1 || isLoading}
            >
                <ArrowRight size={16} />
            </Button>
        </div>
      )}
    </div>;
};
export default Users;