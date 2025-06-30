import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SearchIcon, UserIcon, PhoneIcon, MailIcon, EyeIcon, EyeOffIcon, UserPlusIcon, ShieldIcon } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SearchIcon, UserIcon, MailIcon, EyeIcon, EyeOffIcon, UserPlusIcon, ShieldIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';

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
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

      const response = await axios.get<{ content: BackendUser[], totalPages: number, number: number }>(`/api/usuarios?${params.toString()}`);
      
      const transformedUsers: User[] = response.data.content.map(u => ({
        id: u.id,
        name: u.nome,
        email: u.email,
        role: u.cargo,
        active: u.ativo,
      }));

      setUsers(transformedUsers);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);

    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError('Falha ao carregar usuários. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/usuarios/${userId}?ativo=${!currentStatus}`);
      fetchUsers(); // Recarrega a lista
    } catch (err) {
      console.error("Erro ao alterar status do usuário:", err);
      setError('Falha ao alterar status do usuário.');
    }
  };

  // Filtro local enquanto a busca de backend não é implementada
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return user.name.toLowerCase().includes(searchLower) || 
           user.email.toLowerCase().includes(searchLower);
  });
  return <div className="space-y-6">
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
      <Card>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-10">Carregando usuários...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhum usuário encontrado.</div>
          ) : (
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
          )}
        </div>
      </Card>
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
            <Button 
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 0 || isLoading}
                className="!p-2"
                title="Página Anterior"
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
                className="!p-2"
                title="Próxima Página"
            >
                <ArrowRight size={16} />
            </Button>
        </div>
      )}
    </div>;
};
export default Users;