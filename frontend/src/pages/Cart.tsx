// src/pages/Cart.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from 'lucide-react';
import cartService from '../services/cart.service';
import type { CartItem } from '../types/cart.types';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCartItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await cartService.getCart();
      setCartItems(items);
    } catch (err: unknown) { // Explicitly catch as unknown
      setError(`Falha ao carregar o carrinho: ${(err as Error).message || 'erro desconhecido'}`); // Type assertion
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleUpdateQuantity = async (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      await cartService.updateCartItem(productId, { produtoId: productId, quantidade: newQuantity });
      fetchCartItems(); // Re-fetch to ensure consistency
    } catch (err: unknown) { // Explicitly catch as unknown
      setError(`Falha ao atualizar a quantidade: ${(err as Error).message || 'estoque insuficiente'}`); // Type assertion
      console.error(err);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await cartService.removeFromCart(productId);
      fetchCartItems();
    } catch (err) {
      setError("Falha ao remover o item.");
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.precoUnitario * item.quantidade, 0);

  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Meu Carrinho</h1>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {isLoading ? <p>Carregando carrinho...</p> :
      cartItems.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-4">
                {cartItems.map(item => <div key={item.produtoId} className="flex items-center p-4 border border-gray-100 rounded-lg">
                    <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                      <img src={item.imagemUrl} alt={item.nomeProduto} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-sm font-medium text-gray-800">
                        {item.nomeProduto}
                      </h3>
                      <p className="text-emerald-600 font-medium">
                        R$ {item.precoUnitario.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleUpdateQuantity(item.produtoId, item.quantidade, -1)} className="p-1 rounded-md border border-gray-300 hover:bg-gray-50">
                        <MinusIcon size={14} />
                      </button>
                      <span className="w-8 text-center">{item.quantidade}</span>
                      <button onClick={() => handleUpdateQuantity(item.produtoId, item.quantidade, 1)} className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={item.quantidade >= item.estoque}>
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <div className="ml-4 text-right w-20">
                      <p className="font-medium">
                        R$ {item.subtotal.toFixed(2)}
                      </p>
                    </div>
                    <button onClick={() => handleRemoveItem(item.produtoId)} className="ml-4 p-1 text-red-500 hover:text-red-700">
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
                    <Button variant="secondary" fullWidth>
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