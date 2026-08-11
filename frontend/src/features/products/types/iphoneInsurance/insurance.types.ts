export interface InsuranceFormData {
  imei: string;
  serialNumber: string;
  model: string;
  insuranceProvider: string;
  policyNumber: string;
  coverageType: 'screen' | 'theft' | 'full' | 'custom';
  startDate: string;
  endDate: string;
  premium: string;
  deductible: string;
  coverageAmount: string;
  notes: string;
}
