import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { UserIcon, PhoneIcon, MailIcon, EyeIcon, EyeOffIcon, UserPlusIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BackendCustomer {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  ativo: boolean;
}

interface Customer {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  ativo: boolean;
}

const Customers: React.FC = () => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.cargo?.toLowerCase() ?? 'cliente';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('size', '10');

      const response = await api<{ content: BackendCustomer[], totalPages: number, number: number }>(
        `/clientes?${params.toString()}`
      );
      
      const { content, totalPages: newTotalPages, number: newCurrentPage } = response;

      const transformedCustomers: Customer[] = content.map(c => ({
        id: c.id,
        nome: c.nome,
        telefone: c.telefone,
        email: c.email,
        ativo: c.ativo,
      }));

      setCustomers(transformedCustomers);
      setTotalPages(newTotalPages);
      setCurrentPage(newCurrentPage);

    } catch (err: any) {
      console.error("Erro ao buscar clientes:", err);
      setError(err.message || 'Falha ao carregar clientes. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleToggleActive = async (customer: Customer) => {
    const action = customer.ativo ? 'desativar' : 'ativar';
    setActionError(null);
    try {
      await api(`/clientes/${customer.id}/${action}`, { method: 'PATCH' });
      fetchCustomers();
    } catch (err: any) {
      console.error(`Erro ao ${action} cliente:`, err);
      setActionError(err.message || `Falha ao ${action} o cliente. Tente novamente.`);
    }
  };

  const isManager = userRole === 'gerente';

  if (isLoading && customers.length === 0) {
    return <div className="text-center p-8">Carregando clientes...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Clientes</h1>
        <Link to="/register">
          <Button>
            <UserPlusIcon size={18} className="mr-1" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {actionError}
        </div>
      )}
      
      {isLoading && <div className="text-center py-4">Atualizando...</div>}
      
      {!isLoading && customers.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            Nenhum cliente encontrado.
          </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <UserIcon size={20} className="text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.nome}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center"><PhoneIcon size={14} className="mr-1" />{customer.telefone}</div>
                    <div className="text-sm text-gray-500 flex items-center"><MailIcon size={14} className="mr-1" />{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {customer.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/customers/${customer.id}`}>
                        <Button variant="secondary" size="sm">Ver Detalhes</Button>
                      </Link>
                      {isManager && (
                        <Button 
                          variant={customer.ativo ? 'outline' : 'primary'} 
                          size="sm" 
                          onClick={() => handleToggleActive(customer)}
                        >
                          {customer.ativo ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
    </div>
  );
};

export default Customers;