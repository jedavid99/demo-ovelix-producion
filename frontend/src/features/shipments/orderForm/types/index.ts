export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Provider {
  id: string;
  name: string;
  phone: string;
}

export interface Product {
  id: string;
  name: string;
  suggestedPrice: number;
}
