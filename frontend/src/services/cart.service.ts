import api from './api';
import type { CartItem, CartItemRequest } from '../types/cart.types';

const getCart = (): Promise<CartItem[]> => {
  return api<CartItem[]>('/carrinho');
};

const addToCart = (item: CartItemRequest): Promise<CartItem> => {
  return api<CartItem>('/carrinho/items', {
    method: 'POST',
    body: JSON.stringify(item),
  });
};

const updateCartItem = (productId: string, item: CartItemRequest): Promise<CartItem> => {
  return api<CartItem>(`/carrinho/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  });
};

const removeFromCart = (productId: string): Promise<void> => {
  return api<void>(`/carrinho/items/${productId}`, {
    method: 'DELETE',
  });
};

const clearCart = (): Promise<void> => {
    return api<void>('/carrinho', {
        method: 'DELETE',
    });
};

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

export default cartService;
