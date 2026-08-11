import type { InsuranceFormData } from '../../types/iphoneInsurance/insurance.types';

export const MODELS = [
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
  'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
];

export const PROVIDERS = ['AppleCare+', 'Asurion', 'SquareTrade', 'Seguros Atlas', 'Seguros Sura', 'Otro'];

export const COVERAGE_TYPES = [
  { value: 'screen', label: 'Pantalla', description: 'Rotura de pantalla' },
  { value: 'theft', label: 'Robo', description: 'Robo del dispositivo' },
  { value: 'full', label: 'Completo', description: 'Daños y robo' },
  { value: 'custom', label: 'Personalizado', description: 'Cobertura a medida' },
];

export const INITIAL_FORM_DATA: InsuranceFormData = {
  imei: '',
  serialNumber: '',
  model: '',
  insuranceProvider: '',
  policyNumber: '',
  coverageType: 'full',
  startDate: '',
  endDate: '',
  premium: '',
  deductible: '',
  coverageAmount: '',
  notes: '',
};

export const validateInsurance = (formData: InsuranceFormData): Record<string, string> => {
  const newErrors: Record<string, string> = {};
  if (!formData.imei || formData.imei.length < 14) newErrors.imei = 'IMEI inválido (15 dígitos)';
  if (!formData.serialNumber) newErrors.serialNumber = 'Número de serie requerido';
  if (!formData.model) newErrors.model = 'Selecciona un modelo';
  if (!formData.insuranceProvider) newErrors.insuranceProvider = 'Proveedor requerido';
  if (!formData.policyNumber) newErrors.policyNumber = 'Número de póliza requerido';
  if (!formData.startDate) newErrors.startDate = 'Fecha de inicio requerida';
  if (!formData.endDate) newErrors.endDate = 'Fecha de fin requerida';
  if (!formData.premium || parseFloat(formData.premium) <= 0) newErrors.premium = 'Prima inválida';
  return newErrors;
};

export const calculateDuration = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return '—';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  if (years > 0) return `${years} año(s)`;
  if (months > 0) return `${months} mes(es)`;
  return `${diffDays} días`;
};

export const INITIAL_ERRORS: Record<string, string> = {};
