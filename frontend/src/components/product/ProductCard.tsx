import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button'; 
import { ShoppingCartIcon, EditIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  active: boolean;
  image: string;
}

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    stock: number;
    active: boolean;
    image: string;
  };
  userRole: 'gerente' | 'vendedor' | 'cliente' | null;
  onToggleActive?: (productId: string, currentStatus: boolean) => Promise<void>;
}

// Event handler ajustar depois
type OnClickCartHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
type OnClickEditHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;

interface CustomerProductActionsProps {
  product: Product;
  onClickAddToCart: OnClickCartHandler;
}

const CustomerProductActions: React.FC<CustomerProductActionsProps> = ({ product, onClickAddToCart }) => (
  <Button
    fullWidth
    size="sm"
    disabled={!product.active || product.stock === 0}
    onClick={onClickAddToCart}
  >
    {product.active && product.stock > 0 ? (
      <>
        <ShoppingCartIcon size={18} className="mr-1" />
        Comprar
      </>
    ) : (
      <>
        <ShoppingCartIcon size={18} className="mr-1" />
        Sem Estoque
      </>
    )}
</Button>
);

interface SellerProductActionsProps {
  product: Product;
  onClickEdit: OnClickEditHandler;
}

const SellerProductActions: React.FC<SellerProductActionsProps> = ({ product, onClickEdit }) => (
  <Link to={`/products/edit/${product.id}`} className="flex-1" onClick={onClickEdit}>
    <Button variant="secondary" size="sm" fullWidth>
      <EditIcon size={14} className="mr-1" />
      Editar
    </Button>
  </Link>
);

interface ManagerProductActionsProps {
  product: Product;
  onClickEdit: OnClickEditHandler; // funcionalidade editar é separada?
  onToggleActive?: (productId: string, currentStatus: boolean) => Promise<void>; 
}

const ManagerProductActions: React.FC<ManagerProductActionsProps> = ({ product, onClickEdit, onToggleActive }) => (
  <>
    <Link to={`/products/edit/${product.id}`} className="flex-1" onClick={onClickEdit}>
      <Button variant="secondary" size="sm" fullWidth>
        <EditIcon size={14} className="mr-1" />
        Editar
      </Button>
    </Link>
    {onToggleActive && ( 
      <Button
        variant={product.active ? 'outline' : 'primary'}
        size="sm"
        onClick={(e) => {
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
  const isManager = userRole === 'gerente';
  const isSeller = userRole === 'vendedor';
  const isCustomer = userRole === 'cliente';

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log(`Add to cart: ${product.name}`);
    // logica de adcionar ao carrinho
  };

  const handleEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    console.log(`Edit: ${product.name}`);
    // logica
  };

  return (
    <Link to={`/products/${product.id}`} className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <div className="h-40 overflow-hidden relative">
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
          {isCustomer && <CustomerProductActions product={product} onClickAddToCart={handleAddToCart} />}
          {isSeller && !isManager && <SellerProductActions product={product} onClickEdit={handleEdit} />}
          {isManager && (
            <div className="flex gap-2">
              <ManagerProductActions
                product={product}
                onClickEdit={handleEdit}
                onToggleActive={onToggleActive} // Pass the actual prop
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
