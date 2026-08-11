import { CreditCard, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '@/utils/currency';
import { PAYMENT_METHODS } from '../../constants/sales/sales.constants';
import type { CartItem, CustomerInfo } from '../../types/sales/sales.types';

interface PaymentReviewProps {
  cart: CartItem[];
  customerInfo: CustomerInfo;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  insuranceTotal: number;
  total: number;
  onPaymentChange: (method: string) => void;
  onBack: () => void;
  onComplete: () => void;
}

export const PaymentReview = ({
  cart, customerInfo, paymentMethod,
  subtotal, tax, insuranceTotal, total,
  onPaymentChange, onBack, onComplete,
}: PaymentReviewProps) => (
  <div className="max-w-2xl mx-auto space-y-6">
    <h2 className="text-2xl font-bold text-foreground">Pago y confirmación</h2>
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-foreground mb-4">Revisión del pedido</h3>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">{item.model} x{item.quantity}</p>
                  <p className="text-sm text-muted-foreground">{item.storage} &bull; {item.color}</p>
                </div>
                <p className="font-semibold text-foreground">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border pt-6">
          <h3 className="font-semibold text-foreground mb-4">Entregar a</h3>
          <p className="text-foreground">{customerInfo.name}</p>
          <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
          <p className="text-sm text-muted-foreground">{customerInfo.phone}</p>
          <p className="text-sm text-muted-foreground">{customerInfo.address}</p>
        </div>
        <div className="border-t border-border pt-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard size={18} /> Método de pago
          </h3>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(method => {
              const Icon = method.icon;
              return (
                <label
                  key={method.id}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-input hover:border-primary'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => onPaymentChange(e.target.value)}
                    className="mr-3"
                  />
                  <Icon size={18} />
                  {method.label}
                </label>
              );
            })}
          </div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Impuesto</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          {insuranceTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Seguro</span>
              <span className="font-medium">{formatCurrency(insuranceTotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold text-primary pt-2 border-t border-border">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
    <div className="flex gap-3">
      <Button onClick={onBack} variant="outline" className="flex-1">Atrás</Button>
      <Button onClick={onComplete} className="flex-1">
        <CheckCircle size={20} className="mr-2" /> Completar venta
      </Button>
    </div>
  </div>
);
