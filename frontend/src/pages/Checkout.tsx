import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, MapPinIcon, CreditCardIcon, CheckIcon } from 'lucide-react';
const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  // Mock data for cart items
  const cartItems = [{
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
  }];
  // Mock data for customer address
  const address = {
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Jardim Primavera',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  };
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, just show a success message and navigate to orders
    alert('Pedido realizado com sucesso!');
    navigate('/orders');
  };
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/cart" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Endereço de Entrega">
            <div className="flex items-start">
              <MapPinIcon size={18} className="text-emerald-600 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-800">
                  {address.street}, {address.number}
                  {address.complement && `, ${address.complement}`}
                </p>
                <p className="text-gray-600">{address.neighborhood}</p>
                <p className="text-gray-600">
                  {address.city} - {address.state}, {address.zipCode}
                </p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Link to="/address-edit" className="text-sm text-emerald-600 hover:text-emerald-700">
                Alterar endereço
              </Link>
            </div>
          </Card>
          <Card title="Forma de Pagamento">
            <form>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input id="credit" name="paymentMethod" type="radio" checked={paymentMethod === 'credit'} onChange={() => setPaymentMethod('credit')} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                  <label htmlFor="credit" className="ml-3 block text-sm font-medium text-gray-700">
                    Cartão de Crédito
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="pix" name="paymentMethod" type="radio" checked={paymentMethod === 'pix'} onChange={() => setPaymentMethod('pix')} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                  <label htmlFor="pix" className="ml-3 block text-sm font-medium text-gray-700">
                    PIX
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="cash" name="paymentMethod" type="radio" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                  <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700">
                    Dinheiro
                  </label>
                </div>
              </div>
            </form>
          </Card>
          <Card title="Observações (opcional)">
            <textarea rows={3} className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm" placeholder="Informações adicionais sobre o pedido ou entrega..." />
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card title="Resumo do Pedido">
            <div className="space-y-4">
              {cartItems.map(item => <div key={item.id} className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}{' '}
                      <span className="text-gray-500">x {item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      R$ {(item.price * item.quantity).toFixed(2)}
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
                <Button fullWidth onClick={handleSubmit}>
                  <CheckIcon size={16} className="mr-1" />
                  Confirmar Pedido
                </Button>
                <Link to="/cart">
                  <Button variant="secondary" fullWidth className="mt-2">
                    Voltar ao Carrinho
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
export default Checkout;