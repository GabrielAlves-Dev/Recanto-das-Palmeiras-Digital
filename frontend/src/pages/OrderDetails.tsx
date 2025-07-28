import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, UserIcon, PhoneIcon, MailIcon, CreditCardIcon, EditIcon, XIcon } from 'lucide-react'; // Removed MapPinIcon
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Address } from '../types/address.types';

// Interfaces
interface OrderItem {
  id: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

interface Customer {
    id: string;
    nome: string;
    email: string;
    telefone: string;
}

interface Seller {
    id: string;
    nome: string;
    email: string;
}

interface Order {
  id: string;
  cliente: Customer | null;
  vendedor: Seller | null;
  endereco: Address | null;
  dataPedido: string;
  valorTotal: number;
  status: string;
  itens: OrderItem[];
  formaPagamento: string;
  observacoes: string;
}

const OrderDetails: React.FC = () => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.cargo?.toLowerCase() ?? 'cliente';
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api<Order>(`/pedidos/${id}`);
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar os detalhes do pedido.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    try {
      await api(`/pedidos/${id}/status?status=${newStatus}`, { method: 'PATCH' });
      fetchOrderDetails();
    } catch (err: any) {
      setError(err.message || 'Falha ao atualizar o status do pedido.');
    }
  };

  const isCustomer = userRole === 'cliente';

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'Pendente';
      case 'EM_PREPARO': return 'Em Preparo';
      case 'ENVIADO': return 'Enviado';
      case 'ENTREGUE': return 'Entregue';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Carregando detalhes do pedido...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-10 text-gray-500">Pedido não encontrado.</div>;
  }

  const canEdit = !isCustomer && order.status === 'PENDENTE';
  const canCancel = order.status === 'PENDENTE' || order.status === 'EM_PREPARO';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/orders" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Pedido #{order.id.substring(0, 8)}...</h1>
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Itens do Pedido">
            <div className="space-y-4">
              {order.itens.map(item => (
                <div key={item.id} className="flex items-center p-4 border border-gray-100 rounded-lg">
                  <div className="ml-4 flex-grow">
                    <h3 className="text-sm font-medium text-gray-800">
                      {item.nomeProduto}
                    </h3>
                    <p className="text-sm text-gray-600">
                      R$ {item.precoUnitario.toFixed(2)} x {item.quantidade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Dados do Cliente">
              <div className="space-y-3">
                <div className="flex items-center">
                  <UserIcon size={16} className="text-emerald-600 mr-2" />
                  <p className="text-gray-800">{order.cliente?.nome ?? 'N/A'}</p>
                </div>
                <div className="flex items-center">
                  <MailIcon size={16} className="text-emerald-600 mr-2" />
                  <p className="text-gray-800">{order.cliente?.email ?? 'N/A'}</p>
                </div>
                <div className="flex items-center">
                  <PhoneIcon size={16} className="text-emerald-600 mr-2" />
                  <p className="text-gray-800">{order.cliente?.telefone ?? 'N/A'}</p>
                </div>
              </div>
            </Card>
            <Card title="Endereço de Entrega">
              {order.endereco ? (
                <div className="space-y-1">
                  <p>{order.endereco.rua}, {order.endereco.numero}</p>
                  {order.endereco.complemento && <p>{order.endereco.complemento}</p>}
                  <p>{order.endereco.bairro}</p>
                  <p>{order.endereco.cidade} - {order.endereco.uf}</p>
                  <p>{order.endereco.cep}</p>
                </div>
              ) : <p>Endereço não informado.</p>}
            </Card>
          </div>
          {order.observacoes && <Card title="Observações">
              <p className="text-gray-800">{order.observacoes}</p>
            </Card>}
          {!isCustomer && order.status !== 'CANCELADO' && order.status !== 'ENTREGUE' && (
            <Card title="Atualizar Status">
              <div className="flex flex-wrap gap-2">
                <Button variant={order.status === 'PENDENTE' ? 'primary' : 'secondary'} onClick={() => handleUpdateStatus('PENDENTE')} size="sm">
                  Pendente
                </Button>
                <Button variant={order.status === 'EM_PREPARO' ? 'primary' : 'secondary'} onClick={() => handleUpdateStatus('EM_PREPARO')} size="sm">
                  Em Preparo
                </Button>
                <Button variant={order.status === 'ENVIADO' ? 'primary' : 'secondary'} onClick={() => handleUpdateStatus('ENVIADO')} size="sm">
                  Enviado
                </Button>
                <Button variant={order.status === 'ENTREGUE' ? 'primary' : 'secondary'} onClick={() => handleUpdateStatus('ENTREGUE')} size="sm">
                  Entregue
                </Button>
              </div>
            </Card>
          )}
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card title="Resumo do Pedido">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Data do Pedido</p>
                <p className="font-medium">{new Date(order.dataPedido).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">R$ {order.valorTotal.toFixed(2)}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <p className="text-lg font-medium">Total</p>
                  <p className="text-lg font-semibold">
                    R$ {order.valorTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card title="Pagamento">
            <div className="flex items-center">
              <CreditCardIcon size={16} className="text-emerald-600 mr-2" />
              <p className="text-gray-800">
                {order.formaPagamento}
              </p>
            </div>
          </Card>
          <div className="space-y-2">
            {canEdit && <Button variant="secondary" fullWidth>
                <EditIcon size={16} className="mr-1" />
                Editar Pedido
              </Button>}
            {canCancel && <Button variant="outline" fullWidth onClick={() => handleUpdateStatus('CANCELADO')}>
                <XIcon size={16} className="mr-1" />
                Cancelar Pedido
              </Button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;