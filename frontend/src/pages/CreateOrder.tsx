import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeftIcon, SearchIcon, UserPlusIcon, PlusIcon, MinusIcon, TrashIcon, SaveIcon } from 'lucide-react';
const CreateOrder: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showProductResults, setShowProductResults] = useState(false);
  const [orderItems, setOrderItems] = useState<Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>>([]);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  // Mock data for customers
  const customers = [{
    id: '1',
    name: 'Maria Silva',
    phone: '(11) 98765-4321',
    email: 'maria@email.com'
  }, {
    id: '2',
    name: 'João Santos',
    phone: '(11) 91234-5678',
    email: 'joao@email.com'
  }, {
    id: '3',
    name: 'Ana Oliveira',
    phone: '(11) 99876-5432',
    email: 'ana@email.com'
  }];
  // Mock data for products
  const products = [{
    id: '1',
    name: 'Arranjo de Rosas',
    price: 70,
    image: 'https://images.unsplash.com/photo-1587556930799-8dca6fad6d71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '2',
    name: 'Buquê Primavera',
    price: 75,
    image: 'https://images.unsplash.com/photo-1561181286-d5c88c3490c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '3',
    name: 'Orquídea Phalaenopsis',
    price: 80,
    image: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }];
  const filteredCustomers = customers.filter(customer => customer.name.toLowerCase().includes(customerSearch.toLowerCase()) || customer.phone.includes(customerSearch) || customer.email.toLowerCase().includes(customerSearch.toLowerCase()));
  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(productSearch.toLowerCase()));
  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomer(customerId);
    setShowCustomerResults(false);
  };
  const handleAddProduct = (product: {
    id: string;
    name: string;
    price: number;
    image: string;
  }) => {
    const existingItemIndex = orderItems.findIndex(item => item.id === product.id);
    if (existingItemIndex >= 0) {
      // Update quantity if product already in order
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      // Add new product to order
      setOrderItems([...orderItems, {
        ...product,
        quantity: 1
      }]);
    }
    setProductSearch('');
    setShowProductResults(false);
  };
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setOrderItems(prevItems => prevItems.map(item => item.id === id ? {
      ...item,
      quantity: newQuantity
    } : item));
  };
  const removeItem = (id: string) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, just navigate to orders
    alert('Pedido criado com sucesso!');
    navigate('/orders');
  };
  const getSelectedCustomer = () => {
    return customers.find(customer => customer.id === selectedCustomer);
  };
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/orders" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Novo Pedido Manual</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Selecionar Cliente">
            {selectedCustomer ? <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    {getSelectedCustomer()?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getSelectedCustomer()?.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getSelectedCustomer()?.email}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setSelectedCustomer(null)}>
                  Alterar
                </Button>
              </div> : <div>
                <div className="relative">
                  <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input type="text" placeholder="Buscar cliente por nome, telefone ou e-mail..." value={customerSearch} onChange={e => {
                setCustomerSearch(e.target.value);
                setShowCustomerResults(true);
              }} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                {showCustomerResults && customerSearch && <div className="mt-2 border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto">
                    {filteredCustomers.length > 0 ? filteredCustomers.map(customer => <div key={customer.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" onClick={() => handleCustomerSelect(customer.id)}>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-600">
                            {customer.phone}
                          </p>
                        </div>) : <div className="p-3 text-center text-gray-500">
                        Nenhum cliente encontrado
                      </div>}
                  </div>}
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">ou</p>
                  <Link to="/register">
                    <Button variant="secondary" size="sm">
                      <UserPlusIcon size={16} className="mr-1" />
                      Novo Cliente
                    </Button>
                  </Link>
                </div>
              </div>}
          </Card>
          <Card title="Adicionar Produtos">
            <div className="relative">
              <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input type="text" placeholder="Buscar produto por nome..." value={productSearch} onChange={e => {
              setProductSearch(e.target.value);
              setShowProductResults(true);
            }} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            {showProductResults && productSearch && <div className="mt-2 border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto">
                {filteredProducts.length > 0 ? filteredProducts.map(product => <div key={product.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex justify-between items-center" onClick={() => handleAddProduct(product)}>
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-emerald-600">
                            R$ {product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm">
                        <PlusIcon size={16} />
                      </Button>
                    </div>) : <div className="p-3 text-center text-gray-500">
                    Nenhum produto encontrado
                  </div>}
              </div>}
            {orderItems.length > 0 && <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Produtos no Pedido
                </h3>
                <div className="space-y-3">
                  {orderItems.map(item => <div key={item.id} className="flex items-center p-3 border border-gray-100 rounded-lg">
                      <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-3 flex-grow">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-emerald-600">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-md border border-gray-300 hover:bg-gray-50">
                          <MinusIcon size={14} />
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-md border border-gray-300 hover:bg-gray-50">
                          <PlusIcon size={14} />
                        </button>
                      </div>
                      <div className="ml-4 text-right w-20">
                        <p className="text-sm font-medium">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="ml-4 p-1 text-red-500 hover:text-red-700">
                        <TrashIcon size={16} />
                      </button>
                    </div>)}
                </div>
              </div>}
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
              </div>
              <div className="pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forma de Pagamento
                  </label>
                  <div className="space-y-2">
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea rows={3} className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 block w-full text-sm" placeholder="Informações adicionais sobre o pedido..." />
                </div>
              </div>
              <div className="pt-4">
                <Button fullWidth onClick={handleSubmit} disabled={!selectedCustomer || orderItems.length === 0}>
                  <SaveIcon size={16} className="mr-1" />
                  Salvar Pedido
                </Button>
                <Link to="/orders">
                  <Button variant="secondary" fullWidth className="mt-2">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
export default CreateOrder;