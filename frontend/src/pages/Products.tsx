import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircleIcon, ArrowLeft, ArrowRight } from 'lucide-react';
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

interface FilterValues {
    searchQuery: string;
    priceRange: {
        min: string;
        max: string;
    };
}

const formatPrice = (price: number): string => {
  return `R$ ${price.toFixed(2).replace('.', ',')}`;
};

interface ProductsProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
}

const Products: React.FC<ProductsProps> = ({ userRole }) => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activationError, setActivationError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterValues>({
    searchQuery: '',
    priceRange: { min: '', max: '' }
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('size', '8'); 
      if (filters.searchQuery) {
        params.append('nome', filters.searchQuery);
      }
      if (filters.priceRange.min) {
        params.append('minPreco', filters.priceRange.min);
      }
      if (filters.priceRange.max) {
        params.append('maxPreco', filters.priceRange.max);
      }
      if (userRole === 'cliente') {
        params.append('ativo', 'true');
      }

      const response = await axios.get<{ content: BackendProduct[], totalPages: number, number: number }>(`/api/produtos?${params.toString()}`);
      
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
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);

    } catch (err) {
      console.error("Error fetching products:", err);
      setError('Falha ao carregar produtos. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters, userRole]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilter = (newFilters: FilterValues) => {
    setCurrentPage(0);
    setFilters(newFilters);
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    setActivationError(null);
    try {
        await axios.patch(`/api/produtos/${productId}?ativo=${!currentStatus}`);
        fetchProducts();
    } catch (err) {
        console.error("Erro ao alterar status do produto:", err);
        if (axios.isAxiosError(err) && err.response) {
            const errorData = err.response.data;
            const message = errorData.messages?.join(' ') || `Falha ao alterar status do produto.`;
            setActivationError(message);
        } else {
            setActivationError(`Falha ao alterar status do produto ID ${productId}. Tente novamente.`);
        }
    }
  };

  const isManager = userRole === 'gerente';
  const isCustomer = userRole === 'cliente';

  if (isLoading && productsData.length === 0) {
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
        <ProductFilters onFilter={handleFilter} />
      </Card>

      {isLoading && <div className="text-center py-5">Atualizando...</div>}

      {!isLoading && productsData.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Nenhum produto encontrado.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productsData.map(product => (
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
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
            <Button 
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 0 || isLoading}
                className="!p-2"
                title="Página Anterior"
            >
                <ArrowLeft size={16} />
            </Button>
            <span className="font-medium text-gray-700 text-sm">
                Página {currentPage + 1} de {totalPages}
            </span>
            <Button 
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={currentPage >= totalPages - 1 || isLoading}
                className="!p-2"
                title="Próxima Página"
            >
                <ArrowRight size={16} />
            </Button>
        </div>
      )}
    </div>
  );
};

export default Products;