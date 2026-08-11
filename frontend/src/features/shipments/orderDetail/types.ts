export type OrderStatus = 'Pendiente' | 'Enviada' | 'Recibida' | 'Cancelada';

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  provider: string;
  issueDate: Date;
  deliveryDate: Date;
  actualDeliveryDate?: Date;
  total: number;
  status: OrderStatus;
  notes?: string;
}

export interface StatusChange {
  status: string;
  date: Date;
  notes?: string;
}
