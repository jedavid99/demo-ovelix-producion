import { useRepairFinalize } from './hooks/useRepairFinalize';
import { FinalizeHeader } from './components/FinalizeHeader';
import { RepairSummaryCard } from './components/RepairSummaryCard';
import { TermsSignatureCard } from './components/TermsSignatureCard';
import { FinancialSettlement } from './components/FinancialSettlement';
import type { RepairFinalizeProps } from './types';

export default function RepairFinalize({ data, updateData, onBack = () => {}, onComplete = () => {}, currentStep = 3 }: RepairFinalizeProps) {
  const {
    state, paymentMethod, setPaymentMethod, withWarranty, setWithWarranty,
    applyUpdate, subtotal, depositPaid, finalBalance,
  } = useRepairFinalize({ data, updateData });

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-[1200px] mx-auto p-6 md:p-8">
        <FinalizeHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <RepairSummaryCard state={state} />
            <TermsSignatureCard state={state} applyUpdate={applyUpdate} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <FinancialSettlement
                subtotal={subtotal} depositPaid={depositPaid} finalBalance={finalBalance}
                paymentMethod={paymentMethod} withWarranty={withWarranty}
                termsAccepted={state.termsAccepted} signaturePad={state.signaturePad}
                onPaymentMethodChange={setPaymentMethod} onWarrantyChange={setWithWarranty}
                onComplete={onComplete}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
