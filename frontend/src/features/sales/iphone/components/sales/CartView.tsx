import { ShoppingCart, X, Minus, Plus, Shield } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { formatCurrency } from '@/utils/currency';
import type { CartItem, InsurancePlan } from '../../types/sales/sales.types';

interface CartViewProps {
  cart: CartItem[];
  insurancePlans: InsurancePlan[];
  insuranceSelection: Record<string, string>;
  subtotal: number;
  tax: number;
  insuranceTotal: number;
  total: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onInsuranceSelect: (itemId: string, planId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const CartView = ({
  cart, insurancePlans, insuranceSelection,
  subtotal, tax, insuranceTotal, total,
  onUpdateQuantity, onRemove, onInsuranceSelect,
  onContinue, onBack,
}: CartViewProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-foreground">Carrito de compras ({cart.length})</h2>
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {cart.map(item => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-foreground">{item.model}</h3>
                  <p className="text-sm text-muted-foreground">{item.storage} &bull; {item.color}</p>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => onRemove(item.id)}>
                  <X size={16} className="text-destructive" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" size="icon-sm" onClick={() => onUpdateQuantity(item.id, -1)}>
                  <Minus size={16} />
                </Button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <Button variant="outline" size="icon-sm" onClick={() => onUpdateQuantity(item.id, 1)}>
                  <Plus size={16} />
                </Button>
              </div>
              {insurancePlans.length > 0 && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield size={16} /> Agregar seguro
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {insurancePlans.map(plan => (
                      <Button
                        key={plan.id}
                        variant={insuranceSelection[item.id] === plan.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onInsuranceSelect(item.id, plan.id)}
                      >
                        {plan.name}
                        {plan.price > 0 && <span className="text-[10px]"> (+${plan.price})</span>}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                <span className="font-bold text-foreground">Subtotal:</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="h-fit sticky top-20">
        <CardContent className="p-6">
          <h3 className="font-bold text-foreground mb-4">Resumen del pedido</h3>
          <div className="space-y-3 mb-6 pb-6 border-b border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Impuesto (8%)</span>
              <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
            </div>
            {insuranceTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seguro</span>
                <span className="font-medium text-foreground">{formatCurrency(insuranceTotal)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between mb-6">
            <span className="font-bold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>
          <Button onClick={onContinue} className="w-full mb-3">
            Continuar a información del cliente
          </Button>
          <Button onClick={onBack} variant="outline" className="w-full">
            Volver al catálogo
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);
