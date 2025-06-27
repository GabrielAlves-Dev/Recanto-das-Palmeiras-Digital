import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircleIcon } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import axios from 'axios';

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
  originalPrice: number;
  displayPrice: string;
  stock: number;
  active: boolean;
  image: string;
}

const formatPrice = (price: number): string => {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

interface ProductsProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
}

const Products: React.FC<ProductsProps> = ({ userRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activationError, setActivationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<{ content: BackendProduct[] }>('/api/produtos');
        const transformedProducts: Product[] = response.data.content.map(
          (p: BackendProduct): Product => ({
            id: String(p.id),
            name: p.nome,
            originalPrice: p.preco,
            displayPrice: formatPrice(p.preco),
            stock: p.quantidade,
            active: p.ativo,
            image: p.imagem || '/placeholder-image.jpg',
          })
        );
        setProductsData(transformedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Falha ao carregar produtos. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMinPrice = priceRange.min === '' || product.originalPrice >= parseFloat(priceRange.min);
    const matchesMaxPrice = priceRange.max === '' || product.originalPrice <= parseFloat(priceRange.max);
    const matchesActivity = userRole !== 'cliente' || product.active;
    return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesActivity;
  });

  const isManager = userRole === 'gerente';
  const isCustomer = userRole === 'cliente';

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    setActivationError(null);
    try {
      await axios.patch(`/api/produtos/${productId}?ativo=${!currentStatus}`);
      setProductsData(prevProducts =>
        prevProducts.map(p =>
          p.id === productId ? { ...p, active: !currentStatus } : p
        )
      );
    } catch (err) {
      console.error("Error toggling product status:", err);
      setActivationError(`Falha ao alterar status do produto ID ${productId}. Tente novamente.`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isCustomer ? 'Catálogo de Produtos' : 'Gerenciar Produtos'}
        </h1>
        {isManager && (
          <Link to="/products/new">
            <Button>
              <PlusCircleIcon size={18} className="mr-1" />
              Novo Produto
            </Button>
          </Link>
        )}
      </div>

      {activationError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
          {activationError}
        </div>
      )}

      <Card>
        <ProductFilters
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          showFilters={showFilters}
          onToggleShowFilters={() => setShowFilters(!showFilters)}
        />
      </Card>

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-10 text-gray-500">
          Nenhum produto encontrado.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              name: product.name,
              price: product.displayPrice,
              stock: product.stock,
              active: product.active,
              image: product.image,
            }}
            userRole={userRole}
            onToggleActive={isManager ? handleToggleActive : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;