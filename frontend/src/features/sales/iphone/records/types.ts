export interface IPhoneRecordForm {
  model: string;
  color: string;
  imei: string;
  fullName: string;
  email: string;
  insurancePlan: string;
  premium: number;
}

export type PaymentMethod = 'card' | 'finance';
export type BillingCycle = 'monthly' | 'annual';
