export interface Claim {
  id: string;
  type: string;
  date: string;
  status: string;
  center: string;
}

export interface Device {
  id: string;
  saleId: string;
  customer: string;
  email: string;
  model: string;
  imei: string;
  saleDate: string;
  status: 'active' | 'expired' | 'none';
  policyId?: string;
  planType?: string;
  startDate?: string;
  expiryDate?: string;
  claims?: Claim[];
}
