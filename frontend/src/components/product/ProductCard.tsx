import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { ShoppingCartIcon, EditIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react';
import cartService from '../../services/cart.service';

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  active: boolean;
  image: string;
}

export interface ProductCardProps {
  product: Product;
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
  onToggleActive?: (productId: string, currentStatus: boolean) => void;
}

const CustomerProductActions: React.FC<{ product: Product, onClickAddToCart: (e: React.MouseEvent<HTMLButtonElement>) => void, isAdded: boolean }> = ({ product, onClickAddToCart, isAdded }) => (
  <Button
    fullWidth
    size="md"
    disabled={product.stock === 0 || isAdded}
    onClick={onClickAddToCart}
  >
    {isAdded ? (
      <span className="flex items-center justify-center">
        <CheckCircleIcon size={18} className="mr-2" />
        Adicionado!
      </span>
    ) : (
      <span className="flex items-center justify-center">
        <ShoppingCartIcon size={18} className="mr-2" />
        {product.stock > 0 ? 'Comprar' : 'Sem Estoque'}
      </span>
    )}
  </Button>
);

const SellerProductActions: React.FC<{ onClickEdit: (e: React.MouseEvent<HTMLButtonElement>) => void }> = ({ onClickEdit }) => (
    <Button variant="secondary" size="sm" fullWidth onClick={onClickEdit}>
      <EditIcon size={14} className="mr-1" />
      Editar
    </Button>
);

const ManagerProductActions: React.FC<{ product: Product, onToggleActive?: (productId: string, currentStatus: boolean) => void, onClickEdit: (e: React.MouseEvent<HTMLButtonElement>) => void }> = ({ product, onToggleActive, onClickEdit }) => (
  <>
    <Button variant="secondary" size="md" fullWidth onClick={onClickEdit}>
        <span className="flex items-center justify-center">
          <EditIcon size={15} className="mr-1" />
          Editar
        </span>
    </Button>
    {onToggleActive && (
      <Button
        variant={product.active ? 'outline' : 'primary'}
        size="sm"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { // Explicitly define type of 'e'
          e.preventDefault();
          e.stopPropagation();
          onToggleActive(product.id, product.active);
        }}
        title={product.active ? "Desativar Produto" : "Ativar Produto"}
      >
        {product.active ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
      </Button>
    )}
  </>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product, userRole, onToggleActive }) => {
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const isManager = userRole === 'gerente';
  const isSeller = userRole === 'vendedor';
  const isCustomer = userRole === 'cliente';

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await cartService.addToCart({ produtoId: product.id, quantidade: 1 });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to add to cart", error);
      // Here you could show an error message to the user
    }
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/edit/${product.id}`);
  };

  return (
    <Link to={`/products/${product.id}`} className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <div className="h-56 overflow-hidden relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        {(isManager || isSeller) && !product.active && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 z-10">
            Inativo
          </div>
        )}
        {(isManager || isSeller) && product.stock === 0 && product.active && (
          <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs px-2 py-1 z-10">
            Sem Estoque
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 truncate" title={product.name}>{product.name}</h3>
        {isCustomer && <p className="text-emerald-600 font-medium mt-1">{product.price}</p>}
        {(isManager || isSeller) && (
          <>
            <div className="flex justify-between mt-1">
              <p className="text-emerald-600 font-medium">{product.price}</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Estoque: {product.stock}
            </p>
          </>
        )}
        <div className="mt-3">
          {isCustomer && <CustomerProductActions product={product} onClickAddToCart={handleAddToCart} isAdded={isAdded} />}
          {isSeller && !isManager && <SellerProductActions onClickEdit={handleEditClick} />}
          {isManager && (
            <div className="flex gap-2">
              <ManagerProductActions
                product={product}
                onToggleActive={onToggleActive}
                onClickEdit={handleEditClick}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};