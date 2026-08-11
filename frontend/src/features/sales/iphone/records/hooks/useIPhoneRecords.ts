import { useState } from 'react';
import type { IPhoneRecordForm, PaymentMethod, BillingCycle } from '../types';

export function useIPhoneRecords() {
  const [currentStep, setCurrentStep] = useState(1);
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [formData, setFormData] = useState<IPhoneRecordForm>({
    model: 'iPhone 15 Pro Max',
    color: 'Titanium Black',
    imei: '',
    fullName: '',
    email: '',
    insurancePlan: 'Full Coverage (Theft + Damage)',
    premium: 14.99,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const devicePrice = 1199.00;
  const salesTax = devicePrice * 0.08;
  const insurancePremium = insuranceEnabled ? formData.premium : 0;
  const total = devicePrice + salesTax + insurancePremium;
  const progressPercentage = (currentStep / 4) * 100;

  const stepLabels = ['Producto', 'Cliente', 'Seguro', 'Pago'];

  return {
    currentStep, setCurrentStep,
    insuranceEnabled, setInsuranceEnabled,
    billingCycle, setBillingCycle,
    paymentMethod, setPaymentMethod,
    formData, handleInputChange,
    devicePrice, salesTax, insurancePremium, total, progressPercentage,
    stepLabels,
  };
}
