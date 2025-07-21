import api from './api';
import type { Address } from '../types/address.types';

interface OrderItemRequest {
  produtoId: string;
  quantidade: number;
}

interface OrderRequest {
  endereco: Address;
  itens: OrderItemRequest[];
  formaPagamento: string;
  observacoes?: string;
}

interface OrderResponse {
  id: string;
}

const createOrder = (orderData: OrderRequest): Promise<OrderResponse> => {
  return api<OrderResponse>('/pedidos', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

const orderService = {
  createOrder,
};

export default orderService;