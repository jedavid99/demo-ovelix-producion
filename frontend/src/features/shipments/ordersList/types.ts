export type OrderStatus = 'Pendiente' | 'Enviada' | 'Recibida' | 'Cancelada';

export interface Order {
  id: string;
  orderNumber: string;
  provider: string;
  issueDate: Date;
  deliveryDate: Date;
  total: number;
  status: OrderStatus;
  notes?: string;
}
