export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  nif?: string;
  codigoEmpresa: string;
}

export interface UserData {
  fullName: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  codigoEmpresa?: string;
  role?: string;
  dni?: string;
}

export interface CompanyData {
  razonSocial: string;
  nombreFantasia: string;
  address: string;
  googleMapsLink?: string;
  phone: string;
  email: string;
  cuit: string;
  owner: string;
  paymentMethod: string;
  workshopType: string;
  nif?: string;
  codigoEmpresa: string;
}

export interface StoredActivationCode {
  code: string;
  expiresAt: string;
  used?: boolean;
  usedAt?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  companyDetails?: CompanyData;
}

export interface StepItem {
  number: number;
  label: string;
}

// --- Code Generator types ---

export type SubscriptionPlanKey = 'monthly' | 'quarterly' | 'annual';

export interface SubscriptionPlan {
  name: string;
  duration: number;
  price: string;
}

export type CodeStatus = 'active' | 'expired' | 'expiring_soon';

export interface CompanyDetails {
  razonSocial: string;
  nombreFantasia: string;
  address: string;
  googleMapsLink?: string;
  phone: string;
  email: string;
  cuit: string;
  owner: string;
  paymentMethod: string;
  workshopType: string;
}

export interface ActivationCode {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  plan: SubscriptionPlanKey;
  used: boolean;
  usedAt?: string;
  userEmail?: string;
  userName?: string;
  companyDetails?: CompanyDetails;
  status: CodeStatus;
}

export interface CompanyDataEntry {
  cuit: string;
  owner: string;
  workshopType: string;
  paymentMethod: string;
}

export interface CodeStats {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
}
