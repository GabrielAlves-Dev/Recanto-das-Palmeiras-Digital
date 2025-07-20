import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SearchIcon, FilterIcon, EyeIcon, ClipboardListIcon, CheckCircleIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Interfaces
interface BackendOrder {
  id: string;
  nomeCliente: string;
  dataPedido: string;
  valorTotal: number;
  status: string;
  itens: any[]; // Simplificado, pode ser mais detalhado se necessário
}

interface Order {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: string;
  items: number;
}


const Orders: React.FC = () => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.cargo?.toLowerCase() ?? 'cliente';
  const isCustomer = userRole === 'cliente';

  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(location.state?.successMessage || null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const statusOptions = [
    { value: 'all', label: 'Todos os Status' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'EM_PREPARO', label: 'Em preparo' },
    { value: 'ENVIADO', label: 'Enviado' },
    { value: 'ENTREGUE', label: 'Entregue' },
    { value: 'CANCELADO', label: 'Cancelado' },
  ];

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = isCustomer ? '/pedidos/meus-pedidos' : '/pedidos';
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('size', '10');
      // Adicionar filtros de busca e status se o backend suportar
      // if (searchQuery) params.append('search', searchQuery);
      // if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await api<{ content: BackendOrder[], totalPages: number, number: number }>(`${endpoint}?${params.toString()}`);
      
      const transformedOrders: Order[] = response.content.map(o => ({
        id: o.id,
        customer: o.nomeCliente,
        date: new Date(o.dataPedido).toLocaleDateString('pt-BR'),
        total: `R$ ${o.valorTotal.toFixed(2)}`,
        status: o.status,
        items: o.itens.length,
      }));

      setOrders(transformedOrders);
      setTotalPages(response.totalPages);
      setCurrentPage(response.number);

    } catch (err: any) {
      console.error("Erro ao buscar pedidos:", err);
      setError(err.message || 'Falha ao carregar pedidos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isCustomer]);


  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-yellow-100 text-yellow-800';
      case 'EM_PREPARO': return 'bg-blue-100 text-blue-800';
      case 'ENVIADO': return 'bg-purple-100 text-purple-800';
      case 'ENTREGUE': return 'bg-green-100 text-green-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  // Filtro local temporário, idealmente seria feito no backend
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <input type="text" placeholder="Buscar por ID do pedido ou cliente..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
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

      {error && <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}

      <Card>
        {isLoading && orders.length === 0 ? <p className="text-center py-12">Carregando pedidos...</p> :
         !isLoading && filteredOrders.length === 0 ? <div className="text-center py-12">
            <ClipboardListIcon size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-800">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca ou realize um novo pedido.</p>
          </div> :
        <div className="overflow-x-auto">
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
                        <div className="text-sm font-medium text-gray-900 truncate" style={{ maxWidth: '120px' }} title={order.id}>
                          #{order.id.substring(0, 8)}...
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 ml-7">
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(order.status)}`}>
                        {getStatusLabel(order.status)}
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
          </div>}
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
export default Orders;