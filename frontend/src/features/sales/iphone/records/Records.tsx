import { useIPhoneRecords } from './hooks/useIPhoneRecords';
import { RecordsHeader } from './components/RecordsHeader';
import { ProductSelection } from './components/ProductSelection';
import { CustomerInfo } from './components/CustomerInfo';
import { InsuranceOptions } from './components/InsuranceOptions';
import { PaymentDetails } from './components/PaymentDetails';
import { RecordsActions } from './components/RecordsActions';

export default function IPhoneRecords() {
  const {
    currentStep, setCurrentStep, insuranceEnabled, setInsuranceEnabled,
    billingCycle, setBillingCycle, paymentMethod, setPaymentMethod,
    formData, handleInputChange, devicePrice, salesTax,
    insurancePremium, total, progressPercentage, stepLabels,
  } = useIPhoneRecords();

  return (
    <div className="space-y-6">
      <RecordsHeader currentStep={currentStep} progressPercentage={progressPercentage} stepLabel={stepLabels[currentStep - 1]} />
      <div className="space-y-6">
        <ProductSelection formData={formData} onInputChange={handleInputChange} />
        <CustomerInfo formData={formData} onInputChange={handleInputChange} />
        <InsuranceOptions
          formData={formData} insuranceEnabled={insuranceEnabled} billingCycle={billingCycle}
          onToggleInsurance={setInsuranceEnabled} onInputChange={handleInputChange}
          onBillingCycleChange={setBillingCycle}
        />
        <PaymentDetails
          paymentMethod={paymentMethod} devicePrice={devicePrice}
          insurancePremium={insurancePremium} salesTax={salesTax} total={total}
          insuranceEnabled={insuranceEnabled} onPaymentMethodChange={setPaymentMethod}
        />
        <RecordsActions
          currentStep={currentStep}
          onBack={() => setCurrentStep(Math.max(1, currentStep - 1))}
          onNext={() => setCurrentStep(Math.min(4, currentStep + 1))}
        />
      </div>
    </div>
  );
}
