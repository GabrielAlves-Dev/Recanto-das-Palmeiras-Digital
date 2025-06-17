import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from 'lucide-react';
const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState([{
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
  }]);
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => prevItems.map(item => item.id === id ? {
      ...item,
      quantity: newQuantity
    } : item));
  };
  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Meu Carrinho</h1>
      </div>
      {cartItems.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-4">
                {cartItems.map(item => <div key={item.id} className="flex items-center p-4 border border-gray-100 rounded-lg">
                    <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-sm font-medium text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-emerald-600 font-medium">
                        R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-md border border-gray-300 hover:bg-gray-50">
                        <MinusIcon size={14} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-md border border-gray-300 hover:bg-gray-50">
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <div className="ml-4 text-right w-20">
                      <p className="font-medium">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="ml-4 p-1 text-red-500 hover:text-red-700">
                      <TrashIcon size={18} />
                    </button>
                  </div>)}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card title="Resumo do Pedido">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">R$ {subtotal.toFixed(2)}</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <p className="text-lg font-medium">Total</p>
                    <p className="text-lg font-semibold">
                      R$ {subtotal.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    * Frete será calculado na finalização do pedido
                  </p>
                </div>
                <div className="pt-4">
                  <Link to="/checkout">
                    <Button fullWidth>Finalizar Compra</Button>
                  </Link>
                  <Link to="/products">
                    <Button variant="secondary" fullWidth className="mt-2">
                      <ShoppingBagIcon size={16} className="mr-1" />
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div> : <Card>
          <div className="text-center py-12">
            <div className="flex justify-center">
              <ShoppingBagIcon size={64} className="text-gray-300" />
            </div>
            <h2 className="mt-4 text-xl font-medium text-gray-800">
              Seu carrinho está vazio
            </h2>
            <p className="mt-2 text-gray-600">
              Adicione produtos ao seu carrinho para continuar
            </p>
            <div className="mt-6">
              <Link to="/products">
                <Button>
                  <ShoppingBagIcon size={18} className="mr-1" />
                  Ir para o Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </Card>}
    </div>;
};
export default Cart;