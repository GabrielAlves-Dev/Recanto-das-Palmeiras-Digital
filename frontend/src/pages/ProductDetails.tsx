import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, ShoppingCartIcon, HeartIcon, ShareIcon, MinusIcon, PlusIcon, TagIcon, PackageIcon, TruckIcon } from 'lucide-react';
const ProductDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [quantity, setQuantity] = useState(1);
  // Mock product data - in a real app, this would come from an API
  const product = {
    id,
    name: 'Arranjo de Rosas',
    price: 70.0,
    description: 'Lindo arranjo com uma dúzia de rosas vermelhas, perfeito para presentear em ocasiões especiais. As rosas são cuidadosamente selecionadas e arranjadas com folhagens decorativas.',
    category: 'arrangements',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1587556930799-8dca6fad6d71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    details: ['Contém 12 rosas vermelhas', 'Folhagens decorativas', 'Vaso de vidro incluso', 'Altura aproximada: 40cm', 'Cartão para mensagem incluso']
  };
  // Mock related products
  const relatedProducts = [{
    id: '2',
    name: 'Buquê Primavera',
    price: 75.0,
    image: 'https://images.unsplash.com/photo-1561181286-d5c88c3490c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '3',
    name: 'Orquídea Phalaenopsis',
    price: 80.0,
    image: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }, {
    id: '4',
    name: 'Cesta de Flores do Campo',
    price: 70.0,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }];
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-emerald-600 hover:text-emerald-700">
          <ArrowLeftIcon size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-lg font-medium text-emerald-600 mt-1">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-emerald-600 rounded-full hover:bg-gray-100">
                    <HeartIcon size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 rounded-full hover:bg-gray-100">
                    <ShareIcon size={20} />
                  </button>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-gray-600">{product.description}</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-medium text-gray-800 mb-2">
                  Detalhes do Produto
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, index) => <li key={index} className="flex items-center text-gray-600">
                      <TagIcon size={16} className="mr-2 text-emerald-600" />
                      {detail}
                    </li>)}
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <PackageIcon size={20} className="text-emerald-600 mr-2" />
                    <span className="text-gray-600">
                      Estoque disponível: {product.stock} unidades
                    </span>
                  </div>
                  <div className="flex items-center">
                    <TruckIcon size={20} className="text-emerald-600 mr-2" />
                    <span className="text-gray-600">Frete a calcular</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={() => updateQuantity(quantity - 1)} className="p-2 hover:bg-gray-50" disabled={quantity <= 1}>
                      <MinusIcon size={16} />
                    </button>
                    <span className="px-4 py-2 text-gray-800">{quantity}</span>
                    <button onClick={() => updateQuantity(quantity + 1)} className="p-2 hover:bg-gray-50" disabled={quantity >= product.stock}>
                      <PlusIcon size={16} />
                    </button>
                  </div>
                  <Button className="flex-1">
                    <ShoppingCartIcon size={18} className="mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          Produtos Relacionados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map(product => <Link key={product.id} to={`/products/${product.id}`}>
              <Card className="h-full transition-transform hover:-translate-y-1">
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <p className="text-emerald-600 font-medium mt-1">
                  R$ {product.price.toFixed(2)}
                </p>
              </Card>
            </Link>)}
        </div>
      </div>
    </div>;
};
export default ProductDetails;