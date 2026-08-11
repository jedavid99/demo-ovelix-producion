import { CreditCard, DollarSign, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FinancialSettlementProps {
  subtotal: number;
  depositPaid: number;
  finalBalance: number;
  paymentMethod: string;
  withWarranty: boolean;
  termsAccepted: boolean;
  signaturePad: string;
  onPaymentMethodChange: (method: string) => void;
  onWarrantyChange: (value: boolean) => void;
  onComplete: () => void;
}

export function FinancialSettlement({
  subtotal, depositPaid, finalBalance, paymentMethod, withWarranty,
  termsAccepted, signaturePad,
  onPaymentMethodChange, onWarrantyChange, onComplete,
}: FinancialSettlementProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
      <div className="bg-slate-900 text-white p-6">
        <h2 className="text-lg font-bold">Liquidación Financiera</h2>
        <p className="text-muted-foreground text-xs mt-1">Finaliza el pago antes de la entrega</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Presupuesto Total</span>
            <span className="font-bold text-foreground">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-success bg-green-50 p-2 rounded border border-green-100">
            <span>Depósito Pagado</span>
            <span className="font-bold">-${depositPaid.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Saldo a Pagar</p>
              <p className="text-2xl font-bold text-primary">${finalBalance.toFixed(2)}</p>
            </div>
            <DollarSign className="text-primary text-3xl" />
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-6">
          <p className="text-xs font-bold text-foreground uppercase tracking-wide">Método de Pago</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'card', label: 'Tarjeta', icon: CreditCard },
              { id: 'cash', label: 'Efectivo', icon: DollarSign },
              { id: 'transfer', label: 'Depósito', icon: AlertCircle },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => onPaymentMethodChange(id)}
                className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                  paymentMethod === id
                    ? 'border-blue-600 bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-border'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-bold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary" size={20} />
            <div>
              <p className="text-sm font-bold text-foreground">Aplicar Garantía</p>
              <p className="text-xs text-muted-foreground">90 días piezas & mano de obra</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={withWarranty}
              onChange={(e) => onWarrantyChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-primary" />
          </label>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <button onClick={onComplete}
            disabled={!termsAccepted || !signaturePad}
            className={`w-full font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all ${
              termsAccepted && signaturePad
                ? 'bg-primary hover:bg-primary-hover text-white shadow-lg'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={20} />
            Completar Entrega
          </button>
          <button className="w-full bg-muted border border-border text-muted-foreground font-bold py-3 px-6 rounded-lg hover:bg-muted transition-all">
            Guardar como Borrador
          </button>
          <p className="text-center text-xs text-muted-foreground italic">
            Al completar, se enviará confirmación por SMS y Email al cliente.
          </p>
        </div>
      </div>
    </div>
  );
}
