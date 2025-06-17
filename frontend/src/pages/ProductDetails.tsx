import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeftIcon, ShoppingCartIcon, MinusIcon, PlusIcon, TagIcon, PackageIcon, TruckIcon } from 'lucide-react';
const ProductDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [quantity, setQuantity] = useState(1);
  // Mock produtos
  const product = {
    id,
    name: 'Arranjo de Rosas',
    price: 70.0,
    description: 'Composto por rosas frescas e cuidadosamente selecionadas, este arranjo é a personificação da elegância e do sentimento. Cada flor é disposta de forma harmoniosa para criar um impacto visual deslumbrante, tornando-o o presente ideal para celebrar aniversários, expressar amor e gratidão, ou simplesmente para levar um toque de sofisticação e beleza natural a qualquer ambiente. Permita que a beleza atemporal das rosas transmita sua mensagem mais sincera.',
    stock: 15,
    image: '',
    details: ['Contém 12 rosas vermelhas', 'Folhagens decorativas', 'Vaso de vidro incluso', 'Altura aproximada: 40cm', 'Cartão para mensagem incluso']
  };
  
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
              </div>
              <div className="pt-5 border-t border-gray-100">
                <p className="text-gray-600">{product.description}</p>
              </div>
              <div className="pt-5 border-t border-gray-100">
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
    </div>;
};
export default ProductDetails;