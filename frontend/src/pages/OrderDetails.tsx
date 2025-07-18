import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, UserIcon, PhoneIcon, MailIcon, MapPinIcon, CreditCardIcon, EditIcon, XIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const OrderDetails: React.FC = () => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.cargo?.toLowerCase() ?? 'cliente';

  const {
    id
  } = useParams<{
    id: string;
  }>();

  const order = {
    id,
    date: '12/05/2023',
    status: 'pending',
    customer: {
      name: 'Maria Silva',
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
      }
    },
    items: [{
      id: '1',
      name: 'Arranjo de Rosas',
      price: 70,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1587556930799-8dca6fad6d71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }, {
      id: '2',
      name: 'Buquê Primavera',
      price: 75,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1561181286-d5c88c3490c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }, {
      id: '3',
      name: 'Orquídea Phalaenopsis',
      price: 80,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }],
    payment: {
      method: 'credit',
      status: 'paid'
    },
    notes: 'Entregar no período da tarde, preferencialmente.',
    subtotal: 300,
    shipping: 'A combinar',
    total: 300
  };

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isCustomer = userRole === 'cliente';
  const canEdit = !isCustomer && order.status === 'pending';
  const canCancel = order.status === 'pending' || order.status === 'preparing';

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'preparing':
        return 'Em preparo';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'canceled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/orders" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Pedido #{id}</h1>
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Itens do Pedido">
            <div className="space-y-4">
              {order.items.map(item => <div key={item.id} className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-sm font-medium text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      R$ {item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>)}
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Dados do Cliente">
              <div className="space-y-3">
                <div className="flex items-center">
                  <UserIcon size={16} className="text-emerald-600 mr-2" />
                  <p className="text-gray-800">{order.customer.name}</p>
                </div>
                <div className="flex items-center">
                  <PhoneIcon size={16} className="text-emerald-600 mr-2" />
                  <p className="text-gray-800">{order.customer.phone}</p>
                </div>
                <div className="flex items-center">
                  <MailIcon size={16} className="text-emerald-600 mr-2" />
                  <p className="text-gray-800">{order.customer.email}</p>
                </div>
              </div>
              {!isCustomer && <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link to={`/customers/${order.customer.name}`} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    Ver perfil completo
                  </Link>
                </div>}
            </Card>
            <Card title="Endereço de Entrega">
              <div className="flex items-start">
                <MapPinIcon size={16} className="text-emerald-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-800">
                    {order.customer.address.street},{' '}
                    {order.customer.address.number}
                    {order.customer.address.complement && `, ${order.customer.address.complement}`}
                  </p>
                  <p className="text-gray-600">
                    {order.customer.address.neighborhood}
                  </p>
                  <p className="text-gray-600">
                    {order.customer.address.city} -{' '}
                    {order.customer.address.state},{' '}
                    {order.customer.address.zipCode}
                  </p>
                </div>
              </div>
            </Card>
          </div>
          {order.notes && <Card title="Observações">
              <p className="text-gray-800">{order.notes}</p>
            </Card>}
          {!isCustomer && order.status !== 'canceled' && order.status !== 'delivered' && <Card title="Atualizar Status">
              <div className="flex flex-wrap gap-2">
                <Button variant={order.status === 'pending' ? 'primary' : 'secondary'} disabled={order.status !== 'pending'} size="sm">
                  Pendente
                </Button>
                <Button variant={order.status === 'preparing' ? 'primary' : 'secondary'} disabled={order.status === 'shipped' || order.status === 'delivered' || order.status === 'canceled'} size="sm">
                  Em Preparo
                </Button>
                <Button variant={order.status === 'shipped' ? 'primary' : 'secondary'} disabled={order.status === 'delivered' || order.status === 'canceled'} size="sm">
                  Enviado
                </Button>
                <Button variant={order.status === 'delivered' ? 'primary' : 'secondary'} disabled={order.status === 'canceled'} size="sm">
                  Entregue
                </Button>
              </div>
            </Card>}
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card title="Resumo do Pedido">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Data do Pedido</p>
                <p className="font-medium">{order.date}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">R$ {subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Frete</p>
                <p className="font-medium">{order.shipping}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <p className="text-lg font-medium">Total</p>
                  <p className="text-lg font-semibold">
                    R$ {order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card title="Pagamento">
            <div className="flex items-center">
              <CreditCardIcon size={16} className="text-emerald-600 mr-2" />
              <p className="text-gray-800">
                {order.payment.method === 'credit' && 'Cartão de Crédito'}
                {order.payment.method === 'pix' && 'PIX'}
                {order.payment.method === 'cash' && 'Dinheiro'}
              </p>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.payment.status === 'paid' ? 'bg-green-100 text-green-800' : order.payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {order.payment.status === 'paid' ? 'Pago' : order.payment.status === 'pending' ? 'Pendente' : 'Falhou'}
              </span>
            </div>
          </Card>
          <div className="space-y-2">
            {canEdit && <Button variant="secondary" fullWidth>
                <EditIcon size={16} className="mr-1" />
                Editar Pedido
              </Button>}
            {canCancel && <Button variant="outline" fullWidth>
                <XIcon size={16} className="mr-1" />
                Cancelar Pedido
              </Button>}
          </div>
        </div>
      </div>
    </div>;
};

export default OrderDetails;