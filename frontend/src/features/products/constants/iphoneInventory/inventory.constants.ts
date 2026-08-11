import type { IPhoneFormData } from '../../types/iphoneInventory/inventory.types';

export const COLORS = [
  { name: 'Titanium Black', value: 'Titanium Black', class: 'bg-slate-800' },
  { name: 'Natural Titanium', value: 'Natural Titanium', class: 'bg-slate-200' },
  { name: 'Blue Titanium', value: 'Blue Titanium', class: 'bg-blue-200' },
  { name: 'White Titanium', value: 'White Titanium', class: 'bg-white' },
];

export const MODELS = ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15'];

export const STORAGE_OPTIONS = ['128 GB', '256 GB', '512 GB', '1 TB'];

export const SUPPLIERS = ['Apple Inc. Official', 'Tech Distribution Co.', 'Global Wholesale'];

export const INITIAL_FORM_DATA: IPhoneFormData = {
  model: 'iPhone 15 Pro Max',
  storage: '256 GB',
  color: 'Titanium Black',
  condition: 'New',
  imei1: '',
  imei2: '',
  serialNumber: '',
  partNumber: '',
  supplier: 'Apple Inc. Official',
  purchaseDate: new Date().toISOString().split('T')[0],
  purchaseCost: '',
  retailPrice: '1199.00',
  taxRate: '8.5',
};

export const validateInventory = (formData: IPhoneFormData): Record<string, string> => {
  const newErrors: Record<string, string> = {};
  if (!formData.model) newErrors.model = 'Selecciona un modelo';
  if (!formData.storage) newErrors.storage = 'Selecciona capacidad';
  if (!formData.imei1 || formData.imei1.length < 14) newErrors.imei1 = 'IMEI inválido (15 dígitos)';
  if (!formData.serialNumber) newErrors.serialNumber = 'Número de serie requerido';
  if (!formData.purchaseCost || parseFloat(formData.purchaseCost) <= 0) newErrors.purchaseCost = 'Costo de compra inválido';
  return newErrors;
};

export const calcMargin = (retailPrice: string, purchaseCost: string) => {
  if (!retailPrice || !purchaseCost) return '0.0';
  return (((parseFloat(retailPrice) - parseFloat(purchaseCost)) / parseFloat(retailPrice)) * 100).toFixed(1);
};

export const calcProfit = (retailPrice: string, purchaseCost: string) => {
  if (!retailPrice || !purchaseCost) return '0.00';
  return (parseFloat(retailPrice) - parseFloat(purchaseCost)).toFixed(2);
};
