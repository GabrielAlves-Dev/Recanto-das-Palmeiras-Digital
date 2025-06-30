import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SearchIcon, UserIcon, PhoneIcon, MailIcon, EyeIcon, EyeOffIcon, UserPlusIcon } from 'lucide-react';
interface CustomersProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
}
const Customers: React.FC<CustomersProps> = ({
  userRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const customers = [{
    id: '1',
    name: 'Maria Silva',
    phone: '(11) 98765-4321',
    email: 'maria@email.com',
    active: true
  }, {
    id: '2',
    name: 'João Santos',
    phone: '(11) 91234-5678',
    email: 'joao@email.com',
    active: true
  }, {
    id: '3',
    name: 'Ana Oliveira',
    phone: '(11) 99876-5432',
    email: 'ana@email.com',
    active: true
  }, {
    id: '4',
    name: 'Carlos Lima',
    phone: '(11) 95555-4444',
    email: 'carlos@email.com',
    active: true
  }, {
    id: '5',
    name: 'Fernanda Costa',
    phone: '(11) 93333-2222',
    email: 'fernanda@email.com',
    active: false
  }, {
    id: '6',
    name: 'Roberto Almeida',
    phone: '(11) 92222-1111',
    email: 'roberto@email.com',
    active: true
  }, {
    id: '7',
    name: 'Juliana Ferreira',
    phone: '(11) 94444-3333',
    email: 'juliana@email.com',
    active: true
  }, {
    id: '8',
    name: 'Pedro Souza',
    phone: '(11) 96666-7777',
    email: 'pedro@email.com',
    active: false
  }];
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    return customer.name.toLowerCase().includes(searchLower) || customer.phone.includes(searchQuery) || customer.email.toLowerCase().includes(searchLower);
  });
  const isManager = userRole === 'gerente';
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Clientes</h1>
        <Link to="/register">
          <Button>
            <UserPlusIcon size={18} className="mr-1" />
            Novo Cliente
          </Button>
        </Link>
      </div>
      <Card>
        <div className="relative">
          <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input type="text" placeholder="Buscar por nome, telefone ou e-mail..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
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
              {filteredCustomers.map(customer => <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <UserIcon size={20} className="text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center">
                      <PhoneIcon size={14} className="mr-1" />
                      {customer.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MailIcon size={14} className="mr-1" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {customer.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/customers/${customer.id}`}>
                        <Button variant="secondary" size="sm">
                          Ver Detalhes
                        </Button>
                      </Link>
                      {isManager && <Button variant={customer.active ? 'outline' : 'primary'} size="sm">
                          {customer.active ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                        </Button>}
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>;
};
export default Customers;