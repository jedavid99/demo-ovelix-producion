export interface IPhoneFormData {
  model: string;
  storage: string;
  color: string;
  condition: 'New' | 'Refurbished';
  imei1: string;
  imei2: string;
  serialNumber: string;
  partNumber: string;
  supplier: string;
  purchaseDate: string;
  purchaseCost: string;
  retailPrice: string;
  taxRate: string;
}
