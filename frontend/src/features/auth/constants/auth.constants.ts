import { Company, StepItem, CompanyData, UserData, SubscriptionPlanKey, SubscriptionPlan } from '../types/auth.types';

export const EXISTING_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'TechFix S.A.',
    address: 'Calle Principal 123',
    phone: '+34 600 123 456',
    email: 'info@techfix.com',
    codigoEmpresa: 'TF-2024',
  },
  {
    id: '2',
    name: 'Reparaciones Express',
    address: 'Avenida Central 456',
    phone: '+34 600 789 012',
    email: 'contacto@reparaciones.com',
    codigoEmpresa: 'RE-2024',
  },
  {
    id: '3',
    name: 'Taller Pro',
    address: 'Calle Industria 789',
    phone: '+34 600 345 678',
    email: 'info@tallerpro.com',
    codigoEmpresa: 'TP-2024',
  },
];

export const STEP_VARIANTS = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.95,
  }),
};

export const STEPS_HAS_COMPANY: StepItem[] = [
  { number: 1, label: 'Solicitar' },
  { number: 2, label: 'Activación' },
  { number: 3, label: 'Usuario' },
  { number: 4, label: 'Confirmación' },
];

export const STEPS_NEW_COMPANY: StepItem[] = [
  { number: 1, label: 'Solicitar' },
  { number: 2, label: 'Activación' },
  { number: 3, label: 'Empresa' },
  { number: 4, label: 'Usuario' },
  { number: 5, label: 'Confirmación' },
];

export const WHATSAPP_REQUEST_URL =
  'https://wa.me/1234567890?text=Hola,%20me%20gustaría%20solicitar%20un%20código%20de%20activación%20para%20registrarme%20en%20ovelix';

export const USER_ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'recepcionista', label: 'Recepcionista' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'contador', label: 'Contador' },
  { value: 'otro', label: 'Otro' },
];

export const INITIAL_COMPANY_DATA: CompanyData = {
  razonSocial: '',
  nombreFantasia: '',
  address: '',
  googleMapsLink: '',
  phone: '',
  email: '',
  cuit: '',
  owner: '',
  paymentMethod: '',
  workshopType: '',
  nif: '',
  codigoEmpresa: '',
};

export const INITIAL_USER_DATA: UserData = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  codigoEmpresa: '',
};

// --- Code Generator constants ---

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanKey, SubscriptionPlan> = {
  monthly: { name: 'Mensual', duration: 30, price: '$29.99' },
  quarterly: { name: 'Trimestral', duration: 90, price: '$79.99' },
  annual: { name: 'Anual', duration: 365, price: '$299.99' },
};

export const WORKSHOP_TYPES = [
  { value: 'electronica', label: 'Electrónica' },
  { value: 'mecanica', label: 'Mecánica Automotriz' },
  { value: 'computacion', label: 'Computación/IT' },
  { value: 'celulares', label: 'Celulares' },
  { value: 'electrodomesticos', label: 'Electrodomésticos' },
  { value: 'bicicletas', label: 'Bicicletas' },
  { value: 'general', label: 'General/Mixto' },
  { value: 'otro', label: 'Otro' },
];

export const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia Bancaria' },
  { value: 'tarjeta', label: 'Tarjeta de Crédito/Débito' },
  { value: 'mercadopago', label: 'MercadoPago' },
  { value: 'cheque', label: 'Cheque' },
];

export const CODE_STATUS_COLORS: Record<string, string> = {
  expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  expiring_soon: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  used: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export const CODE_STATUS_LABELS: Record<string, string> = {
  expired: 'Vencido',
  expiring_soon: 'Por vencer',
  used: 'Usado',
  active: 'Activo',
};

export const INITIAL_COMPANY_DATA_ENTRY = {
  cuit: '',
  owner: '',
  workshopType: '',
  paymentMethod: '',
};
