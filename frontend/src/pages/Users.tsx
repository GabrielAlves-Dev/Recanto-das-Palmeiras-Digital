import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SearchIcon, UserIcon, PhoneIcon, MailIcon, EyeIcon, EyeOffIcon, UserPlusIcon, ShieldIcon } from 'lucide-react';
const Users: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const users = [{
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@recanto.com',
    phone: '(11) 98765-4321',
    role: 'gerente',
    active: true
  }, {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@recanto.com',
    phone: '(11) 97654-3210',
    role: 'vendedor',
    active: true
  }, {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@recanto.com',
    phone: '(11) 96543-2109',
    role: 'vendedor',
    active: true
  }, {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@recanto.com',
    phone: '(11) 95432-1098',
    role: 'vendedor',
    active: false
  }];
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower) || user.phone.includes(searchQuery);
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
          <input type="text" placeholder="Buscar por nome, email ou telefone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
      </Card>
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
                      <PhoneIcon size={14} className="mr-1" />
                      {user.phone}
                    </div>
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
                      <Button variant={user.active ? 'outline' : 'primary'} size="sm">
                        {user.active ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                      </Button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>;
};
export default Users;