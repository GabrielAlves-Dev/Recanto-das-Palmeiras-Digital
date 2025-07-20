import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, ShoppingCartIcon, MinusIcon, PlusIcon, PackageIcon, TruckIcon, EditIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import cartService from '../services/cart.service';

interface BackendProduct {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  imagem: string | null;
  ativo: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  active: boolean;
}

const ProductDetails: React.FC = () => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.cargo?.toLowerCase() ?? 'cliente';

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const fetchProductDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const backendData = await api<BackendProduct>(`/produtos/${id}`);
      setProductData({
        id: String(backendData.id),
        name: backendData.nome,
        price: backendData.preco,
        description: backendData.descricao,
        stock: backendData.quantidade,
        image: backendData.imagem || '/placeholder-image.jpg',
        active: backendData.ativo,
      });
    } catch (err: any) {
      console.error(`Erro ao carregar detalhes do produto de ID ${id}:`, err);
      setError(err.message || 'Produto não encontrado ou falha ao carregar.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleToggleActive = async () => {
    if (!productData) return;
    setActionError(null);
    try {
      await api(`/produtos/${productData.id}/status?ativo=${!productData.active}`, { method: 'PATCH' });
      await fetchProductDetails(); // Re-fetch to get updated data
    } catch (err: any) {
      console.error("Erro ao alterar status do produto:", err);
      setActionError(err.message || `Falha ao alterar status do produto ID ${productData.id}. Tente novamente.`);
    }
  };

  const updateQuantity = (newQuantity: number) => {
    if (productData && newQuantity >= 1 && newQuantity <= productData.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!productData) return;
    try {
      await cartService.addToCart({ produtoId: productData.id, quantidade: quantity });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to add to cart", error);
      setActionError("Falha ao adicionar o produto ao carrinho.");
    }
  };

  const isManager = userRole === 'gerente';
  const isSeller = userRole === 'vendedor';

  if (isLoading) {
    return <div className="text-center py-10">Carregando detalhes do produto...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!productData) {
    return <div className="text-center py-10 text-gray-500">Produto não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{productData.name}</h1>
        {(isManager || isSeller) && !productData.active && (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Inativo
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img src={productData.image} alt={productData.name} className="w-full h-full object-cover" />
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{productData.name}</h2>
                  <p className="text-lg font-medium text-emerald-600 mt-1">
                    R$ {productData.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="pt-5 border-t border-gray-100">
                <p className="text-gray-600">{productData.description}</p>
              </div>
              <div className="pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <PackageIcon size={20} className="text-emerald-600 mr-2" />
                    <span className="text-gray-600">
                      Estoque disponível: {productData.stock} unidades
                    </span>
                  </div>
                  <div className="flex items-center">
                    <TruckIcon size={20} className="text-emerald-600 mr-2" />
                    <span className="text-gray-600">Frete a calcular</span>
                  </div>
                </div>

                {actionError && (
                  <p className="text-red-500 text-sm mt-2 text-center">{actionError}</p>
                )}

                {userRole === 'cliente' ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(quantity - 1)} className="p-2 hover:bg-gray-50" disabled={quantity <= 1 || !productData.active || productData.stock === 0}>
                        <MinusIcon size={16} />
                      </button>
                      <span className="px-4 py-2 text-gray-800">{quantity}</span>
                      <button onClick={() => updateQuantity(quantity + 1)} className="p-2 hover:bg-gray-50" disabled={quantity >= productData.stock || !productData.active || productData.stock === 0}>
                        <PlusIcon size={16} />
                      </button>
                    </div>
                    <Button className="flex-1" disabled={!productData.active || productData.stock === 0 || isAdded} onClick={handleAddToCart}>
                      {isAdded ? (
                        <span className="flex items-center justify-center">
                          <CheckCircleIcon size={18} className="mr-2" />
                          Adicionado!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <ShoppingCartIcon size={18} className="mr-2" />
                          {productData.active && productData.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                        </span>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" fullWidth onClick={() => navigate(`/products/edit/${id}`)}>
                      <span className="flex items-center justify-center">
                        <EditIcon size={18} className="mr-1" />
                        Editar
                      </span>
                    </Button>
                    {isManager && (
                      <Button
                        variant={productData.active ? 'outline' : 'primary'}
                        size="md"
                        onClick={handleToggleActive}
                        title={productData.active ? "Desativar Produto" : "Ativar Produto"}
                      >
                        {productData.active ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                      </Button>
                    )}
                  </div>
                )}

                {!productData.active && (
                  <p className="text-red-500 text-sm mt-2 text-center">Este produto não está disponível para clientes.</p>
                )}
                  {productData.active && productData.stock === 0 && (
                  <p className="text-yellow-500 text-sm mt-2 text-center">Produto sem estoque.</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;