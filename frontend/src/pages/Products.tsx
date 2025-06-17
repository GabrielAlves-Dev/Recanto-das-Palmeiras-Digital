import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PlusCircleIcon } from 'lucide-react'; 
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters'; 
interface ProductsProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
}
const Products: React.FC<ProductsProps> = ({
  userRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const categories = [{
    id: 'all',
    name: 'Todas'
  }, {
    id: 'bouquets',
    name: 'Buquês'
  }, {
    id: 'arrangements',
    name: 'Arranjos'
  }, {
    id: 'plants',
    name: 'Plantas'
  }, {
    id: 'gifts',
    name: 'Presentes'
  }];
  const products = [{
    id: '1',
    name: 'Arranjo de Rosas',
    price: 'R$ 70,00',
    resellerPrice: 'R$ 55,00',
    stock: 15,
    active: true,
    image: ''
  }, {
    id: '2',
    name: 'Buquê Primavera',
    price: 'R$ 75,00',
    resellerPrice: 'R$ 60,00',
    stock: 8,
    active: true,
    image: ''
  }, {
    id: '3',
    name: 'Orquídea Phalaenopsis',
    price: 'R$ 80,00',
    resellerPrice: 'R$ 65,00',
    stock: 12,
    active: true,
    image: ''
  }, {
    id: '4',
    name: 'Cesta de Flores do Campo',
    price: 'R$ 70,00',
    resellerPrice: 'R$ 55,00',
    stock: 5,
    active: true,
    image: ''
  }, {
    id: '5',
    name: 'Girassóis',
    price: 'R$ 60,00',
    resellerPrice: 'R$ 45,00',
    stock: 10,
    active: true,
    image: ''
  }, {
    id: '6',
    name: 'Vaso de Suculentas',
    price: 'R$ 45,00',
    resellerPrice: 'R$ 35,00',
    stock: 20,
    active: true,
    image: ''
  }, {
    id: '7',
    name: 'Kit Presente Especial',
    price: 'R$ 120,00',
    resellerPrice: 'R$ 95,00',
    stock: 7,
    active: true,
    image: ''
  }, {
    id: '8',
    name: 'Lírios Brancos',
    price: 'R$ 85,00',
    resellerPrice: 'R$ 70,00',
    stock: 0,
    active: false,
    image: ''
  }];
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMinPrice = priceRange.min === '' || parseFloat(product.price.replace('R$ ', '').replace(',', '.')) >= parseFloat(priceRange.min);
    const matchesMaxPrice = priceRange.max === '' || parseFloat(product.price.replace('R$ ', '').replace(',', '.')) <= parseFloat(priceRange.max);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });
  const isManager = userRole === 'gerente';
  const isSeller = userRole === 'vendedor';
  const isCustomer = userRole === 'cliente';
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isCustomer ? 'Catálogo de Produtos' : 'Gerenciar Produtos'}
        </h1>
        {isManager && <Link to="/products/new">
            <Button>
              <PlusCircleIcon size={18} className="mr-1" />
              Novo Produto
            </Button>
          </Link>}
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => <ProductCard key={product.id} product={product} userRole={userRole} />)}
      </div>
    </div>;
};
export default Products;