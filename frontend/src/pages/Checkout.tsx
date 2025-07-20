import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeftIcon, MapPinIcon, CheckIcon, ShoppingBagIcon } from 'lucide-react';
import cartService from '../services/cart.service';
import orderService from '../services/order.service';
import api from '../services/api';
import type { CartItem } from '../types/cart.types';

interface CustomerProfile {
    nome: string;
    telefone: string;
    email: string;
}

interface Address {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');
  const [observations, setObservations] = useState('');
  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [items, profile] = await Promise.all([
        cartService.getCart(),
        api<CustomerProfile>('/clientes/me')
      ]);
      
      if (items.length === 0) {
        navigate('/cart');
        return;
      }

      setCartItems(items);
      setCustomer(profile);
    } catch (err: any) {
      setError(err.message || "Falha ao carregar os dados para o checkout.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Formata o endereço para inclusão nas observações
    const addressString = `
      Endereço de Entrega:
      Rua: ${address.street}, Nº: ${address.number} ${address.complement ? `, Compl: ${address.complement}` : ''}
      Bairro: ${address.neighborhood}
      Cidade: ${address.city} - ${address.state}
      CEP: ${address.zipCode}
    `;
    const finalObservations = `${addressString}\n\nObservações do cliente:\n${observations}`;

    try {
      await orderService.createOrder({
        itens: cartItems.map(item => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
        })),
        formaPagamento: paymentMethod,
        observacoes: finalObservations,
      });

      await cartService.clearCart();
      navigate('/orders', { state: { successMessage: 'Pedido realizado com sucesso!' } });
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao finalizar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div className="text-center p-8">Carregando checkout...</div>;
  }
  
  if (error && !isSubmitting) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/cart" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Endereço de Entrega">
            <div className="flex items-center mb-4">
                <MapPinIcon size={18} className="text-emerald-600 mr-2" />
                <p className="text-gray-800 font-medium">Preencha as informações para entrega</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Input label="Rua" id="street" name="street" value={address.street} onChange={handleAddressChange} required />
                </div>
                <Input label="Número" id="number" name="number" value={address.number} onChange={handleAddressChange} required />
                <Input label="Complemento" id="complement" name="complement" value={address.complement} onChange={handleAddressChange} />
                <Input label="Bairro" id="neighborhood" name="neighborhood" value={address.neighborhood} onChange={handleAddressChange} required />
                <Input label="Cidade" id="city" name="city" value={address.city} onChange={handleAddressChange} required />
                <Input label="Estado (UF)" id="state" name="state" value={address.state} onChange={handleAddressChange} required maxLength={2} />
                <Input label="CEP" id="zipCode" name="zipCode" value={address.zipCode} onChange={handleAddressChange} required mask="00000-000" />
            </div>
          </Card>
          <Card title="Forma de Pagamento">
            <div className="space-y-4">
              <div className="flex items-center">
                <input id="credit" name="paymentMethod" type="radio" checked={paymentMethod === 'Cartão de Crédito'} onChange={() => setPaymentMethod('Cartão de Crédito')} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                <label htmlFor="credit" className="ml-3 block text-sm font-medium text-gray-700">
                  Cartão de Crédito
                </label>
              </div>
              <div className="flex items-center">
                <input id="pix" name="paymentMethod" type="radio" checked={paymentMethod === 'PIX'} onChange={() => setPaymentMethod('PIX')} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                <label htmlFor="pix" className="ml-3 block text-sm font-medium text-gray-700">
                  PIX
                </label>
              </div>
              <div className="flex items-center">
                <input id="cash" name="paymentMethod" type="radio" checked={paymentMethod === 'Dinheiro'} onChange={() => setPaymentMethod('Dinheiro')} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                  Dinheiro
                </label>
              </div>
            </div>
          </Card>
          <Card title="Observações Adicionais (opcional)">
            <textarea 
              rows={3} 
              className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm" 
              placeholder="Ex: Ponto de referência, etc."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card title="Resumo do Pedido">
            <div className="space-y-4">
              {cartItems.map(item => <div key={item.produtoId} className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
                    <img src={item.imagemUrl} alt={item.nomeProduto} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium text-gray-800">
                      {item.nomeProduto}{' '}
                      <span className="text-gray-500">x {item.quantidade}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>)}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">R$ {subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-gray-600">Frete</p>
                  <p className="font-medium">A combinar</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <p className="text-lg font-medium">Total</p>
                  <p className="text-lg font-semibold">
                    R$ {subtotal.toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  * Frete será combinado com o vendedor
                </p>
              </div>
              <div className="pt-4">
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <Button type="submit" fullWidth disabled={isSubmitting}>
                  <CheckIcon size={16} className="mr-1" />
                  {isSubmitting ? 'Finalizando...' : 'Confirmar Pedido'}
                </Button>
                <Link to="/cart">
                  <Button variant="secondary" fullWidth disabled={isSubmitting}>
                    Voltar ao Carrinho
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>;
};

export default Checkout;