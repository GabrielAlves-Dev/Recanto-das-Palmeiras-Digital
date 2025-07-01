import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SearchIcon, FilterIcon, EyeIcon, ClipboardListIcon, CheckCircleIcon } from 'lucide-react';

interface OrdersProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
}

const Orders: React.FC<OrdersProps> = ({
  userRole
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(location.state?.successMessage || null);
  
  const statusOptions = [{
    value: 'all',
    label: 'Todos os Status'
  }, {
    value: 'pending',
    label: 'Pendente'
  }, {
    value: 'preparing',
    label: 'Em preparo'
  }, {
    value: 'shipped',
    label: 'Enviado'
  }, {
    value: 'delivered',
    label: 'Entregue'
  }, {
    value: 'canceled',
    label: 'Cancelado'
  }];
  
  const orders = [{
    id: 'PED-1234',
    customer: 'Maria Silva',
    date: '12/05/2023',
    total: 'R$ 350,00',
    status: 'pending',
    items: 3
  }, {
    id: 'PED-1233',
    customer: 'João Santos',
    date: '11/05/2023',
    total: 'R$ 520,00',
    status: 'preparing',
    items: 5
  }, {
    id: 'PED-1232',
    customer: 'Ana Oliveira',
    date: '10/05/2023',
    total: 'R$ 175,00',
    status: 'shipped',
    items: 2
  }, {
    id: 'PED-1231',
    customer: 'Carlos Lima',
    date: '09/05/2023',
    total: 'R$ 420,00',
    status: 'delivered',
    items: 4
  }, {
    id: 'PED-1230',
    customer: 'Fernanda Costa',
    date: '08/05/2023',
    total: 'R$ 280,00',
    status: 'delivered',
    items: 3
  }, {
    id: 'PED-1229',
    customer: 'Roberto Almeida',
    date: '07/05/2023',
    total: 'R$ 150,00',
    status: 'canceled',
    items: 1
  }, {
    id: 'PED-1228',
    customer: 'Juliana Ferreira',
    date: '05/05/2023',
    total: 'R$ 145,00',
    status: 'delivered',
    items: 2
  }, {
    id: 'PED-1225',
    customer: 'Pedro Souza',
    date: '28/04/2023',
    status: 'delivered',
    total: 'R$ 320,00',
    items: 3
  }];
  
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000); // Mensagem some após 5 segundos
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const isCustomer = userRole === 'cliente';

  return <div className="space-y-6">
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md flex items-center">
          <CheckCircleIcon className="mr-2" size={20} />
          {successMessage}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isCustomer ? 'Meus Pedidos' : 'Gerenciar Pedidos'}
        </h1>
        {!isCustomer && <Link to="/create-order">
            <Button>Novo Pedido</Button>
          </Link>}
      </div>
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Buscar por número do pedido ou cliente..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500">
              {statusOptions.map(option => <option key={option.value} value={option.value}>
                  {option.label}
                </option>)}
            </select>
            <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon size={18} className="mr-1" />
              Mais Filtros
            </Button>
          </div>
        </div>
        {showFilters && <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <input type="date" className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <input type="date" className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm" />
              </div>
            </div>
          </div>}
      </Card>
      <Card>
        {filteredOrders.length > 0 ? <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  {!isCustomer && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
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
                {filteredOrders.map(order => <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ClipboardListIcon size={18} className="text-emerald-600 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {order.id}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items} itens
                      </div>
                    </td>
                    {!isCustomer && <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.customer}
                        </div>
                      </td>}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.total}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'preparing' ? 'bg-blue-100 text-blue-800' : order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {order.status === 'pending' ? 'Pendente' : order.status === 'preparing' ? 'Em preparo' : order.status === 'shipped' ? 'Enviado' : order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="secondary" size="sm">
                          <EyeIcon size={14} className="mr-1" />
                          Detalhes
                        </Button>
                      </Link>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div className="text-center py-12">
            <ClipboardListIcon size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-800">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </div>}
      </Card>
    </div>;
};
export default Orders;