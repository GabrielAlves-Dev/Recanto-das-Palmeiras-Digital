import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
// Input is now used by ProductFilters
import { PlusCircleIcon } from 'lucide-react'; // SearchIcon, FilterIcon, ChevronDownIcon are now used by ProductFilters
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters'; // Import the new component
interface ProductsProps {
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
}
const Products: React.FC<ProductsProps> = ({
  userRole
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
    category: 'arrangements',
    stock: 15,
    active: true,
    image: 'https://images.unsplash.com/photo-1587556930799-8dca6fad6d71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '2',
    name: 'Buquê Primavera',
    price: 'R$ 75,00',
    resellerPrice: 'R$ 60,00',
    category: 'bouquets',
    stock: 8,
    active: true,
    image: 'https://images.unsplash.com/photo-1561181286-d5c88c3490c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '3',
    name: 'Orquídea Phalaenopsis',
    price: 'R$ 80,00',
    resellerPrice: 'R$ 65,00',
    category: 'plants',
    stock: 12,
    active: true,
    image: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '4',
    name: 'Cesta de Flores do Campo',
    price: 'R$ 70,00',
    resellerPrice: 'R$ 55,00',
    category: 'arrangements',
    stock: 5,
    active: true,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '5',
    name: 'Girassóis',
    price: 'R$ 60,00',
    resellerPrice: 'R$ 45,00',
    category: 'bouquets',
    stock: 10,
    active: true,
    image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '6',
    name: 'Vaso de Suculentas',
    price: 'R$ 45,00',
    resellerPrice: 'R$ 35,00',
    category: 'plants',
    stock: 20,
    active: true,
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '7',
    name: 'Kit Presente Especial',
    price: 'R$ 120,00',
    resellerPrice: 'R$ 95,00',
    category: 'gifts',
    stock: 7,
    active: true,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '8',
    name: 'Lírios Brancos',
    price: 'R$ 85,00',
    resellerPrice: 'R$ 70,00',
    category: 'bouquets',
    stock: 0,
    active: false,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }];
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesMinPrice = priceRange.min === '' || parseFloat(product.price.replace('R$ ', '').replace(',', '.')) >= parseFloat(priceRange.min);
    const matchesMaxPrice = priceRange.max === '' || parseFloat(product.price.replace('R$ ', '').replace(',', '.')) <= parseFloat(priceRange.max);
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
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
          selectedCategory={selectedCategory}
          onSelectedCategoryChange={setSelectedCategory}
          categories={categories}
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