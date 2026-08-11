export interface ServiceOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  device: string;
  status: string;
  total: number;
  date?: string;
}

export interface SendOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (order: ServiceOrder) => void;
  availableOrders: ServiceOrder[];
  loading?: boolean;
  error?: string | null;
}
