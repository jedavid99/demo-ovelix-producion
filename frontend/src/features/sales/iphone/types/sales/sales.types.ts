export interface CartItem {
  id: string;
  model: string;
  price: number;
  storage: string;
  color: string;
  quantity: number;
  insurance?: string;
}

export interface IPhoneProduct {
  id: string;
  name: string;
  model: string;
  price: number;
  storage: string;
  color: string;
  stock: 'in' | 'low' | 'out';
  quantity?: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  price: number;
  features?: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  icon: React.ElementType;
}
