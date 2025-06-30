import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon, EyeOffIcon, EditIcon } from 'lucide-react';
interface CustomerDetailsProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
}
const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  userRole
}) => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const customer = {
    id,
    name: 'Maria Silva',
    document: '123.456.789-00',
    phone: '(11) 98765-4321',
    email: 'maria@email.com',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    active: true
  };
  const orderHistory = [{
    id: 'PED-1234',
    date: '12/05/2023',
    total: 'R$ 350,00',
    status: 'Pendente'
  }, {
    id: 'PED-1230',
    date: '10/05/2023',
    total: 'R$ 280,00',
    status: 'Entregue'
  }, {
    id: 'PED-1228',
    date: '05/05/2023',
    total: 'R$ 145,00',
    status: 'Entregue'
  }, {
    id: 'PED-1225',
    date: '28/04/2023',
    total: 'R$ 320,00',
    status: 'Entregue'
  }, {
    id: 'PED-1220',
    date: '15/04/2023',
    total: 'R$ 210,00',
    status: 'Entregue'
  }];
  const isManager = userRole === 'gerente';
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/customers" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Detalhes do Cliente
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
              {orderHistory.map(order => <Link key={order.id} to={`/orders/${order.id}`} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
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
                </Link>)}
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
export default CustomerDetails;