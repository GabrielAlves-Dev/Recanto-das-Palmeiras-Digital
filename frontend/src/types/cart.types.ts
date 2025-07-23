export interface CartItem {
  produtoId: string;
  nomeProduto: string;
  imagemUrl: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  estoque: number;
}

export interface CartItemRequest {
  produtoId: string;
  quantidade: number;
}
