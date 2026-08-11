import { CreditCard, Wallet, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import type { PaymentMethod } from '../types';

interface PaymentDetailsProps {
  paymentMethod: PaymentMethod;
  devicePrice: number;
  insurancePremium: number;
  salesTax: number;
  total: number;
  insuranceEnabled: boolean;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}

export function PaymentDetails({
  paymentMethod, devicePrice, insurancePremium, salesTax, total,
  insuranceEnabled, onPaymentMethodChange,
}: PaymentDetailsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center size-8 bg-primary/10 text-primary rounded-full font-bold text-sm">4</div>
          <h2 className="text-foreground text-xl font-bold">Detalles de Pago</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => onPaymentMethodChange('card')}
              className="w-full justify-start h-auto py-4"
            >
              <CreditCard size={24} className="mr-3" />
              <div className="flex-1 text-left">
                <p className="font-bold">Tarjeta de Crédito / Débito</p>
                <p className="text-xs text-muted-foreground">Pago seguro vía Stripe</p>
              </div>
              {paymentMethod === 'card' && <CheckCircle size={20} />}
            </Button>
            <Button
              variant={paymentMethod === 'finance' ? 'default' : 'outline'}
              onClick={() => onPaymentMethodChange('finance')}
              className="w-full justify-start h-auto py-4"
            >
              <Wallet size={24} className="mr-3" />
              <div className="flex-1 text-left">
                <p className="font-bold">Plan de Financiamiento</p>
                <p className="text-xs text-muted-foreground">Aprobación en 60 segundos</p>
              </div>
              {paymentMethod === 'finance' && <CheckCircle size={20} />}
            </Button>
          </div>
          <Card className="bg-muted/50">
            <CardContent className="p-6 flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">iPhone 15 Pro Max (256GB)</span>
                <span className="font-medium text-foreground">${devicePrice.toFixed(2)}</span>
              </div>
              {insuranceEnabled && (
                <div className="flex justify-between text-sm text-success font-medium">
                  <span>Prima de Seguro (Mensual)</span>
                  <span>${insurancePremium.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impuesto Estimado (8%)</span>
                <span className="font-medium text-foreground">${salesTax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold text-foreground">Total a Pagar Hoy</span>
                <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
