import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon, EyeOffIcon, EditIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Adicionando a interface para o cliente
interface Customer {
    id: string;
    name: string;
    document: string;
    phone: string;
    email: string;
    address: {
        street: string;
        number: string;
        complement: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    active: boolean;
    orderHistory: any[];
}

interface BackendCustomerData {
    id: string;
    nome: string;
    cpfCnpj: string;
    telefone: string;
    email: string;
    ativo: boolean;
}


interface CustomerDetailsProps {
    customer?: Customer;
    isOwnProfile?: boolean;
}


const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer: customerProp, isOwnProfile = false }) => {
  const { currentUser, logout } = useAuth();
  const userRole = currentUser?.cargo?.toLowerCase() ?? 'cliente';
  const navigate = useNavigate();
  const { id } = useParams<{ id: string; }>();
  const [customer, setCustomer] = useState(customerProp);
  const [error, setError] = useState<string | null>(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);


  // Se não for o perfil próprio, busca os dados do cliente
  React.useEffect(() => {
    if (!isOwnProfile && id) {
      const fetchCustomerData = async () => {
        try {
          // Specify the expected type for the api call
          const data = await api<BackendCustomerData>(`/clientes/${id}`);
          setCustomer({
            id: data.id,
            name: data.nome,
            document: data.cpfCnpj,
            phone: data.telefone,
            email: data.email,
            address: { // Mocked address for now
                street: 'Rua das Flores',
                number: '123',
                complement: 'Apto 45',
                neighborhood: 'Jardim Primavera',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01234-567'
            },
            active: data.ativo,
            orderHistory: [], // Mocked order history
          });
        } catch (err) {
          setError("Falha ao carregar dados do cliente.");
        }
      };
      fetchCustomerData();
    } else {
        setCustomer(customerProp)
    }
  }, [id, isOwnProfile, customerProp]);

  const handleDeactivate = async () => {
    setError(null);
    try {
      await api('/clientes/me/desativar', { method: 'PATCH' });
      setShowDeactivateModal(false);
      logout();
      navigate('/login', { state: { successMessage: 'Sua conta foi desativada.' } });
    } catch (err: any) {
      setError(err.message || 'Não foi possível desativar a conta. Verifique se há pedidos pendentes.');
      setShowDeactivateModal(false);
    }
  };

  const isManager = userRole === 'gerente';

  if (!customer) {
    return <div className="text-center p-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
        {error && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                {error}
            </div>
        )}
      <div className="flex items-center gap-4">
        {!isOwnProfile && (
            <Link to="/customers" className="text-emerald-600 hover:text-emerald-700">
                <ArrowLeftIcon size={20} />
            </Link>
        )}
        <h1 className="text-2xl font-bold text-gray-800">
          {isOwnProfile ? 'Meu Perfil' : 'Detalhes do Cliente'}
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <UserIcon size={40} className="text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {customer.name}
              </h2>
              <p className="text-sm text-gray-500">{customer.document}</p>
              <div className="w-full mt-6 space-y-2">
                <div className="flex items-center text-gray-600">
                  <PhoneIcon size={16} className="mr-2" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <MailIcon size={16} className="mr-2" />
                  {customer.email}
                </div>
              </div>
              <div className="mt-6 w-full">
                <div className="flex justify-between">
                  {isOwnProfile ? (
                    <>
                        <Link to={`/my-profile/edit`}>
                            <Button variant="secondary">
                            <EditIcon size={16} className="mr-1" />
                            Editar Dados
                            </Button>
                        </Link>
                        <Button variant="danger" onClick={() => setShowDeactivateModal(true)}>
                            <EyeOffIcon size={16} className="mr-1" />
                            Desativar Conta
                        </Button>
                    </>
                  ) : (
                    <>
                        <Link to={`/customers/edit/${customer.id}`}>
                            <Button variant="secondary">
                            <EditIcon size={16} className="mr-1" />
                            Editar Dados
                            </Button>
                        </Link>
                        {isManager && <Button variant="outline">
                            <EyeOffIcon size={16} className="mr-1" />
                            Desativar
                        </Button>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card title="Endereço">
            <div className="flex items-start">
              <MapPinIcon size={18} className="text-emerald-600 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-800">
                  {customer.address.street}, {customer.address.number}
                  {customer.address.complement && `, ${customer.address.complement}`}
                </p>
                <p className="text-gray-600">{customer.address.neighborhood}</p>
                <p className="text-gray-600">
                  {customer.address.city} - {customer.address.state},{' '}
                  {customer.address.zipCode}
                </p>
              </div>
            </div>
          </Card>
          <Card title="Histórico de Compras">
            <div className="space-y-4">
              {customer.orderHistory.length > 0 ? customer.orderHistory.map(order => <Link key={order.id} to={`/orders/${order.id}`} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <p className={`text-sm ${order.status === 'Pendente' ? 'text-yellow-600' : order.status === 'Em preparo' ? 'text-blue-600' : order.status === 'Enviado' ? 'text-purple-600' : 'text-green-600'}`}>
                      {order.status}
                    </p>
                  </div>
                </Link>) : (
                    <p className="text-center text-gray-500 py-4">Nenhum histórico de compras.</p>
                )}
            </div>
          </Card>
        </div>
      </div>
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card title="Confirmar Desativação" className="w-full max-w-md">
                <p className="text-gray-600 mb-6">
                    Tem certeza que deseja desativar sua conta? Esta ação é irreversível e você perderá o acesso ao sistema.
                </p>
                <div className="flex justify-end space-x-4">
                    <Button variant="secondary" onClick={() => setShowDeactivateModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeactivate}>
                        Confirmar Desativação
                    </Button>
                </div>
            </Card>
        </div>
      )}
    </div>
  );
};
export default CustomerDetails;